'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { 
  Sun, 
  Moon, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  MapPin, 
  Trophy, 
  Building2, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  GraduationCap,
  Award,
  IdCard,
  CheckCircle2
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, switchRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/courses', label: 'المسارات والدورات', icon: BookOpen, tag: 'CQS 9.8' },
    { href: '/workshops', label: 'الورش الميدانية', icon: MapPin, tag: 'طرابلس' },
    { href: '/community', label: 'التحديات والمجتمع', icon: Trophy, tag: 'جوائز' },
    { href: '/corporate', label: 'بوابة الشركات', icon: Building2, tag: 'B2B' },
  ];

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string; dot: string }> = {
    trainee: {
      label: 'متدرب معتمد',
      badge: 'متدرب',
      color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
      dot: 'bg-emerald-500',
    },
    instructor: {
      label: 'مدرب معتمد (CQS)',
      badge: 'صانع محتوى',
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
      dot: 'bg-amber-500',
    },
    corporate: {
      label: 'شريك شركات ومؤسسات',
      badge: 'B2B',
      color: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30',
      dot: 'bg-sky-500',
    },
    admin: {
      label: 'مشرف النظام',
      badge: 'Root',
      color: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
      dot: 'bg-purple-500',
    },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl transition-all">
      {/* Top Incubator Trust Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white text-[11px] sm:text-xs py-1.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold tracking-wide">
              رعاية رسمية
            </span>
            <span className="truncate">
              بإشراف واعتماد حاضنة <strong>«بوصلة الجيل التقني»</strong> لبناء وتوظيف الكفاءات الوطنية
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] opacity-95">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              منظومة إتقان 2.0 • Vercel Edge CDN & Cloudflare D1
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-105 group-hover:rotate-1 transition-all duration-200">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    إتقان
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                    v2.0
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider -mt-0.5">
                  ETQAN • منظومة الكفاءات
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 mr-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-900/80'
                    }`}
                  >
                    <Icon className="w-4 h-4 opacity-80" />
                    <span>{link.label}</span>
                    {link.tag && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {link.tag}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 right-3.5 left-3.5 h-0.5 bg-emerald-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Demo Role Switcher, Profile, Theme Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                  user ? roleLabels[user.role].color : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                } hover:shadow-md btn-press`}
                title="تبديل الدور للتجربة الفورية (Demo)"
              >
                <span className={`w-2 h-2 rounded-full ${user ? roleLabels[user.role].dot : 'bg-slate-400'} animate-pulse`} />
                <span className="hidden sm:inline">الدور:</span>
                <span>{user ? roleLabels[user.role].label : 'تجربة الأدوار'}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 modal-enter"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      تبديل الحساب التجريبي (Live Switcher)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      تنقل بين كافة الواجهات بنقرة واحدة لاختبار النظام
                    </span>
                  </div>
                  
                  <div className="p-1 space-y-1">
                    <button
                      onClick={() => { switchRole('trainee'); setRoleDropdownOpen(false); router.push('/dashboard'); }}
                      className="w-full text-right px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-colors btn-press"
                    >
                      <span className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold">متدرب أكاديمي / حر</div>
                          <div className="text-[10px] text-slate-400">لوحة المهارات والجواز الرقمي</div>
                        </div>
                      </span>
                      {user?.role === 'trainee' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      )}
                    </button>

                    <button
                      onClick={() => { switchRole('instructor'); setRoleDropdownOpen(false); router.push('/instructor'); }}
                      className="w-full text-right px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-colors btn-press"
                    >
                      <span className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold">مدرب معتمد (CQS)</div>
                          <div className="text-[10px] text-slate-400">إدارة الورش ورفع الدروس ≤20د</div>
                        </div>
                      </span>
                      {user?.role === 'instructor' && (
                        <CheckCircle2 className="w-4 h-4 text-amber-500" />
                      )}
                    </button>

                    <button
                      onClick={() => { switchRole('corporate'); setRoleDropdownOpen(false); router.push('/corporate'); }}
                      className="w-full text-right px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-colors btn-press"
                    >
                      <span className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold">شريك شركات (B2B)</div>
                          <div className="text-[10px] text-slate-400">استقطاب الكفاءات والمنح</div>
                        </div>
                      </span>
                      {user?.role === 'corporate' && (
                        <CheckCircle2 className="w-4 h-4 text-sky-500" />
                      )}
                    </button>

                    <button
                      onClick={() => { switchRole('admin'); setRoleDropdownOpen(false); router.push('/admin'); }}
                      className="w-full text-right px-3.5 py-2.5 rounded-xl text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 transition-colors btn-press"
                    >
                      <span className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold">لوحة الإدارة والتحكم (Admin)</div>
                          <div className="text-[10px] text-slate-400">تحكم وإدارة كاملة بمحتوى المنصة</div>
                        </div>
                      </span>
                      {user?.role === 'admin' && (
                        <CheckCircle2 className="w-4 h-4 text-purple-500" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Theme Button */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors btn-press"
              title="تبديل المظهر (Dark / Light)"
              aria-label="تبديل المظهر"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* Profile or Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === 'instructor' ? '/instructor' : user.role === 'corporate' ? '/corporate' : '/dashboard'}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50 transition-all btn-press"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-xl object-cover border-2 border-emerald-500/40 shadow-sm"
                  />
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span>{user.points} نقطة</span>
                      <span className="text-amber-500">🔥</span>
                    </span>
                  </div>
                </Link>

                <Link
                  href="/passport/demo-user-123"
                  className="hidden md:flex p-2.5 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors btn-press"
                  title="عرض جواز المهارات الرقمي الموثق"
                >
                  <IdCard className="w-4 h-4" />
                </Link>

                <button
                  onClick={logout}
                  className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors btn-press"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all btn-press"
              >
                <User className="w-4 h-4" />
                <span>دخول / تسجيل</span>
              </Link>
            )}

            {/* Mobile Drawer Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 btn-press"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-3 modal-enter">
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-emerald-500" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 px-2 block">تبديل الدور للتجربة الفورية:</span>
              <div className="grid grid-cols-4 gap-1.5 px-1">
                <button
                  onClick={() => { switchRole('trainee'); setMobileMenuOpen(false); router.push('/dashboard'); }}
                  className={`text-xs py-2 rounded-xl border text-center font-bold btn-press ${user?.role === 'trainee' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                >
                  متدرب
                </button>
                <button
                  onClick={() => { switchRole('instructor'); setMobileMenuOpen(false); router.push('/instructor'); }}
                  className={`text-xs py-2 rounded-xl border text-center font-bold btn-press ${user?.role === 'instructor' ? 'border-amber-500 bg-amber-500/10 text-amber-600' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                >
                  مدرب
                </button>
                <button
                  onClick={() => { switchRole('corporate'); setMobileMenuOpen(false); router.push('/corporate'); }}
                  className={`text-xs py-2 rounded-xl border text-center font-bold btn-press ${user?.role === 'corporate' ? 'border-sky-500 bg-sky-500/10 text-sky-600' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                >
                  شركات
                </button>
                <button
                  onClick={() => { switchRole('admin'); setMobileMenuOpen(false); router.push('/admin'); }}
                  className={`text-xs py-2 rounded-xl border text-center font-bold btn-press ${user?.role === 'admin' ? 'border-purple-500 bg-purple-500/10 text-purple-600' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                >
                  الإدارة
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
