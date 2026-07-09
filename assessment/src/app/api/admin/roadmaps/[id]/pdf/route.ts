import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { generateRoadmapPdf } from '@/server/assessment/roadmapPdf';
import { editRoadmapWithAI } from '@/server/assessment/roadmapService';
import type { RoadmapPhase, RoadmapProject, GeneratedRoadmap } from '@/server/assessment/roadmapService';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  // ?lang=ja forces Japanese output; otherwise use the stored language preference
  const langParam = searchParams.get('lang');

  const roadmap = await prisma.assessmentRoadmap.findUnique({
    where: { id: params.id },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!roadmap) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const phases = roadmap.phases as unknown as RoadmapPhase[];
  const projects = roadmap.projects as unknown as RoadmapProject[];

  // Determine output language: explicit param → stored preference → English
  const storedLanguage = (roadmap as any).language as string | undefined;
  const language: 'en' | 'ja' =
    langParam === 'ja' ? 'ja'
    : langParam === 'en' ? 'en'
    : storedLanguage === 'ja' ? 'ja'
    : 'en';

  let roadmapContent: GeneratedRoadmap = {
    summary: roadmap.summary,
    totalDuration: roadmap.totalDuration,
    firstStep: roadmap.firstStep,
    phases,
    projects,
  };

  // When the stored language is English but Japanese output is requested,
  // translate the roadmap content via Claude before rendering.
  const storedIsEnglish = !storedLanguage || storedLanguage === 'en';
  if (language === 'ja' && storedIsEnglish) {
    const translated = await editRoadmapWithAI(
      roadmapContent,
      'Translate all text content to Japanese (日本語). Keep URLs, code commands ($  npm ..., git config ...), technical product names (GitHub, VS Code, Node.js, React, Vercel, etc.), and email addresses unchanged. Translate everything else — phase names, goals, project titles, descriptions, summaries, firstStep, capstoneProject, and skill labels.'
    );
    if (translated) roadmapContent = translated;
  }

  const pdf = await generateRoadmapPdf(
    roadmap.user.name ?? 'Student',
    roadmapContent,
    roadmap.score,
    language
  );

  const langSuffix = language === 'ja' ? '-jp' : '';
  const filename = `roadmap-${(roadmap.user.name ?? 'student').toLowerCase().replace(/\s+/g, '-')}${langSuffix}.pdf`;

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
