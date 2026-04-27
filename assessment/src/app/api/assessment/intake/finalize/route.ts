import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { getSessionSummary } from '@/server/assessment/intakeService';
import { getStepById } from '@/server/assessment/intakeConfig';
import { sendAssessmentEmails } from '@/server/assessment/emailService';
import { generateRoadmap } from '@/server/assessment/roadmapService';

/**
 * POST /api/assessment/intake/finalize
 *
 * Explicitly sends assessment result emails for the current user's most recent
 * completed or in-progress session. Called from the summary page CTA.
 */
export async function POST() {
  try {
    const user = await requireAuth();

    // Find the most recent session (completed or in-progress)
    const session = await prisma.assessmentSession.findFirst({
      where: { userId: user.id, sessionType: 'INTAKE' },
      orderBy: { startedAt: 'desc' },
      include: { responses: { orderBy: { submittedAt: 'asc' } } },
    });

    if (!session) {
      return NextResponse.json({ success: false, error: 'No assessment session found' }, { status: 404 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, email: true },
    });

    if (!dbUser?.email) {
      return NextResponse.json({ success: false, error: 'User email not found' }, { status: 400 });
    }

    const summary = await getSessionSummary(session.id);
    if (!summary) {
      return NextResponse.json({ success: false, error: 'Could not build session summary' }, { status: 500 });
    }

    const { profileSummary } = summary;
    const overallPct = Math.round(profileSummary.overallScore * 100);
    const level =
      profileSummary.overallScore >= 0.8 ? 'Advanced'
      : profileSummary.overallScore >= 0.6 ? 'Proficient'
      : profileSummary.overallScore >= 0.4 ? 'Developing'
      : 'Beginner';

    const assessed = profileSummary.dimensions.filter((d) => d.assessedRatio > 0);
    const strengths = assessed.filter((d) => d.score >= 0.7).map((d) => `${d.label} (${Math.round(d.score * 100)}%)`);
    const weaknesses = assessed.filter((d) => d.score < 0.4).map((d) => `${d.label} (${Math.round(d.score * 100)}%)`);

    const weakAreas = assessed.filter((d) => d.score < 0.4).sort((a, b) => a.score - b.score);
    const recommendations: string[] = [];
    if (weakAreas.length > 0) {
      recommendations.push(`Focus on strengthening your ${weakAreas[0].label} skills first`);
    }
    recommendations.push(
      profileSummary.overallScore >= 0.6
        ? 'You have a solid foundation — consider tackling a capstone project'
        : 'Start with the fundamentals and build up your skills progressively'
    );
    recommendations.push('Our team will reach out soon to discuss your personalized learning plan');

    const answers = session.responses
      .filter((r) => {
        const raw = r.rawAnswer as any;
        return !raw?._skipped && !raw?._noIdea;
      })
      .map((r) => {
        const stepConfig = getStepById(r.stepId);
        const raw = r.rawAnswer as any;
        const answerText =
          typeof raw === 'string'
            ? raw
            : typeof raw?.answer === 'string'
              ? raw.answer
              : JSON.stringify(raw);
        return {
          questionId: r.stepId,
          question: stepConfig?.title ?? r.stepId,
          answer: answerText,
          category: stepConfig?.kind,
        };
      });

    // Extract hobbies, AI motivation, learning style from questionnaire responses
    const backgroundResponse = session.responses.find((r) => r.stepId === 'questionnaire_background');
    const backgroundRaw = backgroundResponse?.rawAnswer as any;
    const hobbiesInterests: string[] = backgroundRaw?.hobbies_interests ?? [];
    const aiMotivation: string | undefined = backgroundRaw?.ai_motivation;
    const learningGoal: string | undefined = backgroundRaw?.learning_goal;

    const styleResponse = session.responses.find((r) => r.stepId === 'questionnaire_learning_style');
    const styleRaw = styleResponse?.rawAnswer as any;
    const weeklyHours: string | undefined = styleRaw?.weekly_hours;
    const learningStyle: string | undefined = styleRaw?.learning_style;

    // Generate AI roadmap (non-blocking if it fails)
    const roadmap = await generateRoadmap({
      name: dbUser.name || 'Student',
      level,
      score: overallPct,
      strengths,
      weaknesses,
      learningGoal,
      hobbiesInterests,
      aiMotivation,
      weeklyHours,
      learningStyle,
    });

    const proposedRoadmap = roadmap?.phases.map((p) => ({
      phase: p.phase,
      focus: `${p.focus} (${p.duration})`,
      goals: p.goals,
      suggestedResources: p.suggestedResources,
    }));

    if (roadmap) {
      recommendations.unshift(`First step: ${roadmap.firstStep}`);
    }

    const error = await sendAssessmentEmails({
      name: dbUser.name || 'Student',
      email: dbUser.email,
      score: overallPct,
      level,
      summary: roadmap?.summary ?? `Completed ${profileSummary.totalSkillsAssessed} of ${profileSummary.totalSkills} skill areas. Overall score: ${overallPct}% (${level}).`,
      strengths: strengths.length > 0 ? strengths : undefined,
      weaknesses: weaknesses.length > 0 ? weaknesses : undefined,
      recommendations,
      proposedRoadmap,
      answers,
    });

    if (error) {
      logger.error('finalize: sendAssessmentEmails failed', { error, userId: user.id });
      return NextResponse.json({ success: false, error }, { status: 500 });
    }

    logger.info('finalize: emails sent successfully', { userId: user.id, sessionId: session.id });
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    logger.error('POST /api/assessment/intake/finalize failed', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
