'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Building2, 
  CheckCircle2, 
  Compass
} from 'lucide-react';
import { MOCK_WORKSHOPS } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { bookWorkshopSeat, fetchWorkshops } from '@/lib/d1';
import { OfflineWorkshop, WorkshopTicket } from '@/lib/types';
import WorkshopTicketModal from '@/components/WorkshopTicketModal';

export default function WorkshopsPage() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState<OfflineWorkshop[]>(MOCK_WORKSHOPS);
  const [selectedTicket, setSelectedTicket] = useState<WorkshopTicket | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchWorkshops().then(setWorkshops).catch(() => {});
  }, []);

  const handleBook = async (ws: OfflineWorkshop) => {
    if (!user) {
      alert('يرجى تسجيل الدخول أو اختيار حساب تجريبي لحجز مقعدك.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const ticket = await bookWorkshopSeat(ws.id, user);
      if (ticket) {
        setSelectedTicket(ticket);
        // update local seats
        setWorkshops((prev) =>
          prev.map((item) =>
            item.id === ws.id ? { ...item, bookedSeats: item.bookedSeats + 1 } : item
          )
        );
      }
    } catch (err: unknown) {
      const error = err as Error;
      setBookingError(error?.message || 'حدث خطأ أثناء حجز التذكرة.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Compass className="w-4 h-4 text-emerald-500" />
          <span>المقر التدريبي الميداني: حاضنة بوصلة الجيل التقني</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          الورش الهندسية الواقعية والتطبيق الميداني
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          فرصتك لتجربة واختبار العتاد، شبكات الحوسبة، والروبوتات داخل مختبرات الحاضنة بطرابلس مع نخبة من المهندسين المعتمدين، واحصل على تذكرة حضور رقمية مزودة بـ QR Code.
        </p>
      </div>

      {bookingError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs text-center max-w-lg mx-auto">
          {bookingError}
        </div>
      )}

      {/* Workshops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {workshops.map((ws) => {
          const seatsLeft = ws.totalSeats - ws.bookedSeats;
          const isSoldOut = seatsLeft <= 0;

          return (
            <div
              key={ws.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ws.imageUrl} alt={ws.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{new Date(ws.dateTime).toLocaleDateString('ar-LY')}</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {ws.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {ws.description}
                  </p>

                  {/* Topics Pills */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-slate-400 block">المحاور العملية:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {ws.topics.map((t, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Location & Instructor */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{ws.venueName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>إشراف المدرب: <strong>{ws.instructorName}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">المقاعد المتبقية:</span>
                  <span className={`text-xs font-bold ${isSoldOut ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {isSoldOut ? 'اكتملت المقاعد' : `${seatsLeft} من ${ws.totalSeats} مقعد`}
                  </span>
                </div>

                <button
                  onClick={() => handleBook(ws)}
                  disabled={isSoldOut || bookingLoading}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                >
                  حجز التذكرة فوراً
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Incubator Headquarters Map & Directions Banner */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-right">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <Building2 className="w-4 h-4" />
            <span>المقر الدائم للملتقيات والورش</span>
          </div>
          <h3 className="text-xl font-black text-white">
            حاضنة ومختبرات «بوصلة الجيل التقني»
          </h3>
          <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
            العنوان: طرابلس، شارع النصر، مبنى التكنولوجيا والابتكار الرقمي، الطابق الثالث. 
            القاعات مجهزة بأحدث محطات الفحص الإلكتروني وشاشات العرض الذكية ومعدات الشبكات.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-xs space-y-2 text-right flex-shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>الدخول عبر مسح تذكرة الـ QR فقط</span>
          </div>
          <p className="text-[11px] text-slate-300">يتم إرسال تذكير وإحداثيات الموقع فور الحجز</p>
        </div>
      </div>

      {/* Active Ticket Modal */}
      {selectedTicket && (
        <WorkshopTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
