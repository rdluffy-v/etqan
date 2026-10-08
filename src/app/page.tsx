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
  GraduationCap,
  Building2,
  Award,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Briefcase,
  SlidersHorizontal
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
  const [heroAudienceTab, setHeroAudienceTab] = useState<'trainee' | 'corporate' | 'instructor'>('trainee');

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
    <div className="space-y-24 md:space-y-32 pb-24 overflow-x-hidden">
      {/* 1. Hero Section - Ultra Craft */}
      <section className="relative pt-10 md:pt-16 lg:pt-20">
        {/* Ambient Gradient Glow Orbs */}
        <div className="absolute top-1/4 -right-24 w-[32rem] h-[32rem] bg-emerald-500/15 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -left-24 w-[30rem] h-[30rem] bg-sky-500/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Incubator Official Partnership Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Sparkles className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span>رعاية رسمية وتنسيق ميداني من «حاضنة بوصلة الجيل التقني»</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.2]">
              منظومة <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 bg-clip-text text-transparent">«إتقان»</span> الوطنية: الكفاءة الحقيقية والاعتماد الميداني
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
              المنصة الليبية الأولى المتكاملة لتمكين شباب الوطن: دروس مصغرة فائقة الجودة (<span className="text-emerald-600 dark:text-emerald-400 font-bold">≤ 20 دقيقة</span>) بمعيار CQS، مشغل فيديو آمن بعلامات مائية جنائية، ورش عمل تطبيقية بمقر الحاضنة، وجواز مهارات رقمي موثق ومربوط بسوق العمل.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                href="/courses"
                className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02] btn-press"
              >
                <span>استكشف المسارات والدورات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <Link
                href="/workshops"
                className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-slate-900 dark:text-white font-bold text-sm sm:text-base shadow-sm transition-all btn-press"
              >
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>الورش الميدانية بالحاضنة</span>
              </Link>

              <button
                onClick={() => loginAsDemo('trainee_personal')}
                className="flex items-center gap-2 px-5 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-bold transition-all btn-press"
                title="تجربة فورية لمنظومة إتقان"
              >
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span>تجربة فورية (Demo)</span>
              </button>
            </div>
          </div>

          {/* Interactive Audience Tabs & Live Interactive Showcase */}
          <div className="mt-14 max-w-5xl mx-auto">
            {/* Tab selector */}
            <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-900/80 border border-slate-300/60 dark:border-slate-800 max-w-lg mx-auto mb-8">
              <button
                onClick={() => setHeroAudienceTab('trainee')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all btn-press ${
                  heroAudienceTab === 'trainee'
                    ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>للطلاب والخريجين</span>
              </button>

              <button
                onClick={() => setHeroAudienceTab('corporate')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all btn-press ${
                  heroAudienceTab === 'corporate'
                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>للشركات والتوظيف</span>
              </button>

              <button
                onClick={() => setHeroAudienceTab('instructor')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all btn-press ${
                  heroAudienceTab === 'instructor'
                    ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>للمدربين والخبراء</span>
              </button>
            </div>

            {/* Tab Showcase Cards */}
            <div className="rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
              {heroAudienceTab === 'trainee' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      <Zap className="w-3.5 h-3.5" /> مسار المتدرب الأكاديمي والحر
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      حوّل دراستك النظرية إلى اعتماد ميداني موثق برمز QR
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      وثّق حسابك ببريدك الجامعي لتستفيد من رعاية الحاضنة الكاملة: احضر ورش العمل الواقعية في مقر الحاضنة بطرابلس، تدرب على مشاريع حقيقية، وابنِ جواز مهارات رقمي يقنع كبرى الشركات بتوظيفك فوراً.
                    </p>
                    <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>دروس مكثفة لا تتعدى 20 دقيقة مع محرر أكواد ومختبر تطبيقي</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>حجز مقاعد مجانية بالورش الميدانية بالحاضنة مع تذاكر QR رسمية</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>جواز مهارات رقمي موثق ومحمي بتقنية التحقق الفوري</span>
                      </li>
                    </ul>
                    <div className="pt-2">
                      <Link
                        href="/passport/demo-user-123"
                        className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm hover:underline"
                      >
                        <span>معاينة جواز المهارات الرقمي النموذجي</span>
                        <ChevronLeft className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* Passport Card Mockup */}
                  <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/80 p-6 text-white border-2 border-emerald-500/40 shadow-xl hologram-sheen relative">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-xs text-slate-950">
                          إتقان
                        </div>
                        <div>
                          <span className="text-xs font-bold block">جواز المهارات الرقمي الموثق</span>
                          <span className="text-[10px] text-emerald-400 font-mono">ETQAN-ID: #LY-8841</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        معتمد رسمياً
                      </span>
                    </div>

                    <div className="py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base font-black">أحمد سالم الورفلي</div>
                          <div className="text-xs text-slate-400">هندسة البرمجيات والأنظمة الموزعة</div>
                        </div>
                        <div className="text-left font-mono">
                          <div className="text-xs text-emerald-400 font-bold">CQS: 9.8 / 10</div>
                          <div className="text-[10px] text-slate-400">1,840 نقطة كفاءة</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200">هندسة النظم الموزعة</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200">Next.js & TypeScript</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200">صيانة عتاد متقدمة</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-200">Cloudflare D1</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                      <span>إشراف: حاضنة بوصلة الجيل التقني</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> موثق ومتاح للشركات
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {heroAudienceTab === 'corporate' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold">
                      <Briefcase className="w-3.5 h-3.5" /> بوابة الشركاء والتوظيف B2B
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      استقطب الكفاءات الليبية المثبتة بالأرقام ومشاريع الواقع
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      وفّر أسابيع من التوظيف التقليدي والمقابلات الروتينية. استعرض كفاءات جاهزة للعمل خضعت لاختبارات صارمة وأثبتت تفوقها في ورش الحاضنة، واطرح تحديات تقنية برعاية شركتك.
                    </p>
                    <div className="pt-3 flex gap-3">
                      <Link
                        href="/corporate"
                        className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-600/20 transition-all btn-press"
                      >
                        دخول بوابة الشركات واستكشاف الكفاءات
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-6 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>الكفاءات الجاهزة للتوظيف الفوري</span>
                      <span className="text-sky-500">120+ مرشح معتمد</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">سارة المهدي الفيتوري</div>
                          <div className="text-[11px] text-slate-400">أمن سيبراني واختبار اختراق • CQS 9.9</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                          متاحة للعمل
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex justify-between items-center text-xs">
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">عمر بشير الترهوني</div>
                          <div className="text-[11px] text-slate-400">مهندس ذكاء اصطناعي ونظم مدمجة • CQS 9.7</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                          متاح للعمل
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {heroAudienceTab === 'instructor' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4 text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                      <Award className="w-3.5 h-3.5" /> برنامج المدرب وصانع المحتوى
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                      قدّم خبرتك واحمِ محتواك ببروتوكول العلامة المائية الجنائية
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      انضم لنخبة المدربين المعتمدين في إتقان: ارفع دروساً مصغرة لا تتجاوز 20 دقيقة، احصل على حماية مطلقة ضد تصوير الشاشة والقرصنة، وأدر ورشك الميدانية في مقر الحاضنة بطرابلس مع متابعة تفاعل المتدربين لحظياً.
                    </p>
                    <div className="pt-3">
                      <Link
                        href="/instructor"
                        className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all btn-press"
                      >
                        لوحة تحكم المدرب ورفع الدروس
                      </Link>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-6 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      معايير اعتماد المدرب في إتقان (CQS)
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" /> مدة كل درس ≤ 20 دقيقة مع تطبيق عملي فوري
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" /> توليد ترجمة فورية متعددة اللغات عبر النص (Transcript)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-500" /> علامات مائية عشوائية متحركة لحماية الملكية الفكرية
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Impact Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-14">
            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <span className="text-3xl sm:text-4xl font-black text-emerald-500 font-mono">450+</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">متدرب معتمد موثق</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-medium mt-1">
                <TrendingUp className="w-3 h-3" /> +18% هذا الشهر
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <span className="text-3xl sm:text-4xl font-black text-teal-500 font-mono">9.8</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">معيار جودة المحتوى CQS</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-teal-600 font-medium mt-1">
                <ShieldCheck className="w-3 h-3" /> جودة معتمدة
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <span className="text-3xl sm:text-4xl font-black text-sky-500 font-mono">15+</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">ورشة تطبيقية في الحاضنة</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-sky-600 font-medium mt-1">
                <MapPin className="w-3 h-3" /> مقر طرابلس
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
              <span className="text-3xl sm:text-4xl font-black text-amber-500 font-mono">100%</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold">موثق ومحمي برمز QR</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-medium mt-1">
                <CheckCircle2 className="w-3 h-3" /> جاهز للشركات
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Specialized Tracks Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>المسارات التخصصية المعتمدة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            خمسة مسارات هندسية لبناء الاقتصاد المعرفي الليبي
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            مناهج تطبيقية حقيقية مصممة لمواكبة احتياجات سوق العمل والمؤسسات التقنية الكبرى.
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
                className="group relative p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between card-tactile"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {track.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2.5">
                      {track.description}
                    </p>
                  </div>

                  {/* Market info */}
                  <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-slate-500">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-medium">
                      🔥 مطلوب بشدة محلياً
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                      معيار CQS 9.5+
                    </span>
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
                  <span className="text-[11px] text-slate-400 font-mono">12+ درساً مصغراً</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. CQS Quality Search Engine & Courses Discovery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-950 text-white p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
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
                  className="w-full pr-12 pl-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* CQS Slider */}
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 px-4 py-3 rounded-2xl">
                <div className="flex-1">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                      <span>الحد الأدنى للجودة CQS:</span>
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">{minCqs.toFixed(1)} / 10</span>
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
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedTrack('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap btn-press ${
                  selectedTrack === 'all' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                جميع المسارات ({coursesList.length})
              </button>
              {TRACKS_INFO.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrack(t.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap btn-press ${
                    selectedTrack === t.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {t.title}
                </button>
              ))}
            </div>

            {/* Courses Result Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-3xl bg-slate-900/90 border border-slate-800 overflow-hidden hover:border-emerald-500/60 transition-all flex flex-col justify-between card-tactile shadow-lg"
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
                      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-black text-emerald-400 border border-emerald-500/40">
                        CQS {course.cqsScore} ★
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-white flex items-center gap-1.5 font-mono">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{course.totalDurationMinutes} دقيقة إجمالية</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
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
                          className="w-6 h-6 rounded-full object-cover border border-emerald-500/30"
                        />
                        <span className="text-xs text-slate-300 font-medium">
                          {course.instructorName}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-800/80 mt-4 flex items-center justify-between">
                    <span className="text-xs text-emerald-400 font-bold">
                      {course.lessonsCount} دروس محمية
                    </span>
                    <Link
                      href={`/watch/${course.id}`}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 btn-press"
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

      {/* 4. Upcoming Offline Workshops at Incubator Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>المقر الميداني: حاضنة بوصلة الجيل التقني (طرابلس)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              ورش العمل الواقعية والتدريب التطبيقي
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
            const percentage = Math.round((ws.bookedSeats / ws.totalSeats) * 100);

            return (
              <div
                key={ws.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between card-tactile"
              >
                <div>
                  <div className="relative aspect-video w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ws.imageUrl} alt={ws.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5">
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

                    <div className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{ws.venueName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>المدرب: <strong>{ws.instructorName}</strong></span>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">حالة المقاعد بالحاضنة:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {seatsLeft} مقاعد متبقية
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">نوع الحجز:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      مجاني ومدعوم
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookWorkshop(ws)}
                    disabled={seatsLeft <= 0 || bookingLoading}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 btn-press"
                  >
                    حجز مقعد وتذكرة QR
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
          <div className="rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border-2 border-amber-500/30 p-7 sm:p-9 flex flex-col justify-between shadow-xl">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>نجم سنة 2026 في الحاضنة</span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  المتدرب الأكثر تميزاً
                </h3>
                <span className="text-xs text-slate-500 block mt-1 font-medium">
                  مسار هندسة النظم السحابية والحلول البرمجية
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                حققت أعلى معدل اجتياز للتحديات البرمجية وهندسة النظم الموزعة ونالت اعتماد «حاضنة بوصلة الجيل التقني» في حماية المحتوى السحابي.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/20 text-center">
                  <span className="text-xl font-black text-amber-500 font-mono">2,940</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">نقطة تميز</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-500/20 text-center">
                  <span className="text-xl font-black text-emerald-500 font-mono">28 يوم</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">استمرار متواصل 🔥</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/passport/usr_academic_02"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors btn-press shadow-md"
              >
                <span>استعراض جواز المهارات الرسمي</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Top Leaderboard */}
          <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-7 sm:p-9 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">لوحة شرف إتقان التنافسية</h3>
                  <span className="text-xs text-slate-500">أبطال التحديات الأسبوعية والشهرية</span>
                </div>
              </div>
              <Link
                href="/community"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                شاهد الكل
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_LEADERBOARD.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                      item.rank === 1 ? 'bg-amber-500 text-white shadow-sm' :
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
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            خطط الانضمام لمنظومة إتقان
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            مفتوح للجميع لتمكين الشباب الليبي، مع مزايا خاصة لطلاب الجامعات الموثقة ورعاة التحديات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Personal */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 space-y-6 flex flex-col justify-between card-tactile shadow-sm">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">الأفراد</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">المسار الحر</h3>
              <div className="text-3xl font-black text-slate-900 dark:text-white">مجاناً</div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> مشاهدة كافة الدروس المصغرة (≤ 20 دقيقة)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> تشغيل مشغل الفيديو المحمي بالعلامة المائية
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> خوض الاختبارات ومحرر الكود المدمج
                </li>
              </ul>
            </div>
            <Link
              href="/auth"
              className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-center text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors btn-press"
            >
              ابدأ الآن مجاناً
            </Link>
          </div>

          {/* Academic Verified (Featured) */}
          <div className="rounded-3xl bg-gradient-to-b from-emerald-950/50 via-slate-900 to-slate-950 border-2 border-emerald-500 p-8 space-y-6 flex flex-col justify-between relative shadow-2xl shadow-emerald-500/15 card-tactile">
            <div className="absolute -top-3.5 right-8 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md">
              الخيار الموصى به للجامعات
            </div>
            <div className="space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">الأكاديمي الموثق</span>
              <h3 className="text-xl font-bold text-white">المسار الأكاديمي والمهني</h3>
              <div className="text-3xl font-black text-white">
                دعم كامل <span className="text-xs text-slate-400 font-normal">من الحاضنة</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> توثيق الهوية بالبريد الجامعي أو البطاقة (OCR)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> جواز مهارات رقمي حي وموثق برمز QR
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> أولوية حجز الورش الميدانية بحاضنة بوصلة الجيل التقني
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" /> إدراج الملف في بنك الكفاءات الموجه للشركات
                </li>
              </ul>
            </div>
            <Link
              href="/auth"
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-center text-xs font-black text-white shadow-lg shadow-emerald-600/30 transition-all btn-press"
            >
              توثيق الحساب الأكاديمي
            </Link>
          </div>

          {/* Corporate */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 space-y-6 flex flex-col justify-between card-tactile shadow-sm">
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">الشركات والمؤسسات</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">بوابة الشركاء B2B</h3>
              <div className="text-3xl font-black text-slate-900 dark:text-white">شراكة استراتيجية</div>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400 pt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> الوصول لبنك الكفاءات الموثق وفلترة المهارات
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> رعاية وتحديات الباونتي (Sponsored Bounties)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> استقطاب أصحاب الأداء الأعلى في الورش الميدانية
                </li>
              </ul>
            </div>
            <Link
              href="/corporate"
              className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-center text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors btn-press"
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
