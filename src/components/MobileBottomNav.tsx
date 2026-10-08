'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { 
  Home, 
  BookOpen, 
  MapPin, 
  Trophy, 
  LayoutDashboard,
  ShieldAlert,
  User
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/courses', label: 'الدورات', icon: BookOpen },
    { href: '/workshops', label: 'الورش', icon: MapPin },
    { href: '/community', label: 'المجتمع', icon: Trophy },
    { 
      href: user?.role === 'admin' ? '/admin' : user ? (user.role === 'instructor' ? '/instructor' : user.role === 'corporate' ? '/corporate' : '/dashboard') : '/auth', 
      label: user?.role === 'admin' ? 'الأدمن' : user ? 'حسابي' : 'دخول', 
      icon: user?.role === 'admin' ? ShieldAlert : user ? LayoutDashboard : User 
    },
  ];

  return (
    <nav 
      aria-label="شريط التنقل السريع للهواتف" 
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-2xl transition-all"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all btn-press ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-all ${
                isActive ? 'bg-emerald-500/10' : ''
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {isActive && (
                  <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
