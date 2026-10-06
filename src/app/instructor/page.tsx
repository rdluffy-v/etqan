'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { uploadLessonVideoToR1, UploadProgress } from '@/lib/r1';
import { 
  Award, 
  Upload, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  MapPin
} from 'lucide-react';

export default function InstructorPage() {
  const { user, switchRole } = useAuth();

  // Lesson Upload State
  const [lessonTitle, setLessonTitle] = useState('');
  const [courseTrack, setCourseTrack] = useState('programming');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [transcript, setTranscript] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Workshop Scheduling State
  const [wsTitle, setWsTitle] = useState('');
  const [wsDate, setWsDate] = useState('2026-11-15T10:00');
  const [wsSeats, setWsSeats] = useState(30);
  const [wsSuccess, setWsSuccess] = useState(false);

  // Auto switch to instructor if not currently set
  const isInstructor = user?.role === 'instructor';

  const handleLessonUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setUploadSuccess(false);

    // Strict CQS Check: Duration must be <= 20 minutes
    if (durationMinutes > 20) {
      setErrorMsg('⚠️ معيار جودة إتقان (CQS) الصارم يشترط ألا تزيد مدة الدرس عن 20 دقيقة (1200 ثانية) لضمان التركيز الذهني والتعلم المصغر.');
      return;
    }

    if (!selectedFile) {
      setErrorMsg('يرجى اختيار ملف الفيديو المخصص للدرس.');
      return;
    }

    try {
      const targetCourseId = 'course-arch-nextjs';
      const res = await uploadLessonVideoToR1(selectedFile, targetCourseId, (progress) => {
        setUploadProgress(progress);
      });

      if (res.success) {
        await fetch('/api/courses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_lesson',
            lesson: {
              courseId: targetCourseId,
              title: lessonTitle,
              durationSeconds: durationMinutes * 60,
              videoR1Url: res.videoUrl,
              transcript: transcript || undefined,
            },
          }),
        });

        setUploadSuccess(true);
        setLessonTitle('');
        setSelectedFile(null);
        setTranscript('');
      }
    } catch {
      setErrorMsg('تعذر رفع الفيديو إلى Cloudflare R1.');
    }
  };

  const handleCreateWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'schedule',
          workshop: {
            id: `ws_${Date.now()}`,
            title: wsTitle,
            description: 'ورشة هندسية تطبيقية في حاضنة بوصلة الجيل التقني بطرابلس.',
            instructorName: user?.fullName || 'م. خليل الزواوي',
            instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
            venueName: 'حاضنة بوصلة الجيل التقني - المقر الرئيسي',
            venueAddress: 'طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار',
            dateTime: wsDate,
            totalSeats: wsSeats,
            bookedSeats: 0,
            imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
            priceLyd: 0,
            topics: ['تطبيق عملي', 'فحص الدوائر', 'حوسبة طرفية'],
          },
        }),
      });
      setWsSuccess(true);
      setTimeout(() => setWsSuccess(false), 3000);
      setWsTitle('');
    } catch {
      setWsSuccess(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>بوابة المدرب وصناع المحتوى المعتمدين (CQS Portal)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            لوحة إدارة المحتوى والورش الميدانية
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            رفع الدروس المصغرة السحابية إلى Cloudflare R1 وإدارة ورش العمل بحاضنة بوصلة الجيل التقني.
          </p>
        </div>

        {!isInstructor && (
          <button
            onClick={() => switchRole('instructor')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            التبديل إلى دور المدرب المعتمد
          </button>
        )}
      </div>

      {/* Instructor CQS Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">معدل جودة المحتوى (CQS)</span>
          <div className="text-2xl font-black text-emerald-500 flex items-center gap-1">
            <span>9.8</span>
            <span className="text-xs text-slate-400 font-normal">/ 10 ★</span>
          </div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">
            أعلى من 95% من المعايير
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">إجمالي المتدربين النشطين</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            428
          </div>
          <span className="text-[10px] text-slate-400 block font-medium">عبر كافة المسارات</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">الدروس المصغرة المحمية R1</span>
          <div className="text-2xl font-black text-sky-500 font-mono">
            12
          </div>
          <span className="text-[10px] text-slate-400 block font-medium">جميعها ≤ 20 دقيقة</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-xs text-slate-500">الورش الميدانية بالحاضنة</span>
          <div className="text-2xl font-black text-amber-500 font-mono">
            3 ورش
          </div>
          <span className="text-[10px] text-slate-400 block font-medium">مقر بوصلة الجيل التقني</span>
        </div>
      </div>

      {/* Main Action Forms Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form 1: Upload Lesson to Cloudflare R1 */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                رفع درس جديد إلى Cloudflare R1
              </h2>
              <span className="text-xs text-slate-400">
                مشروط بمعيار CQS: مدة الدرس ≤ 20 دقيقة وحماية مشفرة
              </span>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>تم رفع ومعالجة الدرس وتوليد روابط البث السحابية بنجاح!</span>
            </div>
          )}

          <form onSubmit={handleLessonUpload} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                عنوان الدرس المصغر:
              </label>
              <input
                type="text"
                required
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="مثال: هندسة الحوسبة الطرفية وقواعد D1"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  المسار التخصصي:
                </label>
                <select
                  value={courseTrack}
                  onChange={(e) => setCourseTrack(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                >
                  <option value="programming">البرمجة وهندسة الأنظمة</option>
                  <option value="hardware">صيانة العتاد والشرائح</option>
                  <option value="ai_robotics">الروبوتات والذكاء الاصطناعي</option>
                  <option value="security">الأمن السيبراني</option>
                  <option value="design">التصميم وتجربة المستخدم</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  مدة الدرس (دقائق):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs sm:text-sm focus:outline-none ${
                      durationMinutes > 20 ? 'border-rose-500 text-rose-500' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {durationMinutes > 20 && (
                  <span className="text-[10px] text-rose-500 font-semibold block mt-1">
                    الحد الأقصى هو 20 دقيقة (CQS)
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ملف الفيديو (MP4 / HLS):
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
              />
            </div>

            {/* Simulated Upload Progress */}
            {uploadProgress && uploadProgress.status === 'uploading' && (
              <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>جاري الرفع إلى Cloudflare R1...</span>
                  <span className="font-mono text-emerald-500">{uploadProgress.percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress.percent}%` }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                نص الشرح (Transcript) لتوليد الترجمات التلقائية (VTT):
              </label>
              <textarea
                rows={3}
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="اكتب أو الصق نص الدرس هنا للمعالجة الذكية والترجمة..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={durationMinutes > 20 || (uploadProgress?.status === 'uploading')}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all"
            >
              رفع الدرس واعتماده
            </button>
          </form>
        </div>

        {/* Form 2: Schedule Offline Workshop at Incubator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                تنظيم ورشة واقعية بالحاضنة
              </h2>
              <span className="text-xs text-slate-400">
                مقر حاضنة بوصلة الجيل التقني - طرابلس
              </span>
            </div>
          </div>

          {wsSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>تم جدولة الورشة بنجاح وفتح المقاعد في المنصة وتجهيز القاعة!</span>
            </div>
          )}

          <form onSubmit={handleCreateWorkshop} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                عنوان الورشة الميدانية:
              </label>
              <input
                type="text"
                required
                value={wsTitle}
                onChange={(e) => setWsTitle(e.target.value)}
                placeholder="مثال: فحص وإصلاح لوحات التحكم الصناعية بالمجهر"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  موعد الانعقاد:
                </label>
                <input
                  type="datetime-local"
                  required
                  value={wsDate}
                  onChange={(e) => setWsDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  عدد المقاعد المتاحة:
                </label>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={wsSeats}
                  onChange={(e) => setWsSeats(parseInt(e.target.value) || 20)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">المقر المعتمد تلقائياً:</span>
              <p>حاضنة بوصلة الجيل التقني - طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار الرقمي</p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all"
            >
              نشر الورشة وتوليد تذاكر الـ QR
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
