'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  BookOpen, 
  MapPin, 
  Building2, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Save, 
  X,
  ArrowRight
} from 'lucide-react';
import { MOCK_COURSES, MOCK_WORKSHOPS, MOCK_BOUNTIES, TRACKS_INFO } from '@/lib/mock-data';
import { Course, OfflineWorkshop, CorporateBounty } from '@/lib/types';
import Link from 'next/link';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'workshops' | 'bounties' | 'settings'>('courses');
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [workshops, setWorkshops] = useState<OfflineWorkshop[]>(MOCK_WORKSHOPS);
  const [bounties, setBounties] = useState<CorporateBounty[]>(MOCK_BOUNTIES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Site Settings State
  const [siteTitle, setSiteTitle] = useState('منظومة «إتقان» الوطنية: الكفاءة الحقيقية والاعتماد الميداني');
  const [siteSubtitle, setSiteSubtitle] = useState('المنصة الأولى المدمجة بالكامل لتمكين الكفاءات الوطنية. دروس مصغرة فائقة الجودة (≤ 20 دقيقة)، ورش عمل واقعية في مقر الحاضنة بطرابلس.');
  const [incubatorName, setIncubatorName] = useState('حاضنة بوصلة الجيل التقني');
  const [incubatorLocation, setIncubatorLocation] = useState('طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار الرقمي');

  // New Course Modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    track: 'programming',
    instructorName: '',
    lessonsCount: 8,
    totalDurationMinutes: 120,
    cqsScore: 9.8,
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  });

  // New Workshop Modal
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
  const [workshopForm, setWorkshopForm] = useState({
    title: '',
    description: '',
    venueName: 'مقر حاضنة بوصلة الجيل التقني - طرابلس',
    instructorName: '',
    totalSeats: 25,
    dateTime: '2026-10-25T16:00:00Z',
  });

  useEffect(() => {
    // Load from localStorage if present
    const savedCourses = localStorage.getItem('etqan_admin_courses');
    if (savedCourses) {
      try { setCourses(JSON.parse(savedCourses)); } catch {}
    }
    const savedWorkshops = localStorage.getItem('etqan_admin_workshops');
    if (savedWorkshops) {
      try { setWorkshops(JSON.parse(savedWorkshops)); } catch {}
    }
    const savedSettings = localStorage.getItem('etqan_admin_settings');
    if (savedSettings) {
      try {
        const s = JSON.parse(savedSettings);
        if (s.siteTitle) setSiteTitle(s.siteTitle);
        if (s.siteSubtitle) setSiteSubtitle(s.siteSubtitle);
        if (s.incubatorName) setIncubatorName(s.incubatorName);
        if (s.incubatorLocation) setIncubatorLocation(s.incubatorLocation);
      } catch {}
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Course Handlers
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    const newCourse: Course = {
      id: `course_${Date.now()}`,
      title: courseForm.title,
      slug: `course-${Date.now()}`,
      description: courseForm.description,
      track: courseForm.track as Course['track'],
      thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
      instructorId: 'usr_inst_03',
      instructorName: courseForm.instructorName || 'مدرب معتمد',
      instructorRole: 'خبير تقني بالحاضنة',
      instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      lessonsCount: Number(courseForm.lessonsCount),
      totalDurationMinutes: Number(courseForm.totalDurationMinutes),
      cqsScore: Number(courseForm.cqsScore),
      level: courseForm.level,
      enrolledStudentsCount: 1,
      isPublished: true,
      lessons: [],
      createdAt: new Date().toISOString(),
    };

    const updated = [newCourse, ...courses];
    setCourses(updated);
    localStorage.setItem('etqan_admin_courses', JSON.stringify(updated));
    setShowCourseModal(false);
    setCourseForm({
      title: '',
      description: '',
      track: 'programming',
      instructorName: '',
      lessonsCount: 8,
      totalDurationMinutes: 120,
      cqsScore: 9.8,
      level: 'beginner',
    });
    showToast('تمت إضافة الدورة بنجاح إلى منصة إتقان!');
  };

  const handleDeleteCourse = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الدورة من المنصة؟')) return;
    const updated = courses.filter((c) => c.id !== id);
    setCourses(updated);
    localStorage.setItem('etqan_admin_courses', JSON.stringify(updated));
    showToast('تم حذف الدورة بنجاح.');
  };

  // Workshop Handlers
  const handleAddWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    const newWs: OfflineWorkshop = {
      id: `ws_${Date.now()}`,
      title: workshopForm.title,
      description: workshopForm.description,
      venueName: workshopForm.venueName,
      venueAddress: 'طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار',
      instructorName: workshopForm.instructorName || 'مدرب بالحاضنة',
      instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      totalSeats: Number(workshopForm.totalSeats),
      bookedSeats: 0,
      dateTime: workshopForm.dateTime,
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
      priceLyd: 0,
      topics: ['تطبيق عملي مباشر', 'فحص واختبار ميداني'],
    };

    const updated = [newWs, ...workshops];
    setWorkshops(updated);
    localStorage.setItem('etqan_admin_workshops', JSON.stringify(updated));
    setShowWorkshopModal(false);
    setWorkshopForm({
      title: '',
      description: '',
      venueName: 'مقر حاضنة بوصلة الجيل التقني - طرابلس',
      instructorName: '',
      totalSeats: 25,
      dateTime: '2026-10-25T16:00:00Z',
    });
    showToast('تمت إضافة الورشة الميدانية وحجز قاعة الحاضنة بنجاح!');
  };

  const handleDeleteWorkshop = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الورشة؟')) return;
    const updated = workshops.filter((w) => w.id !== id);
    setWorkshops(updated);
    localStorage.setItem('etqan_admin_workshops', JSON.stringify(updated));
    showToast('تم حذف الورشة بنجاح.');
  };

  // Save Global Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const settings = {
      siteTitle,
      siteSubtitle,
      incubatorName,
      incubatorLocation,
    };
    localStorage.setItem('etqan_admin_settings', JSON.stringify(settings));
    showToast('تم حفظ وتحديث إعدادات ونصوص الموقع بنجاح!');
  };

  const handleDeleteBounty = (id: string) => {
    const updated = bounties.filter((b) => b.id !== id);
    setBounties(updated);
    showToast('تم حذف تحدي الباونتي بنجاح');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-8 left-4 right-4 sm:right-auto sm:left-8 z-50 p-4 rounded-2xl bg-slate-900 border border-emerald-500 text-white shadow-2xl flex items-center gap-3 modal-enter">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>لوحة التحكم الإدارية المركزية (Admin Control Panel)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            إدارة كافة فصول وصفحات ومحتوى منصة إتقان
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            تحكم كامل في الدورات، الورش الميدانية، إعدادات النصوص، وبنك الكفاءات بالحاضنة.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors btn-press self-start sm:self-auto"
        >
          <span>معاينة الموقع كزائر</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all btn-press ${
            activeTab === 'courses'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>إدارة الدورات والدروس ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('workshops')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all btn-press ${
            activeTab === 'workshops'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>ورش العمل بالحاضنة ({workshops.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bounties')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all btn-press ${
            activeTab === 'bounties'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>تحديات الشركات والباونتي ({bounties.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all btn-press ${
            activeTab === 'settings'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>إعدادات ونصوص المنصة</span>
        </button>
      </div>

      {/* TAB 1: Courses Management */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              الدورات والدروس المصغرة المسجلة
            </h2>
            <button
              onClick={() => setShowCourseModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all btn-press self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كورس جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold">
                      CQS {course.cqsScore} ★
                    </span>
                    <span className="text-slate-400 font-mono">
                      {course.lessonsCount} دروس • {course.totalDurationMinutes}د
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="text-[11px] text-slate-400">
                    المدرب: <strong className="text-slate-700 dark:text-slate-200">{course.instructorName}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/watch/${course.id}`}
                    className="text-xs text-emerald-600 font-bold hover:underline"
                  >
                    معاينة المشغل
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title="حذف الكورس"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Workshops Management */}
      {activeTab === 'workshops' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              ورش العمل الميدانية بمقر الحاضنة
            </h2>
            <button
              onClick={() => setShowWorkshopModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all btn-press self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة ورشة ميدانية</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshops.map((ws) => (
              <div
                key={ws.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-emerald-600">
                      {ws.totalSeats - ws.bookedSeats} مقاعد متبقية
                    </span>
                    <span className="text-slate-400 font-mono">
                      {new Date(ws.dateTime).toLocaleDateString('ar-LY')}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {ws.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {ws.description}
                  </p>
                  <div className="text-[11px] text-slate-400">
                    الموقع: <strong className="text-slate-700 dark:text-slate-200">{ws.venueName}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    المحجوز: {ws.bookedSeats} / {ws.totalSeats}
                  </span>
                  <button
                    onClick={() => handleDeleteWorkshop(ws.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title="حذف الورشة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Bounties Management */}
      {activeTab === 'bounties' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              تحديات الشركات والمنح المرصودة
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bounties.map((b) => (
              <div 
                key={b.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    {b.companyName}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                    {b.rewardAmount}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {b.description}
                </p>
                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>المتقدمين: {b.applicantsCount} متدرب</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-500 font-bold">نشط</span>
                    <button
                      onClick={() => handleDeleteBounty(b.id)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="حذف الباونتي"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Global Site Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              التعديل المطلق على نصوص وبيانات الموقع
            </h2>
            <p className="text-xs text-slate-500">
              قم بتعديل النصوص الرئيسية التي تظهر لكافة الزوار في الصفحة الرئيسية والفوتر.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                العنوان الرئيسي في واجهة الهيرو:
              </label>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الوصف التعريفي للهيرو:
              </label>
              <textarea
                rows={3}
                value={siteSubtitle}
                onChange={(e) => setSiteSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم الحاضنة الراعية:
              </label>
              <input
                type="text"
                value={incubatorName}
                onChange={(e) => setIncubatorName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                عنوان ومقر الحاضنة الميداني:
              </label>
              <input
                type="text"
                value={incubatorLocation}
                onChange={(e) => setIncubatorLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all btn-press"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات فورياً</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-enter">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">إضافة دورة مصغرة جديدة (≤ 20 دقيقة)</h3>
              <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">عنوان الدورة:</label>
                <input
                  required
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">الوصف:</label>
                <textarea
                  required
                  rows={2}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">المسار:</label>
                  <select
                    value={courseForm.track}
                    onChange={(e) => setCourseForm({ ...courseForm, track: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    {TRACKS_INFO.map((t) => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">اسم المدرب:</label>
                  <input
                    type="text"
                    value={courseForm.instructorName}
                    onChange={(e) => setCourseForm({ ...courseForm, instructorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">عدد الدروس:</label>
                  <input
                    type="number"
                    value={courseForm.lessonsCount}
                    onChange={(e) => setCourseForm({ ...courseForm, lessonsCount: parseInt(e.target.value, 10) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">درجة CQS:</label>
                  <input
                    type="number"
                    step="0.1"
                    min="8.0"
                    max="10.0"
                    value={courseForm.cqsScore}
                    onChange={(e) => setCourseForm({ ...courseForm, cqsScore: parseFloat(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">المستوى:</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="beginner">مبتدئ</option>
                    <option value="intermediate">متوسط</option>
                    <option value="advanced">متقدم</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all btn-press"
                >
                  حفظ ونشر الكورس
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Workshop Modal */}
      {showWorkshopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-enter">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">إضافة ورشة عمل بالحاضنة (ميدانية)</h3>
              <button onClick={() => setShowWorkshopModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddWorkshop} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">عنوان الورشة:</label>
                <input
                  required
                  type="text"
                  value={workshopForm.title}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">الوصف:</label>
                <textarea
                  required
                  rows={2}
                  value={workshopForm.description}
                  onChange={(e) => setWorkshopForm({ ...workshopForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">الموقع / القاعة:</label>
                  <input
                    type="text"
                    value={workshopForm.venueName}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, venueName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">المدرب المشرف:</label>
                  <input
                    type="text"
                    value={workshopForm.instructorName}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, instructorName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">إجمالي المقاعد:</label>
                  <input
                    type="number"
                    value={workshopForm.totalSeats}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, totalSeats: parseInt(e.target.value, 10) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">الموعد والتاريخ:</label>
                  <input
                    type="datetime-local"
                    value={workshopForm.dateTime.slice(0, 16)}
                    onChange={(e) => setWorkshopForm({ ...workshopForm, dateTime: new Date(e.target.value).toISOString() })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all btn-press"
                >
                  حفظ وإتاحة الحجز للورشة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
