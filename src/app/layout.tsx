import type { Metadata } from 'next';
import { Cairo, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'إتقان | المنصة التقنية المتكاملة لبناء الكفاءات والربط الوظيفي - بوصلة الجيل التقني',
  description: 'المنصة التعليمية التقنية الأولى المتخصصة في البرمجة، العتاد والصيانة، الذكاء الاصطناعي، والأمن السيبراني برعاية حاضنة بوصلة الجيل التقني.',
  keywords: ['إتقان', 'بوصلة الجيل التقني', 'ليبيا', 'دورات برمجية', 'صيانة عتاد', 'أمن سيبراني', 'ذكاء اصطناعي'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased font-sans selection:bg-emerald-500 selection:text-white">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
