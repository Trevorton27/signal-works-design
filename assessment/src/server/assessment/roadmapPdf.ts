/**
 * Generates a PDF buffer of an AI-generated roadmap using pdfkit.
 * Supports English ('en') and Japanese ('ja') output.
 */

import PDFDocument from 'pdfkit';
import path from 'path';
import type { GeneratedRoadmap, RoadmapProject, RoadmapResource } from './roadmapService';

// Fonts for Japanese output — committed to assessment/fonts/
const FONT_DIR = path.join(process.cwd(), 'fonts');
const JP_REGULAR = path.join(FONT_DIR, 'NotoSansJP-Regular.otf');
const JP_BOLD = path.join(FONT_DIR, 'NotoSansJP-Bold.otf');

// Per-language static UI strings
const LABELS = {
  en: {
    setupHeading: 'Your Setup Steps',
    createAccounts: '1. CREATE ACCOUNTS',
    installSoftware: '2. INSTALL SOFTWARE',
    installExtensions: '3. INSTALL VS CODE EXTENSIONS',
    installCli: '4. INSTALL CLI TOOLS (run in terminal after Node.js is installed)',
    configureGit: '5. CONFIGURE GIT (run in terminal)',
    learningPhases: 'Learning Phases',
    focus: 'FOCUS',
    goals: 'GOALS',
    resources: 'RESOURCES',
    capstone: 'CAPSTONE PROJECT',
    projectsHeading: 'Projects to Build',
    skills: 'SKILLS',
    firstStepLabel: 'YOUR FIRST STEP',
    beforeYouBegin: 'Before You Begin: Setup',
    accountsToCreate: 'ACCOUNTS TO CREATE',
    appsToDownload: 'APPS TO DOWNLOAD',
    capstoneBadge: '· Capstone',
  },
  ja: {
    setupHeading: 'セットアップ手順',
    createAccounts: '1. アカウントを作成する',
    installSoftware: '2. ソフトウェアをインストールする',
    installExtensions: '3. VS Code 拡張機能をインストールする',
    installCli: '4. CLIツールをインストールする（Node.jsインストール後にターミナルで実行）',
    configureGit: '5. GITを設定する（ターミナルで実行）',
    learningPhases: '学習フェーズ',
    focus: 'フォーカス',
    goals: '目標',
    resources: 'リソース',
    capstone: 'カプストーンプロジェクト',
    projectsHeading: '構築するプロジェクト',
    skills: 'スキル',
    firstStepLabel: '最初のステップ',
    beforeYouBegin: '始める前に：セットアップ',
    accountsToCreate: '作成するアカウント',
    appsToDownload: 'インストールするアプリ',
    capstoneBadge: '· カプストーン',
  },
};

const SETUP_ACCOUNTS_JA = [
  { name: 'GitHub', url: 'github.com', note: 'すべてのコード無料ホスティング — すべてのプロジェクトに必須' },
  { name: 'Vercel', url: 'vercel.com', note: 'プロジェクトをすぐに本番公開（GitHubでサインアップ）' },
  { name: 'Claude.ai', url: 'claude.ai', note: 'コーディングサポートと説明のためのAIアシスタント' },
  { name: 'Figma', url: 'figma.com', note: 'アプリのUIをデザイン・ワイヤーフレーム' },
];

const SETUP_SOFTWARE_JA = [
  { name: 'Git', url: 'git-scm.com', note: 'バージョン管理 — 他のものより先にインストール' },
  { name: 'Node.js (LTS)', url: 'nodejs.org', note: 'すべてのウェブプロジェクトに必要なJavaScriptランタイム' },
  { name: 'VS Code', url: 'code.visualstudio.com', note: 'プロ開発者の多くが使用するコードエディタ' },
];

const SETUP_EXTENSIONS_JA = [
  { name: 'Prettier - Code Formatter', note: '保存時にコードを自動フォーマット' },
  { name: 'ESLint', note: 'エラーを検出しコードスタイルを統一' },
  { name: 'GitLens', note: 'エディタ内でgit履歴とblameを確認' },
  { name: 'Error Lens', note: '入力中にエラーをインラインで強調表示' },
  { name: 'GitHub Copilot', note: 'AIコード補完 — 学生は無料' },
];

const SETUP_CLI_JA = [
  { cmd: 'npm install -g @anthropic-ai/claude-code', note: 'Claude Code — ターミナルのAIコーディングアシスタント' },
  { cmd: 'npm install -g vercel', note: 'Vercel CLI — コマンドラインから本番環境にデプロイ' },
];

const SETUP_GIT_CONFIG_JA = [
  { cmd: 'git config --global user.name "Your Name"', note: 'すべてのコミットにIDを設定' },
  { cmd: 'git config --global user.email "you@email.com"', note: 'GitHubのメールアドレスと一致させること' },
];

function resourceLabel(r: RoadmapResource | string): string {
  if (typeof r === 'string') return r;
  return r.url ? `${r.title} — ${r.url}` : r.title;
}

const SETUP_ACCOUNTS = [
  { name: 'GitHub', url: 'github.com', note: 'Free hosting for all your code — required for every project' },
  { name: 'Vercel', url: 'vercel.com', note: 'Deploy your projects live instantly (sign up with GitHub)' },
  { name: 'Claude.ai', url: 'claude.ai', note: 'AI assistant for coding help and explanations' },
  { name: 'Figma', url: 'figma.com', note: 'Design and wireframe your app UI' },
];

const SETUP_SOFTWARE = [
  { name: 'Git', url: 'git-scm.com', note: 'Version control — install this first before anything else' },
  { name: 'Node.js (LTS)', url: 'nodejs.org', note: 'JavaScript runtime required for all web projects' },
  { name: 'VS Code', url: 'code.visualstudio.com', note: 'Code editor used by most professional developers' },
];

const SETUP_EXTENSIONS = [
  { name: 'Prettier - Code Formatter', note: 'Auto-formats your code on save' },
  { name: 'ESLint', note: 'Catches errors and enforces code style' },
  { name: 'GitLens', note: 'See git history and blame inside your editor' },
  { name: 'Error Lens', note: 'Highlights errors inline as you type' },
  { name: 'GitHub Copilot', note: 'AI code completion — free for students' },
];

const SETUP_CLI = [
  { cmd: 'npm install -g @anthropic-ai/claude-code', note: 'Claude Code — AI coding assistant in your terminal' },
  { cmd: 'npm install -g vercel', note: 'Vercel CLI — deploy to production from the command line' },
];

const SETUP_GIT_CONFIG = [
  { cmd: 'git config --global user.name "Your Name"', note: 'Sets your identity for all commits' },
  { cmd: 'git config --global user.email "you@email.com"', note: 'Must match your GitHub email' },
];

export async function generateRoadmapPdf(
  studentName: string,
  roadmap: GeneratedRoadmap,
  score = 100,
  language: 'en' | 'ja' = 'en'
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const BLACK = '#111827';
    const PURPLE = '#4f46e5';
    const GRAY = '#6b7280';
    const LIGHT_GRAY = '#f3f4f6';
    const PAGE_WIDTH = doc.page.width - 100; // margins

    const isJa = language === 'ja';
    const L = isJa ? LABELS.ja : LABELS.en;

    // Register Japanese fonts when needed
    const FONT_REGULAR = isJa ? 'JP' : 'Helvetica';
    const FONT_BOLD = isJa ? 'JP-Bold' : 'Helvetica-Bold';
    if (isJa) {
      doc.registerFont('JP', JP_REGULAR);
      doc.registerFont('JP-Bold', JP_BOLD);
    }

    // Localised setup content
    const setupAccounts = isJa ? SETUP_ACCOUNTS_JA : SETUP_ACCOUNTS;
    const setupSoftware = isJa ? SETUP_SOFTWARE_JA : SETUP_SOFTWARE;
    const setupExtensions = isJa ? SETUP_EXTENSIONS_JA : SETUP_EXTENSIONS;
    const setupCli = isJa ? SETUP_CLI_JA : SETUP_CLI;
    const setupGitConfig = isJa ? SETUP_GIT_CONFIG_JA : SETUP_GIT_CONFIG;

    const dateStr = isJa
      ? new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const preparedForLabel = isJa ? `作成対象：${studentName}` : `Prepared for: ${studentName}`;
    const timelineLabel = isJa ? `期間：${roadmap.totalDuration}` : `Timeline: ${roadmap.totalDuration}`;
    const generatedLabel = isJa ? `作成日：${dateStr}` : `Generated: ${dateStr}`;

    // ── Header ──────────────────────────────────────────────
    doc.rect(0, 0, doc.page.width, 80).fill(BLACK);
    doc.fillColor('#ffffff').fontSize(18).font(FONT_BOLD)
      .text(isJa ? 'パーソナライズド学習ロードマップ' : 'Personalized Learning Roadmap', 50, 25);
    doc.fillColor('#9ca3af').fontSize(10).font(FONT_REGULAR)
      .text('Signal Works Design', 50, 50);

    doc.moveDown(3);

    // ── Student + Summary ────────────────────────────────────
    doc.fillColor(BLACK).fontSize(13).font(FONT_BOLD)
      .text(preparedForLabel);
    doc.moveDown(0.3);
    doc.fillColor(GRAY).fontSize(10).font(FONT_REGULAR)
      .text(timelineLabel, { continued: true })
      .text(`   |   ${generatedLabel}`)
    doc.moveDown(0.5);
    doc.fillColor(BLACK).fontSize(11).font(FONT_REGULAR)
      .text(roadmap.summary, { width: PAGE_WIDTH, lineGap: 3 });

    doc.moveDown(1);

    if (score < 50) {
      // ── Setup Steps (beginners) ───────────────────────────
      if (doc.y > doc.page.height - 300) doc.addPage();
      doc.fillColor(BLACK).fontSize(14).font(FONT_BOLD).text(L.setupHeading);
      doc.moveDown(0.5);

      doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD).text(L.createAccounts);
      doc.moveDown(0.3);
      setupAccounts.forEach(({ name, url, note }) => {
        doc.fillColor(PURPLE).fontSize(10).font(FONT_BOLD)
          .text(`${name}  `, 62, doc.y, { continued: true });
        doc.fillColor(GRAY).fontSize(9).font(FONT_REGULAR)
          .text(`${url}  —  ${note}`, { lineGap: 3 });
      });

      doc.moveDown(0.8);
      doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD).text(L.installSoftware);
      doc.moveDown(0.3);
      setupSoftware.forEach(({ name, url, note }) => {
        doc.fillColor(PURPLE).fontSize(10).font(FONT_BOLD)
          .text(`${name}  `, 62, doc.y, { continued: true });
        doc.fillColor(GRAY).fontSize(9).font(FONT_REGULAR)
          .text(`${url}  —  ${note}`, { lineGap: 3 });
      });

      doc.moveDown(0.8);
      doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD).text(L.installExtensions);
      doc.moveDown(0.3);
      setupExtensions.forEach(({ name, note }) => {
        doc.fillColor(BLACK).fontSize(10).font(FONT_BOLD)
          .text(`${name}  `, 62, doc.y, { continued: true });
        doc.fillColor(GRAY).fontSize(9).font(FONT_REGULAR)
          .text(`— ${note}`, { lineGap: 3 });
      });

      doc.moveDown(0.8);
      doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD).text(L.installCli);
      doc.moveDown(0.3);
      setupCli.forEach(({ cmd, note }) => {
        doc.fillColor(PURPLE).fontSize(9).font(FONT_REGULAR)
          .text(`$ ${cmd}`, 62, doc.y, { lineGap: 2 });
        doc.fillColor(GRAY).fontSize(8).font(FONT_REGULAR)
          .text(`   ${note}`, { lineGap: 4 });
      });

      doc.moveDown(0.8);
      doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD).text(L.configureGit);
      doc.moveDown(0.3);
      setupGitConfig.forEach(({ cmd, note }) => {
        doc.fillColor(PURPLE).fontSize(9).font(FONT_REGULAR)
          .text(`$ ${cmd}`, 62, doc.y, { lineGap: 2 });
        doc.fillColor(GRAY).fontSize(8).font(FONT_REGULAR)
          .text(`   ${note}`, { lineGap: 4 });
      });

      doc.moveDown(1.5);
    } else {
      // ── First Step ─────────────────────────────────────────
      doc.font(FONT_REGULAR).fontSize(10);
      const firstStepTextH = doc.heightOfString(roadmap.firstStep, { width: PAGE_WIDTH - 24 });
      const firstStepBoxH = 14 + firstStepTextH + 20;
      const firstStepTop = doc.y;
      doc.rect(50, firstStepTop, PAGE_WIDTH, firstStepBoxH).fill(PURPLE);
      doc.fillColor('#ffffff').fontSize(10).font(FONT_BOLD)
        .text(L.firstStepLabel, 62, firstStepTop + 10);
      doc.fillColor('#e0e7ff').fontSize(10).font(FONT_REGULAR)
        .text(roadmap.firstStep, 62, firstStepTop + 24, { width: PAGE_WIDTH - 24 });
      doc.text('', 50, firstStepTop + firstStepBoxH);
      doc.moveDown(1);

      // ── Quick Setup Reference ───────────────────────────────
      if (doc.y > doc.page.height - 200) doc.addPage();
      doc.fillColor(BLACK).fontSize(14).font(FONT_BOLD).text(L.beforeYouBegin);
      doc.moveDown(0.5);

      doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD).text(L.accountsToCreate);
      doc.moveDown(0.3);
      setupAccounts.forEach(({ name, url, note }) => {
        doc.fillColor(PURPLE).fontSize(10).font(FONT_BOLD)
          .text(`${name}  `, 62, doc.y, { continued: true });
        doc.fillColor(GRAY).fontSize(9).font(FONT_REGULAR)
          .text(`${url}  —  ${note}`, { lineGap: 3 });
      });

      doc.moveDown(0.8);
      doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD).text(L.appsToDownload);
      doc.moveDown(0.3);
      setupSoftware.forEach(({ name, url, note }) => {
        doc.fillColor(PURPLE).fontSize(10).font(FONT_BOLD)
          .text(`${name}  `, 62, doc.y, { continued: true });
        doc.fillColor(GRAY).fontSize(9).font(FONT_REGULAR)
          .text(`${url}  —  ${note}`, { lineGap: 3 });
      });

      doc.moveDown(1.5);
    }

    // ── Phases ───────────────────────────────────────────────
    doc.fillColor(BLACK).fontSize(14).font(FONT_BOLD).text(L.learningPhases);
    doc.moveDown(0.5);

    roadmap.phases.forEach((phase, i) => {
      // Phase header bar — dynamic height to avoid text overflow
      const phaseLabel = isJa ? phase.phase : `Phase ${i + 1}: ${phase.phase}`;
      doc.font(FONT_BOLD).fontSize(11);
      const phaseTitleH = doc.heightOfString(phaseLabel, { width: PAGE_WIDTH - 80 });
      const phaseBarH = Math.max(28, phaseTitleH + 16);
      const barY = doc.y;
      doc.rect(50, barY, PAGE_WIDTH, phaseBarH).fill(LIGHT_GRAY);
      doc.fillColor(PURPLE).fontSize(11).font(FONT_BOLD)
        .text(phaseLabel, 62, barY + 8, { width: PAGE_WIDTH - 80 });
      doc.fillColor(GRAY).fontSize(9).font(FONT_REGULAR)
        .text(phase.duration, 62 + PAGE_WIDTH - 80, barY + 8 + (phaseTitleH - 11) / 2, { width: 70, align: 'right' });
      doc.text('', 50, barY + phaseBarH);
      doc.moveDown(0.8);
      doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD)
        .text(L.focus, { continued: true });
      doc.font(FONT_REGULAR).fillColor(BLACK)
        .text(`  ${phase.focus}`);

      doc.moveDown(0.4);
      doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD).text(L.goals);
      phase.goals.forEach((goal) => {
        doc.fillColor(BLACK).fontSize(10).font(FONT_REGULAR)
          .text(`• ${goal}`, { indent: 12, width: PAGE_WIDTH - 12, lineGap: 2 });
      });

      if (phase.suggestedResources?.length) {
        doc.moveDown(0.4);
        doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD).text(L.resources);
        phase.suggestedResources.forEach((res) => {
          doc.fillColor(PURPLE).fontSize(10).font(FONT_REGULAR)
            .text(`• ${resourceLabel(res)}`, { indent: 12, width: PAGE_WIDTH - 12, lineGap: 2 });
        });
      }

      if (phase.capstoneProject) {
        doc.moveDown(0.4);
        doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD)
          .text(L.capstone, { continued: true });
        doc.font(FONT_REGULAR).fillColor(BLACK)
          .text(`  ${phase.capstoneProject}`);
      }

      doc.moveDown(1.2);

      // Page break if near bottom
      if (doc.y > doc.page.height - 120 && i < roadmap.phases.length - 1) {
        doc.addPage();
      }
    });

    // ── Projects ─────────────────────────────────────────────
    if (roadmap.projects?.length) {
      // Page break before projects section
      if (doc.y > doc.page.height - 200) {
        doc.addPage();
      }

      doc.fillColor(BLACK).fontSize(14).font(FONT_BOLD).text(L.projectsHeading);
      doc.moveDown(0.5);

      roadmap.projects.forEach((project: RoadmapProject, i: number) => {
        // Page break if near bottom
        if (doc.y > doc.page.height - 160) {
          doc.addPage();
        }

        const isCapstone = project.isCapstone;
        const barColor = isCapstone ? PURPLE : LIGHT_GRAY;
        const labelColor = isCapstone ? '#ffffff' : PURPLE;
        const projectLabel = isJa ? project.title : `Project ${i + 1}: ${project.title}`;
        doc.font(FONT_BOLD).fontSize(11);
        const projectTitleH = doc.heightOfString(projectLabel, { width: PAGE_WIDTH - 80 });
        const projectBarH = Math.max(28, projectTitleH + 16);
        const barY = doc.y;

        doc.rect(50, barY, PAGE_WIDTH, projectBarH).fill(barColor);
        doc.fillColor(labelColor).fontSize(11).font(FONT_BOLD)
          .text(projectLabel, 62, barY + 8, { width: PAGE_WIDTH - 80 });
        doc.fillColor(isCapstone ? '#e0e7ff' : GRAY).fontSize(9).font(FONT_REGULAR)
          .text(`${project.difficulty}${isCapstone ? L.capstoneBadge : ''}`, 62 + PAGE_WIDTH - 80, barY + 8, { width: 70, align: 'right' });
        doc.text('', 50, barY + projectBarH);
        doc.moveDown(0.8);
        doc.fillColor(BLACK).fontSize(10).font(FONT_REGULAR)
          .text(project.description, { width: PAGE_WIDTH, lineGap: 3 });

        if (project.skills?.length) {
          doc.moveDown(0.4);
          doc.fillColor(GRAY).fontSize(9).font(FONT_BOLD)
            .text(L.skills, { continued: true });
          doc.font(FONT_REGULAR).fillColor(BLACK)
            .text(`  ${project.skills.join(' · ')}`);
        }

        doc.moveDown(1.2);
      });
    }

    // ── Footer ───────────────────────────────────────────────
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(50 + PAGE_WIDTH, doc.y).strokeColor('#e5e7eb').stroke();
    doc.moveDown(0.5);
    doc.fillColor(GRAY).fontSize(9).font(FONT_REGULAR)
      .text('Signal Works Design  ·  support@signalworksdesign.com', {
        align: 'center',
        width: PAGE_WIDTH,
      });

    doc.end();
  });
}
