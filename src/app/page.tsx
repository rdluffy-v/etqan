'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowLeft, 
  Cpu, 
  Code2, 
  Bot, 
  ShieldAlert, 
  Palette, 
  Search, 
  MapPin, 
  Calendar, 
  Trophy, 
  Star, 
  Check, 
  Users, 
  Clock, 
  Layers,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';
import { TRACKS_INFO, MOCK_COURSES, MOCK_WORKSHOPS, MOCK_LEADERBOARD } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { bookWorkshopSeat, fetchCourses, fetchWorkshops } from '@/lib/d1';
import { OfflineWorkshop, WorkshopTicket, Course } from '@/lib/types';
import WorkshopTicketModal from '@/components/WorkshopTicketModal';

export default function HomePage() {
  const { user, loginAsDemo } = useAuth();
  const [coursesList, setCoursesList] = useState<Course[]>(MOCK_COURSES);
  const [workshopsList, setWorkshopsList] = useState<OfflineWorkshop[]>(MOCK_WORKSHOPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [minCqs, setMinCqs] = useState(9.0);

  // Workshop booking modal state
  const [selectedTicket, setSelectedTicket] = useState<WorkshopTicket | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchCourses().then(setCoursesList).catch(() => {});
    fetchWorkshops().then(setWorkshopsList).catch(() => {});
  }, []);

  const filteredCourses = coursesList.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = selectedTrack === 'all' || c.track === selectedTrack;
    const matchesCqs = c.cqsScore >= minCqs;
    return matchesSearch && matchesTrack && matchesCqs;
  });

  const handleBookWorkshop = async (workshop: OfflineWorkshop) => {
    if (!user) {
      alert('يرجى تسجيل الدخول أو اختيار دور تجريبي لحجز مقعدك.');
      return;
    }
    setBookingLoading(true);
    setBookingError('');
    try {
      const ticket = await bookWorkshopSeat(workshop.id, user);
      if (ticket) {
        setSelectedTicket(ticket);
        setWorkshopsList((prev) =>
          prev.map((item) =>
            item.id === workshop.id ? { ...item, bookedSeats: item.bookedSeats + 1 } : item
          )
        );
      }
    } catch (err: unknown) {
      const error = err as Error;
      setBookingError(error?.message || 'حدث خطأ أثناء الحجز.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-20 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          {/* Official Incubator Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/50 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs md:text-sm font-semibold shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>برعاية رسمية وتنسيق ميداني من «حاضنة بوصلة الجيل التقني»</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.25] max-w-4xl mx-auto">
            منظومة <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 bg-clip-text text-transparent">«إتقان»</span>: المهارات التقنية الحقيقية والاعتماد الميداني
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            المنصة الأولى المدمجة بالكامل لتمكين الكفاءات الوطنية. دروس مصغرة فائقة الجودة (≤ 20 دقيقة)، 
            مشغل فيديو فائق الأمان بعلامات مائية جنائية، ورش عمل واقعية في مقر الحاضنة بطرابلس، وجواز مهارات رقمي موثق برمز QR.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/courses"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02]"
            >
              <span>استكشف المسارات والدورات</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              href="/workshops"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-slate-900 dark:text-white font-semibold text-sm sm:text-base shadow-sm transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-500" />
              <span>الورش الواقعية بالحاضنة</span>
            </Link>

            <button
              onClick={() => loginAsDemo('trainee_academic')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-semibold transition-all"
              title="دخول فوري بحساب متدرب أكاديمي موثق"
            >
              <GraduationCap className="w-4 h-4 text-emerald-500" />
              <span>تجربة فورية (Demo)</span>
            </button>
          </div>

          {/* Live Statistics Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-emerald-500">450+</span>
              <span className="block text-xs text-slate-500 mt-1 font-medium">متدرب معتمد موثق</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-teal-500">9.8</span>
              <span className="block text-xs text-slate-500 mt-1 font-medium">معيار جودة المحتوى CQS</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-sky-500">15+</span>
              <span className="block text-xs text-slate-500 mt-1 font-medium">ورشة تطبيقية في الحاضنة</span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-amber-500">100%</span>
              <span className="block text-xs text-slate-500 mt-1 font-medium">جاهز للنشر على Vercel</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Specialized Tracks Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>التخصصات المعتمدة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            خمسة مسارات هندسية لبناء الاقتصاد المعرفي
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            مناهج عملية مصممة وفق متطلبات سوق العمل الليبي والإقليمي وشراكات المؤسسات التقنية.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRACKS_INFO.map((track) => {
            const Icon = track.id === 'programming' ? Code2 :
                         track.id === 'hardware' ? Cpu :
                         track.id === 'ai_robotics' ? Bot :
                         track.id === 'security' ? ShieldAlert : Palette;

            return (
              <div
                key={track.id}
                className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {track.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                      {track.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/courses?track=${track.id}`}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>استعراض الكورسات</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                  <span className="text-[11px] text-slate-400 font-medium">معتمد CQS</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CQS Quality Search & Courses Discovery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  محرك الفحص والجودة الذكي
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  البحث في الدورات المصغرة وفق معيار CQS
                </h2>
              </div>
              <p className="text-xs text-slate-400 max-w-sm">
                نستبعد المحتوى الرديء تلقائياً، جميع الدروس مشروحة بتركيز مكثف لا يتجاوز 20 دقيقة مع تطبيق فوري.
              </p>
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Search Bar */}
              <div className="relative md:col-span-2">
                <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن مهارة، تقنية، أو اسم المدرب..."
                  className="w-full pr-12 pl-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* CQS Slider */}
              <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 px-4 py-2.5 rounded-2xl">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                    <span>الحد الأدنى لدرجة CQS:</span>
                    <span className="text-emerald-400 font-mono">{minCqs.toFixed(1)} / 10</span>
                  </div>
                  <input
                    type="range"
                    min={8.0}
                    max={10.0}
                    step={0.1}
                    value={minCqs}
                    onChange={(e) => setMinCqs(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Track Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedTrack('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  selectedTrack === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                جميع المسارات
              </button>
              {TRACKS_INFO.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrack(t.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedTrack === t.id ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>

            {/* Courses Result Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden hover:border-emerald-500/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative aspect-video w-full overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-md text-[11px] font-bold text-emerald-400 border border-emerald-500/40">
                        CQS {course.cqsScore} ★
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/75 px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{course.totalDurationMinutes} دقيقة إجمالية</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-base font-bold text-white line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={course.instructorAvatar}
                          alt={course.instructorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs text-slate-300 font-medium">
                          {course.instructorName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-700/60 mt-4 flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-semibold">
                      {course.lessonsCount} دروس محمية
                    </span>
                    <Link
                      href={`/watch/${course.id}`}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                    >
                      بدء المشاهدة
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Upcoming Offline Workshops at Incubator Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>المقر الميداني: حاضنة بوصلة الجيل التقني</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ورش العمل الواقعية والتدريب العملي
            </h2>
          </div>
          <Link
            href="/workshops"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
          >
            <span>استعراض كافة الورش القادمة</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {bookingError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs">
            {bookingError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workshopsList.map((ws) => {
            const seatsLeft = ws.totalSeats - ws.bookedSeats;
            return (
              <div
                key={ws.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ws.imageUrl} alt={ws.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{new Date(ws.dateTime).toLocaleDateString('ar-LY')}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {ws.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {ws.description}
                    </p>

                    <div className="space-y-1.5 pt-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{ws.venueName}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>المدرب: <strong>{ws.instructorName}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">المقاعد المتاحة:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {seatsLeft > 0 ? `${seatsLeft} مقعد متبقي` : 'اكتمل العدد'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookWorkshop(ws)}
                    disabled={seatsLeft <= 0 || bookingLoading}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                  >
                    حجز مقعد مجاني
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Honor Board & Challenge Leaderboard */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Star of the Year Card */}
          <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-500/30 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>نجم سنة 2026 في الحاضنة</span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  فاطمة الدربالي
                </h3>
                <span className="text-xs text-slate-500 block">
                  جامعة طرابلس - كلية تقنية المعلومات
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                حققت أعلى معدل اجتياز للتحديات البرمجية وهندسة النظم الموزعة ونالت اعتماد «حاضنة بوصلة الجيل التقني» في حماية المحتوى السحابي.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/20 text-center">
                  <span className="text-lg font-black text-amber-500">2,940</span>
                  <span className="block text-[10px] text-slate-500">نقطة تميز</span>
                </div>
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/20 text-center">
                  <span className="text-lg font-black text-emerald-500">28 يوم</span>
                  <span className="block text-[10px] text-slate-500">استمرار متواصل 🔥</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/passport/usr_academic_02"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <span>استعراض جواز المهارات الرسمي</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Top Leaderboard */}
          <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">لوحة شرف إتقان التنافسية</h3>
                  <span className="text-xs text-slate-500">أبطال التحديات الأسبوعية والشهرية</span>
                </div>
              </div>
              <Link
                href="/community"
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                شاهد الكل
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_LEADERBOARD.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.rank === 1 ? 'bg-amber-500 text-white' :
                      item.rank === 2 ? 'bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200' :
                      item.rank === 3 ? 'bg-amber-700 text-white' : 'text-slate-400'
                    }`}>
                      {item.rank}
                    </span>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-slate-500">{item.university}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-500 hidden sm:inline">
                      {item.badges} أوسمة
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      {item.points} نقطة
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Membership & Subscription Tiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            خطط الانضمام لمنظومة إتقان
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            مفتوح للجميع لتمكين الشباب الليبي، مع مزايا خاصة لطلاب الجامعات الموثقة ورعاة التحديات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Personal */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">الأفراد</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">المسار الحر</h3>
              <div className="text-3xl font-black text-slate-900 dark:text-white">مجاناً</div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> مشاهدة كافة الدروس المصغرة (≤ 20 دقيقة)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> تشغيل مشغل الفيديو المحمي بالعلامة المائية
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> خوض الاختبارات ومحرر الكود المدمج
                </li>
              </ul>
            </div>
            <Link
              href="/auth"
              className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-center text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              ابدأ الآن مجاناً
            </Link>
          </div>

          {/* Academic Verified (Featured) */}
          <div className="rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-2 border-emerald-500 p-8 space-y-6 flex flex-col justify-between relative shadow-xl shadow-emerald-500/10">
            <div className="absolute -top-3.5 right-8 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full">
              الخيار الموصى به للجامعات
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">الأكاديمي الموثق</span>
              <h3 className="text-xl font-bold text-white">المسار الأكاديمي والمهني</h3>
              <div className="text-3xl font-black text-white">
                دعم كامل <span className="text-xs text-slate-400 font-normal">من الحاضنة</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> توثيق الهوية بالبريد الجامعي أو البطاقة (OCR)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> جواز مهارات رقمي حي وموثق برمز QR
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> أولوية حجز الورش الميدانية بحاضنة بوصلة الجيل التقني
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> إدراج الملف في بنك الكفاءات الموجه للشركات
                </li>
              </ul>
            </div>
            <Link
              href="/auth"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-center text-xs font-black text-white shadow-lg shadow-emerald-600/30 transition-all"
            >
              توثيق الحساب الأكاديمي
            </Link>
          </div>

          {/* Corporate */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">الشركات والمؤسسات</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">بوابة الشركاء B2B</h3>
              <div className="text-3xl font-black text-slate-900 dark:text-white">شراكة استراتيجية</div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> الوصول لبنك الكفاءات الموثق وفلترة المهارات
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> رعاية وتحديات الباونتي (Sponsored Bounties)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" /> استقطاب أصحاب الأداء الأعلى في الورش الميدانية
                </li>
              </ul>
            </div>
            <Link
              href="/corporate"
              className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-center text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
            >
              دخول بوابة الشركات
            </Link>
          </div>
        </div>
      </section>

      {/* Workshop Ticket Modal if booked */}
      {selectedTicket && (
        <WorkshopTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
