'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { WorkshopTicket } from '@/lib/types';
import { X, Calendar, MapPin, Download, CheckCircle, Ticket } from 'lucide-react';

interface WorkshopTicketModalProps {
  ticket: WorkshopTicket;
  onClose: () => void;
}

export default function WorkshopTicketModal({ ticket, onClose }: WorkshopTicketModalProps) {
  const downloadCalendarEvent = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Etqan Platform//Offline Workshop//AR
BEGIN:VEVENT
UID:${ticket.ticketCode}@etqan.ly
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${ticket.workshopTitle}
DESCRIPTION:تذكرة حضور ورشة عمل في حاضنة بوصلة الجيل التقني. رمز التذكرة: ${ticket.ticketCode}
LOCATION:${ticket.venueName}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `etqan-ticket-${ticket.ticketCode}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-emerald-500/40 text-white overflow-hidden shadow-2xl">
        {/* Ticket Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-white" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 block">
                تذكرة دخول ميدانية رسمية
              </span>
              <h3 className="text-base font-black text-white">
                حاضنة بوصلة الجيل التقني
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <span className="text-xs text-emerald-400 font-semibold">عنوان الورشة التدريبية:</span>
            <h4 className="text-base md:text-lg font-bold text-white leading-snug">
              {ticket.workshopTitle}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                الموعد:
              </span>
              <p className="font-semibold text-slate-200">
                {new Date(ticket.workshopDate).toLocaleDateString('ar-LY', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                المقر:
              </span>
              <p className="font-semibold text-slate-200 leading-tight">
                {ticket.venueName}
              </p>
            </div>
          </div>

          {/* QR Code and Attendee Details */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="space-y-2 text-right">
              <div>
                <span className="text-[11px] text-slate-400">اسم المتدرب:</span>
                <p className="text-sm font-bold text-white">{ticket.attendeeName}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">رمز التذكرة الفريد:</span>
                <p className="text-sm font-mono font-bold text-emerald-400 tracking-wider">
                  {ticket.ticketCode}
                </p>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium pt-1">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>المقعد مؤكد ومحجوز</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl shadow-lg flex flex-col items-center">
              <QRCodeSVG value={ticket.qrData} size={110} level="H" />
              <span className="text-[9px] font-bold text-slate-800 mt-1">مسح الدخول في البوابة</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={downloadCalendarEvent}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>إضافة إلى التقويم (.ics)</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-colors"
            >
              تم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
