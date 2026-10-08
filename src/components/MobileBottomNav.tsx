'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  Home, 
  Layers, 
  MapPin, 
  Trophy, 
  LayoutDashboard,
  ShieldAlert,
  User,
  X,
  Code2,
  Cpu,
  Bot,
  Palette,
  ChevronLeft
} from 'lucide-react';
import { TRACKS_INFO } from '@/lib/mock-data';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [tracksSheetOpen, setTracksSheetOpen] = useState(false);

  const getAccountHref = () => {
    if (!user) return '/auth';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'instructor') return '/instructor';
    if (user.role === 'corporate') return '/corporate';
    return '/dashboard';
  };

  const getAccountLabel = () => {
    if (!user) return 'دخول';
    if (user.role === 'admin') return 'الأدمن';
    return 'حسابي';
  };

  const handleTrackSelect = (trackId: string) => {
    setTracksSheetOpen(false);
    router.push(`/courses?track=${trackId}`);
  };

  return (
    <>
      {/* Interactive Bottom Sheet for Departments / Tracks */}
      {tracksSheetOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end modal-enter"
          onClick={() => setTracksSheetOpen(false)}
        >
          <div 
            className="w-full bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-5 space-y-4 max-h-[82vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Handle & Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    الأقسام والمسارات المعتمدة
                  </h3>
                  <p className="text-[10px] text-slate-500">اختر القسم للانتقال للدروس والمشاريع المباشرة</p>
                </div>
              </div>

              <button
                onClick={() => setTracksSheetOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 btn-press"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tracks List */}
            <div className="space-y-2">
              {TRACKS_INFO.map((track) => {
                const Icon = track.id === 'programming' ? Code2 :
                             track.id === 'hardware' ? Cpu :
                             track.id === 'ai_robotics' ? Bot :
                             track.id === 'security' ? ShieldAlert : Palette;

                return (
                  <button
                    key={track.id}
                    onClick={() => handleTrackSelect(track.id)}
                    className="w-full text-right p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-emerald-500/40 bg-slate-50/70 dark:bg-slate-800/50 hover:bg-emerald-500/5 flex items-center justify-between gap-3 transition-all btn-press"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0 shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {track.title}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold flex-shrink-0">
                            {track.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {track.description}
                        </p>
                      </div>
                    </div>

                    <ChevronLeft className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center gap-2">
              <Link
                href="/courses"
                onClick={() => setTracksSheetOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold text-center transition-colors btn-press"
              >
                استعراض كافة الدورات والدروس (CQS)
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Pinned Bottom Nav Bar */}
      <nav 
        aria-label="شريط التنقل السريع للهواتف" 
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 w-full max-w-full overflow-hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl transition-all"
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto min-w-0">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all btn-press ${
              pathname === '/'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-all ${pathname === '/' ? 'bg-emerald-500/10' : ''}`}>
              <Home className={`w-5 h-5 ${pathname === '/' ? 'scale-110' : ''} transition-transform`} />
              {pathname === '/' && (
                <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">الرئيسية</span>
          </Link>

          {/* 2. Departments / Tracks Interactive Controller */}
          <button
            onClick={() => setTracksSheetOpen(!tracksSheetOpen)}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all btn-press ${
              tracksSheetOpen || pathname.startsWith('/courses')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-all ${
              tracksSheetOpen || pathname.startsWith('/courses') ? 'bg-emerald-500/10' : ''
            }`}>
              <Layers className={`w-5 h-5 ${tracksSheetOpen || pathname.startsWith('/courses') ? 'scale-110' : ''} transition-transform`} />
              {(tracksSheetOpen || pathname.startsWith('/courses')) && (
                <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">الأقسام</span>
          </button>

          {/* 3. Offline Workshops */}
          <Link
            href="/workshops"
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all btn-press ${
              pathname.startsWith('/workshops')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-all ${
              pathname.startsWith('/workshops') ? 'bg-emerald-500/10' : ''
            }`}>
              <MapPin className={`w-5 h-5 ${pathname.startsWith('/workshops') ? 'scale-110' : ''} transition-transform`} />
              {pathname.startsWith('/workshops') && (
                <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">الورش</span>
          </Link>

          {/* 4. Community & Challenges */}
          <Link
            href="/community"
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all btn-press ${
              pathname.startsWith('/community')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-all ${
              pathname.startsWith('/community') ? 'bg-emerald-500/10' : ''
            }`}>
              <Trophy className={`w-5 h-5 ${pathname.startsWith('/community') ? 'scale-110' : ''} transition-transform`} />
              {pathname.startsWith('/community') && (
                <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">المجتمع</span>
          </Link>

          {/* 5. Account / Dashboard / Admin */}
          <Link
            href={getAccountHref()}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all btn-press ${
              pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/auth')
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`relative p-1 rounded-xl transition-all ${
              pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/auth')
                ? 'bg-emerald-500/10'
                : ''
            }`}>
              {user?.role === 'admin' ? (
                <ShieldAlert className="w-5 h-5" />
              ) : user ? (
                <LayoutDashboard className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
              {(pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) && (
                <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium truncate max-w-[60px]">
              {getAccountLabel()}
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
