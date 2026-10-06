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
  Layers,
  Award
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
    { href: '/courses', label: 'المسارات والدورات', icon: BookOpen },
    { href: '/workshops', label: 'الورش الميدانية', icon: MapPin },
    { href: '/community', label: 'التحديات والمجتمع', icon: Trophy },
    { href: '/corporate', label: 'بوابة الشركات', icon: Building2 },
  ];

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    trainee: {
      label: user?.verificationType?.startsWith('academic') ? 'متدرب أكاديمي موثق' : 'متدرب شخصي',
      badge: user?.verificationType?.startsWith('academic') ? 'أكاديمي' : 'حر',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    instructor: {
      label: 'مدرب معتمد (CQS)',
      badge: 'صانع محتوى',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
    corporate: {
      label: 'شريك شركات ومؤسسات',
      badge: 'B2B',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    admin: {
      label: 'مشرف النظام',
      badge: 'Root',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      {/* Top Incubator Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-semibold">رعاية رسمية</span>
            <span>بإشراف ورعاية منظمة وحاضنة <strong>«بوصلة الجيل التقني»</strong> لبناء الكفاءات الليبية</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-[11px] opacity-90">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> جاهز للربط مع Vercel & Firebase & D1
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">إتقان</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider -mt-1">
                  ETQAN PLATFORM
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 mr-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Demo Switcher & Profile & Theme */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  user ? roleLabels[user.role].color : 'border-slate-300 text-slate-600'
                }`}
                title="تبديل الدور للتجربة السريعة"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>الدور: {user ? roleLabels[user.role].label : 'غير مسجل'}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 font-semibold">
                    تبديل دور الحساب فورياً (Demo Switcher)
                  </div>
                  <button
                    onClick={() => { switchRole('trainee'); setRoleDropdownOpen(false); router.push('/dashboard'); }}
                    className="w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 btn-press"
                  >
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-emerald-500" />
                      متدرب أكاديمي / شخصي
                    </span>
                    {user?.role === 'trainee' && <span className="text-[10px] bg-emerald-500 text-white px-1.5 rounded">نشط</span>}
                  </button>
                  <button
                    onClick={() => { switchRole('instructor'); setRoleDropdownOpen(false); router.push('/instructor'); }}
                    className="w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 btn-press"
                  >
                    <span className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      مدرب معتمد (CQS)
                    </span>
                    {user?.role === 'instructor' && <span className="text-[10px] bg-amber-500 text-white px-1.5 rounded">نشط</span>}
                  </button>
                  <button
                    onClick={() => { switchRole('corporate'); setRoleDropdownOpen(false); router.push('/corporate'); }}
                    className="w-full text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 btn-press"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      شريك شركات (B2B)
                    </span>
                    {user?.role === 'corporate' && <span className="text-[10px] bg-blue-500 text-white px-1.5 rounded">نشط</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="تبديل الوضع (Dark / Light)"
              aria-label="تبديل المظهر"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* User Profile or Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === 'instructor' ? '/instructor' : user.role === 'corporate' ? '/corporate' : '/dashboard'}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500/50"
                  />
                  <div className="hidden lg:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[120px]">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {user.points} نقطة 🔥
                    </span>
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <User className="w-4 h-4" />
                <span>دخول / تسجيل</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Icon className="w-4 h-4 text-emerald-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <span className="text-xs text-slate-400 px-3">تبديل الدور للتجربة:</span>
              <div className="grid grid-cols-3 gap-2 px-3">
                <button
                  onClick={() => { switchRole('trainee'); setMobileMenuOpen(false); router.push('/dashboard'); }}
                  className={`text-xs py-1.5 rounded border text-center btn-press ${user?.role === 'trainee' ? 'border-emerald-500 text-emerald-500 font-bold' : 'border-slate-300 dark:border-slate-700'}`}
                >
                  متدرب
                </button>
                <button
                  onClick={() => { switchRole('instructor'); setMobileMenuOpen(false); router.push('/instructor'); }}
                  className={`text-xs py-1.5 rounded border text-center btn-press ${user?.role === 'instructor' ? 'border-amber-500 text-amber-500 font-bold' : 'border-slate-300 dark:border-slate-700'}`}
                >
                  مدرب
                </button>
                <button
                  onClick={() => { switchRole('corporate'); setMobileMenuOpen(false); router.push('/corporate'); }}
                  className={`text-xs py-1.5 rounded border text-center btn-press ${user?.role === 'corporate' ? 'border-blue-500 text-blue-500 font-bold' : 'border-slate-300 dark:border-slate-700'}`}
                >
                  شركات
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
