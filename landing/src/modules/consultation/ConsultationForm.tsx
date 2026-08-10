'use client';

import { useState, useRef, FormEvent } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const TOTAL_STEPS = 10;

const PROJECT_TYPES = [
  { en: 'Business Website', ja: 'ビジネスウェブサイト' },
  { en: 'Personal Website', ja: '個人ウェブサイト' },
  { en: 'Internal Business Tool', ja: '社内業務ツール' },
  { en: 'Customer Portal', ja: 'カスタマーポータル' },
  { en: 'AI Assistant / Chatbot', ja: 'AIアシスタント / チャットボット' },
  { en: 'Workflow Automation', ja: 'ワークフロー自動化' },
  { en: 'Dashboard / Analytics', ja: 'ダッシュボード / 分析' },
  { en: 'Mobile-friendly Web App', ja: 'モバイル対応Webアプリ' },
  { en: 'API / System Integration', ja: 'API / システム連携' },
  { en: 'Existing Website Improvements', ja: '既存ウェブサイトの改善' },
  { en: 'Existing Software Improvements', ja: '既存ソフトウェアの改善' },
  { en: 'Something Else', ja: 'その他' },
];

const PROJECT_STATUS_OPTIONS = [
  { en: 'Brand new project', ja: '新規プロジェクト' },
  { en: 'Existing project needing improvements', ja: '既存プロジェクトの改善' },
  { en: 'Existing software needing new features', ja: '既存ソフトウェアへの機能追加' },
  { en: 'Not sure yet', ja: 'まだ分からない' },
];

const EXISTING_ASSETS = [
  { value: 'website', en: 'Website', ja: 'ウェブサイト' },
  { value: 'design_mockups', en: 'Design mockups', ja: 'デザインモックアップ' },
  { value: 'existing_software', en: 'Existing software', ja: '既存ソフトウェア' },
  { value: 'brand_guidelines', en: 'Brand guidelines', ja: 'ブランドガイドライン' },
  { value: 'database', en: 'Database', ja: 'データベース' },
  { value: 'api', en: 'API', ja: 'API' },
  { value: 'documentation', en: 'Documentation', ja: 'ドキュメント' },
  { value: 'github', en: 'GitHub repository', ja: 'GitHubリポジトリ' },
  { value: 'none', en: 'None', ja: 'なし' },
];

const FEATURES = [
  { value: 'user_accounts', en: 'User Accounts', ja: 'ユーザーアカウント' },
  { value: 'auth', en: 'Login / Authentication', ja: 'ログイン / 認証' },
  { value: 'admin_dashboard', en: 'Admin Dashboard', ja: '管理ダッシュボード' },
  { value: 'payments', en: 'Online Payments', ja: 'オンライン決済' },
  { value: 'booking', en: 'Appointment Booking', ja: '予約機能' },
  { value: 'contact_forms', en: 'Contact Forms', ja: 'お問い合わせフォーム' },
  { value: 'ai_chat', en: 'AI Chat', ja: 'AIチャット' },
  { value: 'ai_documents', en: 'AI Document Processing', ja: 'AIドキュメント処理' },
  { value: 'ai_search', en: 'AI Search', ja: 'AI検索' },
  { value: 'reporting', en: 'Reporting', ja: 'レポート' },
  { value: 'email_notifications', en: 'Email Notifications', ja: 'メール通知' },
  { value: 'sms_notifications', en: 'SMS Notifications', ja: 'SMS通知' },
  { value: 'file_uploads', en: 'File Uploads', ja: 'ファイルアップロード' },
  { value: 'crm', en: 'CRM', ja: 'CRM' },
  { value: 'inventory', en: 'Inventory', ja: '在庫管理' },
  { value: 'scheduling', en: 'Scheduling', ja: 'スケジューリング' },
  { value: 'maps', en: 'Maps', ja: 'マップ' },
  { value: 'analytics', en: 'Analytics', ja: 'アナリティクス' },
  { value: 'api_integrations', en: 'API Integrations', ja: 'API連携' },
  { value: 'custom_database', en: 'Custom Database', ja: 'カスタムデータベース' },
  { value: 'other', en: 'Other', ja: 'その他' },
];

const AI_CAPABILITIES = [
  { value: 'chatbot', en: 'ChatGPT-style assistant', ja: 'ChatGPT型アシスタント' },
  { value: 'knowledge_search', en: 'Internal knowledge search', ja: '社内ナレッジ検索' },
  { value: 'summarization', en: 'Document summarization', ja: 'ドキュメント要約' },
  { value: 'support_automation', en: 'Customer support automation', ja: 'カスタマーサポート自動化' },
  { value: 'ocr', en: 'OCR', ja: 'OCR（光学文字認識）' },
  { value: 'voice', en: 'Voice interface', ja: '音声インターフェース' },
  { value: 'image_gen', en: 'Image generation', ja: '画像生成' },
  { value: 'workflow_automation', en: 'Workflow automation', ja: 'ワークフロー自動化' },
  { value: 'translation', en: 'Translation', ja: '翻訳' },
  { value: 'report_gen', en: 'Report generation', ja: 'レポート生成' },
  { value: 'custom_agent', en: 'Custom AI agent', ja: 'カスタムAIエージェント' },
];

const TIMELINE_OPTIONS = [
  { en: 'ASAP', ja: '至急' },
  { en: 'Within 2 weeks', ja: '2週間以内' },
  { en: 'Within 1 month', ja: '1ヶ月以内' },
  { en: '2-3 months', ja: '2〜3ヶ月' },
  { en: 'Just exploring', ja: '検討段階' },
];

const BUDGET_OPTIONS = [
  { en: 'Under ¥250,000', ja: '¥250,000未満' },
  { en: '¥250k - ¥500k', ja: '¥250k〜¥500k' },
  { en: '¥500k - ¥1M', ja: '¥500k〜¥100万' },
  { en: '¥1M - ¥3M', ja: '¥100万〜¥300万' },
  { en: '¥3M+', ja: '¥300万以上' },
  { en: 'Unsure', ja: '未定' },
];

const MEETING_LENGTHS = [
  { en: '30 minutes', ja: '30分' },
  { en: '45 minutes', ja: '45分' },
  { en: '60 minutes', ja: '60分' },
];

const MEETING_TIMES = [
  { value: 'weekday_morning', en: 'Weekday Morning', ja: '平日午前' },
  { value: 'weekday_afternoon', en: 'Weekday Afternoon', ja: '平日午後' },
  { value: 'weekday_evening', en: 'Weekday Evening', ja: '平日夜' },
  { value: 'weekend', en: 'Weekend', ja: '週末' },
];

const TIMEZONES = [
  'Asia/Tokyo (JST)',
  'Asia/Seoul (KST)',
  'Asia/Shanghai (CST)',
  'Asia/Singapore (SGT)',
  'America/New_York (EST)',
  'America/Chicago (CST)',
  'America/Denver (MST)',
  'America/Los_Angeles (PST)',
  'Europe/London (GMT)',
  'Europe/Paris (CET)',
  'Australia/Sydney (AEST)',
];

const CONTACT_METHODS = [
  { en: 'Email', ja: 'メール' },
  { en: 'Phone', ja: '電話' },
  { en: 'Google Meet', ja: 'Google Meet' },
  { en: 'Zoom', ja: 'Zoom' },
];

export default function ConsultationForm() {
  const { language } = useLanguage();
  const ja = language === 'ja';
  const formRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contactMethod, setContactMethod] = useState('');

  // Step 2
  const [projectType, setProjectType] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [problemToSolve, setProblemToSolve] = useState('');

  // Step 3
  const [projectStatus, setProjectStatus] = useState('');
  const [existingAssets, setExistingAssets] = useState<string[]>([]);
  const [existingSystemInfo, setExistingSystemInfo] = useState('');

  // Step 4
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Step 5
  const [aiInterest, setAiInterest] = useState('');
  const [aiCapabilities, setAiCapabilities] = useState<string[]>([]);

  // Step 6
  const [timeline, setTimeline] = useState('');
  const [launchDate, setLaunchDate] = useState('');

  // Step 7
  const [budget, setBudget] = useState('');

  // Step 8
  const [successCriteria, setSuccessCriteria] = useState('');

  // Step 9
  const [meetingLength, setMeetingLength] = useState('');
  const [meetingTimes, setMeetingTimes] = useState<string[]>([]);
  const [timezone, setTimezone] = useState('');

  // Step 10
  const [anythingElse, setAnythingElse] = useState('');

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      scrollToForm();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      scrollToForm();
    }
  };

  const toggleCheckbox = (value: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return fullName.trim() !== '' && email.trim() !== '';
      default: return true;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      // Step 1
      fullName, company, jobTitle, email, phone, contactMethod,
      // Step 2
      projectType, projectIdea, problemToSolve,
      // Step 3
      projectStatus, existingAssets, existingSystemInfo,
      // Step 4
      selectedFeatures,
      // Step 5
      aiInterest, aiCapabilities,
      // Step 6
      timeline, launchDate,
      // Step 7
      budget,
      // Step 8
      successCriteria,
      // Step 9
      meetingLength, meetingTimes, timezone,
      // Step 10
      anythingElse,
      // Hidden lead qualification
      leadSource: 'services_page',
      referrer: typeof window !== 'undefined' ? document.referrer : '',
      landingPage: typeof window !== 'undefined' ? window.location.href : '',
      utmParams: typeof window !== 'undefined' ? window.location.search : '',
    };

    try {
      const res = await fetch('/api/consultation/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
      scrollToForm();
    } catch {
      setError(ja ? '送信に失敗しました。もう一度お試しください。' : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-purple-500 transition';
  const labelClass = 'block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5';
  const radioClass = 'flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border hover:border-indigo-400 dark:hover:border-purple-500 cursor-pointer transition';
  const radioActiveClass = 'flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-indigo-500 dark:border-purple-500 bg-indigo-50 dark:bg-indigo-900/20 cursor-pointer transition';
  const checkboxClass = 'flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-dark-border hover:border-indigo-400 dark:hover:border-purple-500 cursor-pointer transition text-sm';
  const checkboxActiveClass = 'flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-indigo-500 dark:border-purple-500 bg-indigo-50 dark:bg-indigo-900/20 cursor-pointer transition text-sm';

  if (submitted) {
    return (
      <div ref={formRef} id="consultation-form" className="scroll-mt-24">
        <section className="py-20 px-4 bg-white dark:bg-dark-surface">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">
              {ja ? 'お問い合わせありがとうございます！' : 'Thanks for reaching out!'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {ja
                ? 'プロジェクトの詳細を受け取りました。ミーティング前に内容を確認し、できる限り有意義な相談にいたします。'
                : "We've received your project details and will review them before our meeting. This helps us make the consultation as useful as possible."}
            </p>
            <div className="bg-gray-50 dark:bg-dark-card rounded-2xl p-8 text-left">
              <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">
                {ja ? '次のステップ' : 'Next Steps'}
              </h3>
              <ol className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  {ja ? 'ご都合の良い日時でミーティングをお選びください。' : 'Choose a meeting time that works for you.'}
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  {ja ? 'カレンダー招待付きの確認メールをお送りします。' : "You'll receive a confirmation email with a calendar invitation."}
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  {ja ? '事前にご要望を確認し、情報収集ではなくソリューションに集中します。' : "We'll review your requirements beforehand so we can focus on solutions rather than information gathering."}
                </li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div ref={formRef} id="consultation-form" className="scroll-mt-24">
      <section className="py-20 px-4 bg-white dark:bg-dark-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
              {ja ? '無料相談を予約する' : 'Book a Free Consultation'}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {ja
                ? '以下のフォームにご記入ください。ミーティング前にプロジェクトの詳細を確認し、最適なソリューションをご提案します。'
                : 'Fill out the form below so we can review your project before meeting. This way we can focus on solutions, not information gathering.'}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              <span>{ja ? `ステップ ${step} / ${TOTAL_STEPS}` : `Step ${step} of ${TOTAL_STEPS}`}</span>
              <span>{Math.round((step / TOTAL_STEPS) * 100)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: About You */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {ja ? 'ステップ 1: あなたについて' : 'Step 1: About You'}
                </h3>
                <div>
                  <label className={labelClass}>{ja ? '氏名' : 'Full Name'} <span className="text-red-500">*</span></label>
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder={ja ? '山田 太郎' : 'John Smith'} />
                </div>
                <div>
                  <label className={labelClass}>{ja ? '会社名 / 組織名' : 'Company / Organization'}</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{ja ? '役職' : 'Job Title'}</label>
                  <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{ja ? 'メールアドレス' : 'Email Address'} <span className="text-red-500">*</span></label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
                </div>
                <div>
                  <label className={labelClass}>{ja ? '電話番号' : 'Phone Number'}</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{ja ? 'ご希望の連絡方法' : 'Preferred Contact Method'}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {CONTACT_METHODS.map((m) => (
                      <label key={m.en} className={contactMethod === m.en ? radioActiveClass : radioClass}>
                        <input type="radio" name="contactMethod" value={m.en} checked={contactMethod === m.en} onChange={(e) => setContactMethod(e.target.value)} className="sr-only" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{ja ? m.ja : m.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: What are you looking to build? */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {ja ? 'ステップ 2: 何を作りたいですか？' : 'Step 2: What are you looking to build?'}
                </h3>
                <div>
                  <label className={labelClass}>{ja ? 'プロジェクトの種類' : 'Which best describes your project?'}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {PROJECT_TYPES.map((pt) => (
                      <label key={pt.en} className={projectType === pt.en ? radioActiveClass : radioClass}>
                        <input type="radio" name="projectType" value={pt.en} checked={projectType === pt.en} onChange={(e) => setProjectType(e.target.value)} className="sr-only" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{ja ? pt.ja : pt.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{ja ? 'アイデアについて教えてください' : 'Tell us about your idea'}</label>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                    {ja ? 'どのようなものを作りたいですか？アイデア、課題、目標をできるだけ詳しく教えてください。' : 'What are you hoping to build? Describe your idea, problem, or goal in as much detail as possible.'}
                  </p>
                  <textarea rows={4} value={projectIdea} onChange={(e) => setProjectIdea(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>{ja ? 'どんな課題を解決したいですか？' : 'What problem are you trying to solve?'}</label>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                    {ja
                      ? '例: 従業員の時間削減、手作業の削減、売上増加、顧客体験の改善、スプレッドシートの置き換え、古いシステムの刷新'
                      : 'Examples: Save employees time, reduce manual work, increase sales, improve customer experience, replace spreadsheets, modernize an old system'}
                  </p>
                  <textarea rows={4} value={problemToSolve} onChange={(e) => setProblemToSolve(e.target.value)} className={inputClass} />
                </div>
              </div>
            )}

            {/* Step 3: Project Details */}
            {step === 3 && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {ja ? 'ステップ 3: プロジェクトの詳細' : 'Step 3: Project Details'}
                </h3>
                <div>
                  <label className={labelClass}>{ja ? 'プロジェクトの状況' : 'Is this...'}</label>
                  <div className="grid grid-cols-1 gap-3">
                    {PROJECT_STATUS_OPTIONS.map((opt) => (
                      <label key={opt.en} className={projectStatus === opt.en ? radioActiveClass : radioClass}>
                        <input type="radio" name="projectStatus" value={opt.en} checked={projectStatus === opt.en} onChange={(e) => setProjectStatus(e.target.value)} className="sr-only" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{ja ? opt.ja : opt.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{ja ? '既にお持ちのものはありますか？' : 'Do you already have any of these?'}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {EXISTING_ASSETS.map((a) => (
                      <label key={a.value} className={existingAssets.includes(a.value) ? checkboxActiveClass : checkboxClass}>
                        <input type="checkbox" checked={existingAssets.includes(a.value)} onChange={() => toggleCheckbox(a.value, existingAssets, setExistingAssets)} className="sr-only" />
                        <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${existingAssets.includes(a.value) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          {existingAssets.includes(a.value) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{ja ? a.ja : a.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {(projectStatus === 'Existing project needing improvements' || projectStatus === 'Existing software needing new features') && (
                  <div>
                    <label className={labelClass}>{ja ? '既存システムの情報' : 'If improving an existing system, please provide details'}</label>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                      {ja ? 'ウェブサイトURL、GitHubリポジトリ、Figma、スクリーンショットなど' : 'Website URL, GitHub repository, Figma, screenshots - anything helpful'}
                    </p>
                    <textarea rows={3} value={existingSystemInfo} onChange={(e) => setExistingSystemInfo(e.target.value)} className={inputClass} />
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Features */}
            {step === 4 && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {ja ? 'ステップ 4: 機能' : 'Step 4: Features'}
                </h3>
                <div>
                  <label className={labelClass}>{ja ? '重要な機能はどれですか？' : 'Which features are important?'}</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {FEATURES.map((f) => (
                      <label key={f.value} className={selectedFeatures.includes(f.value) ? checkboxActiveClass : checkboxClass}>
                        <input type="checkbox" checked={selectedFeatures.includes(f.value)} onChange={() => toggleCheckbox(f.value, selectedFeatures, setSelectedFeatures)} className="sr-only" />
                        <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${selectedFeatures.includes(f.value) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          {selectedFeatures.includes(f.value) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{ja ? f.ja : f.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: AI Features */}
            {step === 5 && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {ja ? 'ステップ 5: AI機能' : 'Step 5: AI Features'}
                </h3>
                <div>
                  <label className={labelClass}>{ja ? 'AIに興味はありますか？' : 'Interested in AI?'}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { en: 'Yes', ja: 'はい' },
                      { en: 'Maybe', ja: 'たぶん' },
                      { en: 'No', ja: 'いいえ' },
                    ].map((opt) => (
                      <label key={opt.en} className={aiInterest === opt.en ? radioActiveClass : radioClass}>
                        <input type="radio" name="aiInterest" value={opt.en} checked={aiInterest === opt.en} onChange={(e) => setAiInterest(e.target.value)} className="sr-only" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{ja ? opt.ja : opt.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {(aiInterest === 'Yes' || aiInterest === 'Maybe') && (
                  <div>
                    <label className={labelClass}>{ja ? '興味のあるAI機能は？' : 'Which AI capabilities interest you?'}</label>
                    <div className="grid grid-cols-2 gap-3">
                      {AI_CAPABILITIES.map((c) => (
                        <label key={c.value} className={aiCapabilities.includes(c.value) ? checkboxActiveClass : checkboxClass}>
                          <input type="checkbox" checked={aiCapabilities.includes(c.value)} onChange={() => toggleCheckbox(c.value, aiCapabilities, setAiCapabilities)} className="sr-only" />
                          <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${aiCapabilities.includes(c.value) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}>
                            {aiCapabilities.includes(c.value) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{ja ? c.ja : c.en}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Timeline */}
            {step === 6 && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {ja ? 'ステップ 6: スケジュール' : 'Step 6: Timeline'}
                </h3>
                <div>
                  <label className={labelClass}>{ja ? 'いつ開始したいですか？' : 'When would you like to begin?'}</label>
                  <div className="grid grid-cols-1 gap-3">
                    {TIMELINE_OPTIONS.map((opt) => (
                      <label key={opt.en} className={timeline === opt.en ? radioActiveClass : radioClass}>
                        <input type="radio" name="timeline" value={opt.en} checked={timeline === opt.en} onChange={(e) => setTimeline(e.target.value)} className="sr-only" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{ja ? opt.ja : opt.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{ja ? '希望のリリース日' : 'Desired launch date'}</label>
                  <input type="date" value={launchDate} onChange={(e) => setLaunchDate(e.target.value)} className={inputClass} />
                </div>
              </div>
            )}

            {/* Step 7: Budget */}
            {step === 7 && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {ja ? 'ステップ 7: ご予算' : 'Step 7: Budget'}
                </h3>
                <div>
                  <label className={labelClass}>{ja ? '想定予算' : 'Estimated budget'}</label>
                  <div className="grid grid-cols-1 gap-3">
                    {BUDGET_OPTIONS.map((opt) => (
                      <label key={opt.en} className={budget === opt.en ? radioActiveClass : radioClass}>
                        <input type="radio" name="budget" value={opt.en} checked={budget === opt.en} onChange={(e) => setBudget(e.target.value)} className="sr-only" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{ja ? opt.ja : opt.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Success */}
            {step === 8 && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {ja ? 'ステップ 8: 成功の定義' : 'Step 8: Success'}
                </h3>
                <div>
                  <label className={labelClass}>{ja ? 'このプロジェクトの成功とは？' : 'What would make this project successful?'}</label>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                    {ja
                      ? 'リリースから6ヶ月後、「このプロジェクトは成功だった」と言えるのはどんな時ですか？'
                      : 'Six months after launch, what would make you say this project was a success?'}
                  </p>
                  <textarea rows={5} value={successCriteria} onChange={(e) => setSuccessCriteria(e.target.value)} className={inputClass} />
                </div>
              </div>
            )}

            {/* Step 9: Consultation */}
            {step === 9 && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {ja ? 'ステップ 9: 相談について' : 'Step 9: Consultation'}
                </h3>
                <div>
                  <label className={labelClass}>{ja ? 'ご希望のミーティング時間' : 'Preferred meeting length'}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {MEETING_LENGTHS.map((opt) => (
                      <label key={opt.en} className={meetingLength === opt.en ? radioActiveClass : radioClass}>
                        <input type="radio" name="meetingLength" value={opt.en} checked={meetingLength === opt.en} onChange={(e) => setMeetingLength(e.target.value)} className="sr-only" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{ja ? opt.ja : opt.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{ja ? 'ご都合の良い時間帯' : 'Preferred meeting times'}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {MEETING_TIMES.map((t) => (
                      <label key={t.value} className={meetingTimes.includes(t.value) ? checkboxActiveClass : checkboxClass}>
                        <input type="checkbox" checked={meetingTimes.includes(t.value)} onChange={() => toggleCheckbox(t.value, meetingTimes, setMeetingTimes)} className="sr-only" />
                        <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${meetingTimes.includes(t.value) ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300 dark:border-gray-600'}`}>
                          {meetingTimes.includes(t.value) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">{ja ? t.ja : t.en}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{ja ? 'タイムゾーン' : 'Time Zone'}</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputClass}>
                    <option value="">{ja ? '選択してください' : 'Select your timezone'}</option>
                    {TIMEZONES.map((tz) => (
                      <option key={tz} value={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 10: Anything Else */}
            {step === 10 && (
              <div className="space-y-5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  {ja ? 'ステップ 10: その他' : 'Step 10: Anything Else?'}
                </h3>
                <div>
                  <label className={labelClass}>{ja ? 'その他ご要望がございましたらお知らせください' : 'Anything else you\'d like us to know?'}</label>
                  <textarea rows={5} value={anythingElse} onChange={(e) => setAnythingElse(e.target.value)} className={inputClass} />
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-200 dark:border-dark-border">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  {ja ? '戻る' : 'Back'}
                </button>
              ) : <div />}
              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {ja ? '次へ' : 'Next'}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (ja ? '送信中...' : 'Submitting...') : (ja ? '送信する' : 'Submit')}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
