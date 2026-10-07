'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { UserProfile, TraineeSkillBadge } from '@/lib/types';
import { MOCK_SKILL_BADGES } from '@/lib/mock-data';
import { 
  ShieldCheck, 
  Award, 
  QrCode, 
  Share2, 
  Check, 
  GraduationCap, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface SkillPassportCardProps {
  user: UserProfile;
  badges?: TraineeSkillBadge[];
  isPublicView?: boolean;
}

export default function SkillPassportCard({ user, badges = MOCK_SKILL_BADGES, isPublicView = false }: SkillPassportCardProps) {
  const [copied, setCopied] = useState(false);
  const passportUrl = typeof window !== 'undefined' ? `${window.location.origin}/passport/${user.id}` : `https://etqan.vercel.app/passport/${user.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-6 md:p-8 shadow-2xl hologram-sheen card-tactile">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Official Accreditation */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight">جواز المهارات الرقمي الموثق</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                LIVE CV
              </span>
            </div>
            <p className="text-xs text-slate-400">
              معتمد ومسجل رسمياً لدى حاضنة «بوصلة الجيل التقني»
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isPublicView ? (
            <>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم نسخ الرابط' : 'مشاركة الجواز'}</span>
              </button>
              <Link
                href={`/passport/${user.id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
              >
                <span>الصفحة العامة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800">
              <ShieldCheck className="w-4 h-4" />
              <span>هوية موثقة 100%</span>
            </div>
          )}
        </div>
      </div>

      {/* Trainee Profile & QR Code Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-slate-800 relative z-10 items-center">
        {/* User Info */}
        <div className="md:col-span-2 flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatarUrl}
            alt={user.fullName}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{user.fullName}</h3>
              {user.isVerified && (
                <span title="حساب موثق">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 font-mono" dir="ltr">
              {user.email}
            </p>

            {user.academicInstitution && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
                <GraduationCap className="w-4 h-4" />
                <span>{user.academicInstitution} ({user.studentIdNumber})</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                النقاط: <strong className="text-emerald-400">{user.points}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                أيام الاستمرار: <strong className="text-amber-400">{user.streakDays} يوم 🔥</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Verification QR Code */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white text-slate-900 shadow-inner">
          <QRCodeSVG 
            value={passportUrl} 
            size={110} 
            level="H" 
            includeMargin={true}
          />
          <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-slate-700">
            <QrCode className="w-3 h-3 text-emerald-600" />
            <span>امسح للتحقق الفوري المباشر</span>
          </div>
        </div>
      </div>

      {/* Verified Skills & Competencies */}
      <div className="pt-6 relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>المهارات والكفاءات المعتمدة ميدانياً:</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            {badges.length} مهارات موثقة
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block">{badge.name}</span>
                <span className="text-[10px] text-slate-400 block">جهة التوثيق: {badge.verifiedBy}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {badge.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
