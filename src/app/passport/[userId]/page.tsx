'use client';

import React, { use } from 'react';
import { MOCK_USERS, MOCK_SKILL_BADGES } from '@/lib/mock-data';
import SkillPassportCard from '@/components/SkillPassportCard';
import { 
  ShieldCheck, 
  Building2, 
  Mail, 
  CheckCircle2, 
  Award
} from 'lucide-react';

interface PassportPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default function PublicPassportPage({ params }: PassportPageProps) {
  const resolvedParams = use(params);

  // Lookup user by id or fallback to Fatima Derbali
  const foundUser = Object.values(MOCK_USERS).find((u) => u.id === resolvedParams.userId) || MOCK_USERS.trainee_academic;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Official Verification Header */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-semibold">
          <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>جواز مهارات رقمي موثق ومسجل في سجلات حاضنة «بوصلة الجيل التقني»</span>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-mono text-slate-500">
          ID: {foundUser.id}
        </span>
      </div>

      {/* Main Passport Card */}
      <SkillPassportCard user={foundUser} badges={MOCK_SKILL_BADGES} isPublicView={true} />

      {/* Recruiter & Verification Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recruiter Contact */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              لأصحاب الشركات ومسؤولي التوظيف
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            تم التحقق من كافة المهارات والأكواد المدرجة في هذا الجواز عبر اختبارات معيارية وحلقات تدريبية حضورية في الحاضنة.
          </p>
          <div className="pt-2">
            <a
              href={`mailto:${foundUser.email}?subject=فرصة توظيف / تدريب - إتقان`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>التواصل مع الكفاءة مباشرة</span>
            </a>
          </div>
        </div>

        {/* Cryptographic Seal & Incubator Info */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              جهة الاعتماد والتوثيق
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            منظمة وحاضنة <strong>«بوصلة الجيل التقني»</strong> - طرابلس، ليبيا.
            المقر الميداني للتدريب وتأهيل الكفاءات الوطنية في مجالات التقنية والابتكار.
          </p>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>التوقيع الرقمي للشهادة ساري المفعول</span>
          </div>
        </div>
      </div>
    </div>
  );
}
