import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Cloud, Database, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Organization */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 dark:text-white">منصة إتقان</span>
                <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ETQAN PLATFORM
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed max-w-md">
              المنصة التعليمية والتقنية الأولى المتكاملة لتدريب وتمكين الكوادر الشبابية في ليبيا والمنطقة، 
              برعاية وإشراف مباشر من <strong>«حاضنة بوصلة الجيل التقني»</strong>.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Firebase Auth
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                <Database className="w-3.5 h-3.5 text-amber-500" /> Cloudflare D1
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                <Cloud className="w-3.5 h-3.5 text-sky-500" /> Cloudflare R1 Storage
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              المسارات التخصصية
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses?track=programming" className="hover:text-emerald-500 transition-colors">
                  البرمجة وهندسة النظم الموزعة
                </Link>
              </li>
              <li>
                <Link href="/courses?track=hardware" className="hover:text-emerald-500 transition-colors">
                  صيانة العتاد والشرائح الإلكترونية
                </Link>
              </li>
              <li>
                <Link href="/courses?track=ai_robotics" className="hover:text-emerald-500 transition-colors">
                  الروبوتات والذكاء الاصطناعي
                </Link>
              </li>
              <li>
                <Link href="/courses?track=security" className="hover:text-emerald-500 transition-colors">
                  الدفاع الرقمي والأمن السيبراني
                </Link>
              </li>
              <li>
                <Link href="/courses?track=design" className="hover:text-emerald-500 transition-colors">
                  الأنظمة التصميمية وتجربة المستخدم
                </Link>
              </li>
            </ul>
          </div>

          {/* Incubator & Headquarters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              المقر الميداني والحاضنة
            </h4>
            <div className="text-xs space-y-2">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                حاضنة بوصلة الجيل التقني (Tech Compass)
              </p>
              <p>طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار الرقمي</p>
              <p>البريد: info@tech-compass.ly</p>
              <div className="pt-2">
                <Link
                  href="/workshops"
                  className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  حجز مقعد في الورش الواقعية <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} منصة إتقان - جميع الحقوق محفوظة لمنظمة بوصلة الجيل التقني.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>جاهز للنشر على Vercel بنقرة واحدة</span>
            <span>•</span>
            <span>معيار جودة المحتوى CQS 9.5+</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
