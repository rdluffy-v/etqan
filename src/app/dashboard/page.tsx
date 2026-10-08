'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { fetchUserTickets } from '@/lib/d1';
import { MOCK_COURSES } from '@/lib/mock-data';
import { WorkshopTicket } from '@/lib/types';
import SkillPassportCard from '@/components/SkillPassportCard';
import WorkshopTicketModal from '@/components/WorkshopTicketModal';
import { 
  Flame, 
  BookOpen, 
  MapPin, 
  Ticket, 
  Play, 
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<WorkshopTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<WorkshopTicket | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserTickets(user.id).then(setTickets);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">يرجى تسجيل الدخول للوصول إلى لوحة المتدرب</h2>
        <Link href="/auth" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold inline-block">
          دخول أو إنشاء حساب
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Welcome & Summary Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-emerald-500/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {user.fullName}
              </h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                حساب نشط
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              مسار التدريب التقني وبناء الكفاءات المعتمدة
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-xs text-slate-500 block">رصيد النقاط</span>
            <span className="text-lg font-black text-emerald-500 font-mono">{user.points}</span>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
            <span className="text-xs text-slate-500 block">سلسلة الأيام</span>
            <span className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-current" />
              {user.streakDays}
            </span>
          </div>
        </div>
      </div>

      {/* Live Skill Passport Card Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <span>جواز المهارات الرقمي الحي المعتمد (Skill Passport)</span>
          </h2>
          <span className="text-xs text-slate-500">
            مزود بـ QR Code للتحقق الفوري من قبل الشركات وأصحاب العمل
          </span>
        </div>

        <SkillPassportCard user={user} />
      </section>

      {/* Enrolled Courses & Progress */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          <span>الدورات التدريبية قيد الإنجاز</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_COURSES.slice(0, 3).map((course, idx) => {
            const completedLessons = idx === 0 ? 2 : 1;
            const percent = Math.round((completedLessons / course.lessons.length) * 100);

            return (
              <div
                key={course.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      CQS {course.cqsScore} ★
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {completedLessons}/{course.lessons.length} دروس
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {course.title}
                  </h3>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                      <span>التقدم الإجمالي:</span>
                      <span className="text-emerald-500 font-bold">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{course.instructorName}</span>
                  <Link
                    href={`/watch/${course.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>متابعة</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Booked Offline Workshops & QR Tickets */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-500" />
            <span>تذاكر الورش الميدانية المحجوزة بالحاضنة</span>
          </h2>
          <Link
            href="/workshops"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            تصفح ورش جديدة بالحاضنة
          </Link>
        </div>

        {tickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-mono font-bold text-emerald-500 block">
                    {t.ticketCode}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.workshopTitle}
                  </h4>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    {t.venueName}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedTicket(t)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex-shrink-0"
                >
                  استعراض التذكرة و QR
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-3xl bg-slate-100 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3">
            <MapPin className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-xs text-slate-500">
              لم تقم بحجز مقعد في الورش الميدانية القادمة بحاضنة بوصلة الجيل التقني بعد.
            </p>
            <Link
              href="/workshops"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold inline-block"
            >
              حجز مقعد في ورشة عمل
            </Link>
          </div>
        )}
      </section>

      {/* Selected Ticket Modal */}
      {selectedTicket && (
        <WorkshopTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
