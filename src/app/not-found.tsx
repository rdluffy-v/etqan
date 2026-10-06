import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shadow-lg">
        <Compass className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-emerald-500 tracking-wider">خطأ 404</span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          الصفحة أو الدورة غير موجودة
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          عذراً، لم نتمكن من العثور على المسار أو الصفحة المطلوبة. يمكنك العودة للمسارات التخصصية المعتمدة.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
        >
          الرئيسية
        </Link>
        <Link
          href="/courses"
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
        >
          <span>تصفح الدورات</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
