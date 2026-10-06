'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  Clock, 
  Play, 
  BookOpen
} from 'lucide-react';
import { MOCK_COURSES, TRACKS_INFO } from '@/lib/mock-data';
import { Course } from '@/lib/types';
import { fetchCourses } from '@/lib/d1';

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialTrack = searchParams.get('track') || 'all';

  const [coursesList, setCoursesList] = useState<Course[]>(MOCK_COURSES);
  const [selectedTrack, setSelectedTrack] = useState<string>(initialTrack);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minCqs, setMinCqs] = useState(9.0);

  useEffect(() => {
    fetchCourses().then(setCoursesList).catch(() => {});
  }, []);

  useEffect(() => {
    const t = searchParams.get('track');
    if (t) setSelectedTrack(t);
  }, [searchParams]);

  const filteredCourses = coursesList.filter((course) => {
    const matchesTrack = selectedTrack === 'all' || course.track === selectedTrack;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesCqs = course.cqsScore >= minCqs;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTrack && matchesLevel && matchesCqs && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>فهرس المسارات التخصصية المعتمدة</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          دليل الكورسات والدروس المصغرة (CQS ≤ 20 دقيقة)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          جميع الدروس مزودة بحماية العلامة المائية الجنائية، واختبارات فحص الفهم السريعة، وبيئات الكود والمحاكاة التفاعلية المباشرة.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعنوان، الكلمات المفتاحية، أو المدرب..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Level Filter */}
          <div>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">كافة المستويات</option>
              <option value="beginner">مبتدئ (Beginner)</option>
              <option value="intermediate">متوسط (Intermediate)</option>
              <option value="advanced">متقدم (Advanced)</option>
            </select>
          </div>

          {/* CQS Slider */}
          <div className="flex flex-col justify-center px-2">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
              <span>أدنى درجة CQS:</span>
              <span className="text-emerald-500 font-mono">{minCqs.toFixed(1)} / 10</span>
            </div>
            <input
              type="range"
              min={8.0}
              max={10.0}
              step={0.1}
              value={minCqs}
              onChange={(e) => setMinCqs(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        {/* Tracks Filter Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTrack === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            جميع المسارات ({MOCK_COURSES.length})
          </button>
          {TRACKS_INFO.map((track) => (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTrack === track.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {track.title}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  CQS {course.cqsScore} ★
                </div>
                <div className="absolute bottom-3 right-3 bg-black/80 px-2.5 py-1 rounded-md text-[11px] font-mono text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{course.totalDurationMinutes} دقيقة إجمالية</span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                    {course.level === 'beginner' ? 'مبتدئ' : course.level === 'intermediate' ? 'متوسط' : 'متقدم'}
                  </span>
                  <span>•</span>
                  <span>{course.lessonsCount} دروس مصغرة (≤ 20 دقيقة)</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors leading-snug">
                  {course.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="pt-2 flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.instructorAvatar}
                    alt={course.instructorName}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500/30"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {course.instructorName}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">
                      {course.instructorRole}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Footer & Link */}
            <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {course.enrolledStudentsCount} متدرب مسجل
              </span>
              <Link
                href={`/watch/${course.id}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>دخول المشغل</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs text-slate-400">جاري تحميل المسارات...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
