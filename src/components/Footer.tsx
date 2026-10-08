import React from 'react';
import Link from 'next/link';
import { Sparkles, ExternalLink, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Organization */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 dark:text-white">منظومة إتقان</span>
                <span className="block text-[11px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wider">
                  ETQAN PLATFORM
                </span>
              </div>
            </div>
            
            <p className="text-xs sm:text-sm leading-relaxed max-w-md text-slate-600 dark:text-slate-300">
              منصة تقنية متخصصة لبناء وتأهيل الكفاءات وربطها بسوق العمل، برعاية <strong>«حاضنة بوصلة الجيل التقني»</strong>.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              المسارات التخصصية المعتمدة
            </h4>
            <ul className="space-y-2.5 text-xs">
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
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              المقر الميداني والحاضنة
            </h4>
            <div className="text-xs space-y-2.5">
              <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>حاضنة بوصلة الجيل التقني (Tech Compass)</span>
              </p>
              <p className="text-slate-500 leading-relaxed">
                طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار الرقمي، ليبيا
              </p>
              <p className="text-slate-500 font-mono">
                البريد: info@tech-compass.ly
              </p>
              <div className="pt-2">
                <Link
                  href="/workshops"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-100 transition-colors"
                >
                  <span>حجز مقعد في الورش الواقعية</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} منظومة إتقان. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>برعاية حاضنة بوصلة الجيل التقني</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
