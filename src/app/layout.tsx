import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/lib/theme-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'إتقان | المنصة التقنية المتكاملة لبناء الكفاءات - بوصلة الجيل التقني',
  description: 'المنصة التعليمية التقنية الأولى المتخصصة في البرمجة، العتاد والصيانة، الذكاء الاصطناعي، والأمن السيبراني برعاية حاضنة بوصلة الجيل التقني.',
  keywords: ['إتقان', 'بوصلة الجيل التقني', 'ليبيا', 'دورات برمجية', 'صيانة عتاد', 'أمن سيبراني', 'ذكاء اصطناعي'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
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
