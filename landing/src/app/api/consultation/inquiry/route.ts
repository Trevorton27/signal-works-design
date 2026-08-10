import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { createAndSendInvite } from '@/lib/consultation';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const data = await req.json();

  if (!data.fullName || !data.email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const sections = [
    '--- ABOUT ---',
    `Name: ${data.fullName}`,
    `Company: ${data.company || 'N/A'}`,
    `Job Title: ${data.jobTitle || 'N/A'}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || 'N/A'}`,
    `Preferred Contact: ${data.contactMethod || 'N/A'}`,
    '',
    '--- PROJECT ---',
    `Type: ${data.projectType || 'N/A'}`,
    `Idea: ${data.projectIdea || 'N/A'}`,
    `Problem to Solve: ${data.problemToSolve || 'N/A'}`,
    '',
    '--- PROJECT DETAILS ---',
    `Status: ${data.projectStatus || 'N/A'}`,
    `Existing Assets: ${data.existingAssets?.join(', ') || 'None'}`,
    `Existing System Info: ${data.existingSystemInfo || 'N/A'}`,
    '',
    '--- FEATURES ---',
    `Selected: ${data.selectedFeatures?.join(', ') || 'None'}`,
    '',
    '--- AI ---',
    `Interest: ${data.aiInterest || 'N/A'}`,
    `Capabilities: ${data.aiCapabilities?.join(', ') || 'None'}`,
    '',
    '--- TIMELINE ---',
    `Start: ${data.timeline || 'N/A'}`,
    `Launch Date: ${data.launchDate || 'N/A'}`,
    '',
    '--- BUDGET ---',
    `Estimated: ${data.budget || 'N/A'}`,
    '',
    '--- SUCCESS ---',
    `Criteria: ${data.successCriteria || 'N/A'}`,
    '',
    '--- CONSULTATION ---',
    `Meeting Length: ${data.meetingLength || 'N/A'}`,
    `Preferred Times: ${data.meetingTimes?.join(', ') || 'N/A'}`,
    `Timezone: ${data.timezone || 'N/A'}`,
    '',
    '--- OTHER ---',
    `Additional Info: ${data.anythingElse || 'N/A'}`,
    '',
    '--- LEAD QUALIFICATION ---',
    `Lead Source: ${data.leadSource || 'N/A'}`,
    `Referrer: ${data.referrer || 'N/A'}`,
    `Landing Page: ${data.landingPage || 'N/A'}`,
    `UTM Params: ${data.utmParams || 'N/A'}`,
    `AI Interest Score: ${computeAiScore(data)}`,
    `Estimated Size: ${estimateSize(data)}`,
  ].join('\n');

  // Always log to server console for debugging / local dev
  console.log('[consultation/inquiry] New submission:\n' + sections);

  // Send email notification to admin (skip if Resend not configured)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: 'Signal Works <contact@email.signalworksdesign.com>',
        to: 'trevor-sensei@signalworksdesign.com',
        replyTo: data.email,
        subject: `New consultation inquiry from ${data.fullName}`,
        text: sections,
      });
      if (error) {
        console.error('[consultation/inquiry] email error:', error);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[consultation/inquiry] email send failed:', msg);
    }
  } else {
    console.warn('[consultation/inquiry] RESEND_API_KEY not set, skipping email');
  }

  // Send booking invite to the prospective client (skip if DB not configured)
  try {
    await createAndSendInvite(data.fullName, data.email, 'landing');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[consultation/inquiry] invite failed for', data.email, '—', msg);
  }

  return NextResponse.json({ success: true });
}

function computeAiScore(data: Record<string, unknown>): string {
  let score = 0;
  if (data.aiInterest === 'Yes') score += 3;
  if (data.aiInterest === 'Maybe') score += 1;
  const caps = data.aiCapabilities as string[] | undefined;
  if (caps) score += caps.length;
  const feats = data.selectedFeatures as string[] | undefined;
  if (feats) {
    if (feats.includes('ai_chat')) score += 2;
    if (feats.includes('ai_documents')) score += 2;
    if (feats.includes('ai_search')) score += 2;
  }
  if (data.projectType === 'AI Assistant / Chatbot') score += 3;
  return `${score}/20`;
}

function estimateSize(data: Record<string, unknown>): string {
  const b = data.budget as string | undefined;
  if (!b) return 'Unknown';
  if (b.includes('3M')) return 'Enterprise';
  if (b.includes('1M')) return 'Large';
  if (b.includes('500k')) return 'Medium';
  if (b.includes('250')) return 'Small';
  return 'Unknown';
}
