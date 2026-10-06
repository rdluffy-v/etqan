'use client';

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  Bot, 
  ShieldCheck, 
  Clock
} from 'lucide-react';
import { MOCK_CHALLENGES, MOCK_LEADERBOARD } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { submitChallengeWithAIRubric, fetchChallenges } from '@/lib/d1';
import { ChallengeSubmission, CommunityChallenge } from '@/lib/types';
import confetti from 'canvas-confetti';

export default function CommunityPage() {
  const { user } = useAuth();
  const [challengesList, setChallengesList] = useState<CommunityChallenge[]>(MOCK_CHALLENGES);
  const [selectedChallenge, setSelectedChallenge] = useState<CommunityChallenge>(MOCK_CHALLENGES[0]);
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);

  useEffect(() => {
    fetchChallenges().then((res) => {
      if (res && res.length > 0) {
        setChallengesList(res);
        setSelectedChallenge(res[0]);
      }
    }).catch(() => {});
  }, []);

  // Submission Form State
  const [solTitle, setSolTitle] = useState('');
  const [solDesc, setSolDesc] = useState('');
  const [teamName, setTeamName] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<ChallengeSubmission | null>(null);

  const handleSubmitSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('يرجى تسجيل الدخول أو اختيار دور تجريبي لتقديم حلك.');
      return;
    }

    setEvaluating(true);

    try {
      const sub = await submitChallengeWithAIRubric(selectedChallenge.id, user, {
        title: solTitle,
        description: solDesc,
        teamName: teamName || undefined,
        repoUrl: repoUrl || undefined,
        demoUrl: demoUrl || undefined,
      });

      setLastSubmission(sub);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Trophy className="w-4 h-4 text-emerald-500" />
          <span>مجتمع الابتكار والتحديات التنافسية</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          التحديات البرمجية والتقييم الذكي (AI Rubric)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          نافس زملاءك في التحديات اليومية وهاكاثونات الحاضنة الشهرية. تُقيّم الحلول بواسطة محرك الذكاء الاصطناعي لفحص الجدوى والأصالة ومنع النسخ.
        </p>
      </div>

      {/* Challenges Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {challengesList.map((ch) => (
          <div
            key={ch.id}
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
              selectedChallenge.id === ch.id
                ? 'bg-emerald-950/20 border-emerald-500/60 shadow-lg'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  ch.type === 'daily' ? 'bg-sky-500/10 text-sky-500' :
                  ch.type === 'weekly' ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-500/10 text-purple-500'
                }`}>
                  {ch.type === 'daily' ? 'تحدي اليوم' : ch.type === 'weekly' ? 'تحدي الأسبوع' : 'هاكاثون شهري'}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  +{ch.pointsReward} نقطة
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {ch.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {ch.description}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>ينتهي في: {new Date(ch.deadline).toLocaleDateString('ar-LY')}</span>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                {ch.submissionsCount} تسليم
              </span>
              <button
                onClick={() => {
                  setSelectedChallenge(ch);
                  setSubmissionModalOpen(true);
                  setLastSubmission(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
              >
                تقديم الحل والتقييم
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard and AI Evaluation Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dual Leaderboard */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  لوحة الصدارة التنافسية (Individual & Team Leaderboard)
                </h3>
                <span className="text-xs text-slate-400">محدثة لحظياً بناءً على تقييمات الذكاء الاصطناعي</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {MOCK_LEADERBOARD.map((item) => (
              <div
                key={item.rank}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                    item.rank === 1 ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' :
                    item.rank === 2 ? 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200' :
                    item.rank === 3 ? 'bg-amber-700 text-white' : 'text-slate-400'
                  }`}>
                    {item.rank}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </h4>
                    <span className="text-xs text-slate-500">{item.university}</span>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-xs">
                  <span className="text-amber-500 font-semibold hidden sm:inline">
                    {item.streak} يوم 🔥
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    {item.points} نقطة
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Rubric Engine Information */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Bot className="w-4 h-4" />
              <span>معايير التقييم الذكي (AI Rubric)</span>
            </div>

            <h3 className="text-lg font-bold text-white">
              كيف تُقيّم خوارزمية إتقان الحلول البرمجية؟
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              يقوم المحرك الذكي بتحليل المشروع وفق 4 محاور علمية دقيقة لمنع الغش وضمان تميز الكوادر:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between">
                <span>1. الأصالة والابتكار (Originality)</span>
                <span className="text-emerald-400 font-bold font-mono">25 نقطة</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between">
                <span>2. الجدوى التقنية (Feasibility)</span>
                <span className="text-emerald-400 font-bold font-mono">25 نقطة</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between">
                <span>3. العمق المعماري (Technical Depth)</span>
                <span className="text-emerald-400 font-bold font-mono">25 نقطة</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between">
                <span>4. الأثر وحل المشكلات (Impact)</span>
                <span className="text-emerald-400 font-bold font-mono">25 نقطة</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>فحص مكافحة النسخ التلقائي من أدوات التوليد السطحي</span>
          </div>
        </div>
      </div>

      {/* Submission & AI Evaluation Modal */}
      {submissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  تقديم حل: {selectedChallenge.title}
                </h3>
              </div>
              <button
                onClick={() => setSubmissionModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                إغلاق ✕
              </button>
            </div>

            {!lastSubmission ? (
              <form onSubmit={handleSubmitSolution} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    عنوان الفكرة أو الحل الهندسي:
                  </label>
                  <input
                    type="text"
                    required
                    value={solTitle}
                    onChange={(e) => setSolTitle(e.target.value)}
                    placeholder="مثال: خوارزمية فهرسة D1 الطرفية مع الذاكرة المؤقتة"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    اسم الفريق (اختياري للفرق):
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="مثال: فريق رواد طرابلس"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    شرح معماري للفكرة وكيفية حل التحدي:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={solDesc}
                    onChange={(e) => setSolDesc(e.target.value)}
                    placeholder="اشرح المنطق البرمجي، التقنيات المستخدمة، وكيف يقلل استهلاك الموارد..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      رابط مستودع GitHub:
                    </label>
                    <input
                      type="url"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      رابط العرض التجريبي (Demo):
                    </label>
                    <input
                      type="url"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={evaluating}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
                >
                  {evaluating ? 'جاري تقييم الحل بواسطة الذكاء الاصطناعي...' : 'إرسال الحل للتقييم الفوري'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    تم التقييم بنجاح: {lastSubmission.aiRubricTotal} / 100
                  </h4>
                  <p className="text-xs text-slate-300">
                    {lastSubmission.aiFeedback}
                  </p>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center">
                    <span className="text-slate-400 block">الأصالة والابتكار</span>
                    <strong className="text-emerald-400 font-mono text-sm">{lastSubmission.originalityScore}/25</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center">
                    <span className="text-slate-400 block">الجدوى التقنية</span>
                    <strong className="text-emerald-400 font-mono text-sm">{lastSubmission.feasibilityScore}/25</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center">
                    <span className="text-slate-400 block">العمق الهندسي</span>
                    <strong className="text-emerald-400 font-mono text-sm">{lastSubmission.depthScore}/25</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-center">
                    <span className="text-slate-400 block">الأثر الميداني</span>
                    <strong className="text-emerald-400 font-mono text-sm">{lastSubmission.impactScore}/25</strong>
                  </div>
                </div>

                <button
                  onClick={() => setSubmissionModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  إغلاق ومشاهدة لوحة الصدارة
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
