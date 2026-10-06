'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Code2, 
  FileText, 
  ShieldCheck, 
  Award,
  ChevronRight
} from 'lucide-react';
import { MOCK_COURSES } from '@/lib/mock-data';
import { fetchCourseById } from '@/lib/d1';
import { Course } from '@/lib/types';
import VideoPlayer from '@/components/VideoPlayer';
import QuizModal from '@/components/QuizModal';
import SandboxEditor from '@/components/SandboxEditor';
import confetti from 'canvas-confetti';

interface WatchPageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function WatchPage({ params }: WatchPageProps) {
  const resolvedParams = use(params);

  const initialCourse = MOCK_COURSES.find(
    (c) => c.id === resolvedParams.courseId || c.slug === resolvedParams.courseId
  ) || null;

  const [course, setCourse] = useState<Course | null>(initialCourse);
  const [loading, setLoading] = useState(!initialCourse);

  useEffect(() => {
    fetchCourseById(resolvedParams.courseId)
      .then((c) => {
        if (c) setCourse(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [resolvedParams.courseId]);

  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'video' | 'quiz' | 'sandbox' | 'transcript'>('video');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">جاري تحميل محتوى الدرس ومشغل البث...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    notFound();
  }

  const currentLesson = course.lessons[activeLessonIndex] || course.lessons[0];

  const handleLessonCompleted = () => {
    if (!completedLessonIds.includes(currentLesson.id)) {
      setCompletedLessonIds([...completedLessonIds, currentLesson.id]);
    }
    // Switch to quiz or sandbox in micro-learning loop
    if (currentLesson.quiz) {
      setActiveTab('quiz');
    } else if (currentLesson.sandbox) {
      setActiveTab('sandbox');
    }
  };

  const handleQuizPassed = () => {
    if (currentLesson.sandbox) {
      setActiveTab('sandbox');
    } else {
      setShowCelebration(true);
      try {
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      } catch {
        // ignore
      }
    }
  };

  const handleSandboxSuccess = () => {
    setShowCelebration(true);
    try {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
  };

  const progressPercent = Math.round((completedLessonIds.length / course.lessons.length) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Top Bar Navigation */}
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="العودة إلى الدورات"
            >
              <ChevronRight className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                {course.title}
              </span>
              <h1 className="text-sm md:text-base font-bold text-white truncate max-w-lg">
                {currentLesson.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-slate-400">إنجاز المسار:</span>
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              بث محمي R1
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Player & Interactive Loop Area (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Loop Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'video'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>مشغل الفيديو المحمي</span>
              </button>

              {currentLesson.quiz && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'quiz'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>اختبار الفهم السريع</span>
                </button>
              )}

              {currentLesson.sandbox && (
                <button
                  onClick={() => setActiveTab('sandbox')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'sandbox'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>محرر الكود والتطبيق</span>
                </button>
              )}

              {currentLesson.transcript && (
                <button
                  onClick={() => setActiveTab('transcript')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'transcript'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>نص الشرح (Transcript)</span>
                </button>
              )}
            </div>

            {/* Tab Views */}
            {activeTab === 'video' && (
              <div className="space-y-4">
                <VideoPlayer
                  src={currentLesson.videoR1Url}
                  title={currentLesson.title}
                  durationSeconds={currentLesson.durationSeconds}
                  chapters={currentLesson.chapters}
                  subtitlesAr={currentLesson.vttSubtitlesAr}
                  subtitlesEn={currentLesson.vttSubtitlesEn}
                  onLessonCompleted={handleLessonCompleted}
                />

                {/* Lesson Info Card */}
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">{currentLesson.title}</h2>
                      <span className="text-xs text-slate-400">
                        الدرس رقم {currentLesson.lessonOrder} • المدة: {Math.round(currentLesson.durationSeconds / 60)} دقيقة
                      </span>
                    </div>

                    <button
                      onClick={handleLessonCompleted}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>اجتياز الدرس والاختبار</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentLesson.transcript || course.description}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && currentLesson.quiz && (
              <QuizModal
                questions={currentLesson.quiz.questions}
                onPassed={handleQuizPassed}
                onClose={() => setActiveTab('sandbox')}
              />
            )}

            {activeTab === 'sandbox' && currentLesson.sandbox && (
              <SandboxEditor
                sandbox={currentLesson.sandbox}
                onSuccess={handleSandboxSuccess}
              />
            )}

            {activeTab === 'transcript' && currentLesson.transcript && (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>النص الكامل للشرح التفصيلي</span>
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {currentLesson.transcript}
                </p>
              </div>
            )}

            {/* Celebration Card */}
            {showCelebration && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/50 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">
                  تهانينا! أتممت حلقة التعلم المصغر بنجاح
                </h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  تمت إضافة نقاط الإنجاز إلى رصيدك وجواز مهاراتك الرقمي الموثق في الحاضنة.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    عرض جواز المهارات
                  </Link>
                  {activeLessonIndex + 1 < course.lessons.length && (
                    <button
                      onClick={() => {
                        setActiveLessonIndex(activeLessonIndex + 1);
                        setActiveTab('video');
                        setShowCelebration(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                    >
                      الدرس التالي
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Course Syllabus & Lessons Playlist */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white">فهرس دروس الكورس</h3>
                <span className="text-xs text-slate-400">
                  {course.lessons.length} دروس مصغرة
                </span>
              </div>

              <div className="space-y-2">
                {course.lessons.map((lesson, idx) => {
                  const isActive = idx === activeLessonIndex;
                  const isCompleted = completedLessonIds.includes(lesson.id);

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setActiveLessonIndex(idx);
                        setActiveTab('video');
                        setShowCelebration(false);
                      }}
                      className={`w-full text-right p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                          : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isActive
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </span>

                        <div className="truncate">
                          <span className="text-xs font-bold block truncate text-slate-200">
                            {lesson.title}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            <span>{Math.round(lesson.durationSeconds / 60)} دقيقة (≤ 20 دقيقة)</span>
                          </span>
                        </div>
                      </div>

                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                          قيد المشاهدة
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instructor Box */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                المدرب المعتمد
              </span>
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.instructorAvatar}
                  alt={course.instructorName}
                  className="w-12 h-12 rounded-2xl object-cover border border-emerald-500/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{course.instructorName}</h4>
                  <span className="text-xs text-slate-400 block">{course.instructorRole}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
