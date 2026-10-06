'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { UserRole, VerificationType } from '@/lib/types';
import { 
  GraduationCap, 
  User, 
  Upload, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Award, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { isFirebaseActive, loginWithEmail, registerUser, loginAsDemo, verifyAcademicOcr } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [accountType, setAccountType] = useState<'personal' | 'academic' | 'corporate'>('academic');
  const [academicMethod, setAcademicMethod] = useState<'edu_email' | 'ocr_upload'>('edu_email');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [techSector, setTechSector] = useState('برمجيات وحلول سحابية');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('جامعة طرابلس');
  const [studentId, setStudentId] = useState('');
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrSuccessData, setOcrSuccessData] = useState<{ institution: string; studentId: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle OCR Document Upload simulation
  const handleOcrFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrScanning(true);
    setErrorMsg('');
    try {
      const res = await verifyAcademicOcr(file);
      if (res.success && res.data) {
        setOcrSuccessData(res.data);
        setUniversity(res.data.institution);
        setStudentId(res.data.studentId);
      }
    } catch {
      setErrorMsg('تعذر مسح المستند، يرجى المحاولة مرة أخرى.');
    } finally {
      setOcrScanning(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    if (mode === 'login') {
      const ok = await loginWithEmail(email, password);
      if (ok) {
        router.push('/dashboard');
      } else {
        setErrorMsg('بيانات الدخول غير صحيحة.');
      }
    } else {
      const role: UserRole = accountType === 'corporate' ? 'corporate' : 'trainee';
      const verificationType: VerificationType = 
        accountType === 'personal' ? 'personal' :
        accountType === 'corporate' ? 'personal' :
        academicMethod === 'ocr_upload' ? 'academic_ocr' : 'academic_edu';

      const ok = await registerUser(
        accountType === 'corporate' ? (companyName || fullName || 'شركة شريكة') : (fullName || 'متدرب جديد'),
        email,
        role,
        verificationType,
        accountType === 'academic' ? { academicInstitution: university, studentIdNumber: studentId || 'IT-2026-9021' } : undefined
      );

      if (ok) {
        if (role === 'corporate') {
          router.push('/corporate');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMsg('تعذر إنشاء الحساب، يرجى مراجعة البيانات.');
      }
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>منظومة المصادقة والتحقق المزدوج (Dual Identity)</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          {mode === 'login' ? 'تسجيل الدخول إلى إتقان' : 'إنشاء حساب جديد وتوثيق الهوية'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          اختر المسار الأكاديمي للحصول على جواز المهارات المعتمد من حاضنة «بوصلة الجيل التقني».
        </p>
      </div>

      {/* Quick 1-Click Demo Login Box */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-3 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>تجربة المنصة الفورية بنقرة واحدة (1-Click Demo Switcher):</span>
          </span>
          <span className="text-[10px] text-slate-400">
            {isFirebaseActive ? '⚡ اتصال Firebase نشط' : '🛡️ وضع المحاكاة الذكي نشط'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            onClick={() => { loginAsDemo('trainee_academic'); router.push('/dashboard'); }}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-right transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="truncate">
              <span className="block text-white truncate">فاطمة الدربالي</span>
              <span className="text-[10px] text-slate-400">طالبة أكاديمية موثقة</span>
            </div>
          </button>

          <button
            onClick={() => { loginAsDemo('trainee_personal'); router.push('/dashboard'); }}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-right transition-colors"
          >
            <User className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <div className="truncate">
              <span className="block text-white truncate">أحمد الفيتوري</span>
              <span className="text-[10px] text-slate-400">متدرب مسار حر</span>
            </div>
          </button>

          <button
            onClick={() => { loginAsDemo('instructor_lead'); router.push('/instructor'); }}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-right transition-colors"
          >
            <Award className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="truncate">
              <span className="block text-white truncate">م. خليل الزواوي</span>
              <span className="text-[10px] text-slate-400">مدرب معتمد CQS</span>
            </div>
          </button>

          <button
            onClick={() => { loginAsDemo('corporate_partner'); router.push('/corporate'); }}
            className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-right transition-colors"
          >
            <Building2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <div className="truncate">
              <span className="block text-white truncate">شركة المدار التقني</span>
              <span className="text-[10px] text-slate-400">شريك شركات B2B</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        {/* Toggle Login vs Register */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 pb-4">
          <button
            onClick={() => setMode('register')}
            className={`flex-1 pb-2 text-sm font-bold border-b-2 text-center transition-colors ${
              mode === 'register'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            حساب جديد والتحقق
          </button>
          <button
            onClick={() => setMode('login')}
            className={`flex-1 pb-2 text-sm font-bold border-b-2 text-center transition-colors ${
              mode === 'login'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            تسجيل الدخول
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'register' && (
            <>
              {/* Account Type Selector (Academic vs Personal vs Corporate) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('academic')}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex items-start gap-2.5 btn-press ${
                    accountType === 'academic'
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold block">المسار الأكاديمي</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      لطلاب الجامعات. يمنح جواز مهارات برمز QR.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('personal')}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex items-start gap-2.5 btn-press ${
                    accountType === 'personal'
                      ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 text-sky-950 dark:text-sky-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold block">المسار الحر</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      للمتعلمين والمطورين المستقلين الراغبين بالتطور.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('corporate')}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex items-start gap-2.5 btn-press ${
                    accountType === 'corporate'
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-950 dark:text-blue-200 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold block">شريك شركات (B2B)</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      لاستقطاب الكفاءات وطرح مسابقات التوظيف.
                    </span>
                  </div>
                </button>
              </div>

              {/* Corporate Specific Fields */}
              {accountType === 'corporate' && (
                <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    <span>بيانات المؤسسة أو الشركة الشريكة:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        اسم الشركة / المؤسسة:
                      </label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="مثال: شركة المدار للحلول التقنية"
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        القطاع والنشاط التقني:
                      </label>
                      <select
                        value={techSector}
                        onChange={(e) => setTechSector(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500 font-semibold"
                      >
                        <option value="برمجيات وحلول سحابية">برمجيات وحلول سحابية</option>
                        <option value="شبكات وأمن سيبراني">شبكات وأمن سيبراني</option>
                        <option value="صيانة إلكترونية وعتاد">صيانة إلكترونية وعتاد صناعي</option>
                        <option value="ذكاء اصطناعي وأتمتة">ذكاء اصطناعي وأتمتة روبوتية</option>
                        <option value="اتصالات وتقنية معلومات">اتصالات وتقنية معلومات</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      اسم ممثل التوظيف أو الموارد البشرية:
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: أ. سالم المهدي - مدير التوظيف"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Academic Verification Options */}
              {accountType === 'academic' && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">طريقة توثيق الحساب الأكاديمي:</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAcademicMethod('edu_email')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold btn-press ${
                          academicMethod === 'edu_email' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        البريد الجامعي (.edu)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAcademicMethod('ocr_upload')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold btn-press ${
                          academicMethod === 'ocr_upload' ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        رفع البطاقة الجامعية (OCR)
                      </button>
                    </div>
                  </div>

                  {academicMethod === 'ocr_upload' && (
                    <div className="space-y-3 pt-2">
                      <div className="border-2 border-dashed border-emerald-500/40 rounded-2xl p-6 text-center space-y-3 bg-emerald-50/20 dark:bg-emerald-950/10">
                        <Upload className="w-8 h-8 text-emerald-500 mx-auto" />
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            ارفع صورة البطاقة الجامعية أو إفادة التسجيل
                          </p>
                          <span className="text-[11px] text-slate-500">
                            يقوم محرك الذكاء الاصطناعي (OCR) باستخراج بياناتك والتحقق فورياً
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleOcrFileUpload}
                          className="text-xs text-slate-500 file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
                        />
                      </div>

                      {ocrScanning && (
                        <div className="text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse py-2">
                          ⚡ جاري مسح وقراءة بيانات البطاقة بتقنية OCR...
                        </div>
                      )}

                      {ocrSuccessData && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-emerald-500" />
                            <span>تم التحقق: {ocrSuccessData.institution} ({ocrSuccessData.studentId})</span>
                          </div>
                          <span className="font-bold text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded">موثق بنجاح</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Full Name for non-corporate */}
              {accountType !== 'corporate' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    الاسم الرباعي الكامل (كما يظهر في الشهادات):
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: فاطمة سالم الدربالي"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {accountType === 'corporate' && mode === 'register' ? 'البريد الإلكتروني المهني للشركة:' : 'البريد الإلكتروني:'}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                accountType === 'corporate' ? 'recruitment@company.ly' :
                accountType === 'academic' && academicMethod === 'edu_email' ? 'username@uot.edu.ly' : 'name@example.com'
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              dir="ltr"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              كلمة المرور:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
              dir="ltr"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 btn-press"
          >
            {isSubmitting
              ? 'جاري المعالجة...'
              : mode === 'register'
              ? accountType === 'corporate'
                ? 'إنشاء حساب الشراكة ودخول بوابة الشركات'
                : 'إنشاء الحساب وتفعيل جواز المهارات'
              : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
