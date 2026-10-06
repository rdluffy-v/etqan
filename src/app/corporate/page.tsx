'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  Briefcase, 
  Plus, 
  ExternalLink, 
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Award,
  MapPin,
  Video,
  Check,
  Sparkles,
  X,
  Send,
  UserCheck,
  Filter
} from 'lucide-react';
import { MOCK_BOUNTIES } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { fetchBounties } from '@/lib/d1';
import { CorporateBounty, TrackType } from '@/lib/types';

// Interface for candidates
interface Candidate {
  id: string;
  name: string;
  university: string;
  track: string;
  trackName: string;
  cqsScore: number;
  points: number;
  badgesCount: number;
  avatar: string;
  email: string;
  skills: string[];
}

// Interface for scheduled interviews
interface ScheduledInterview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  candidateTrack: string;
  positionTitle: string;
  date: string;
  time: string;
  mode: 'in_person' | 'remote';
  locationOrLink: string;
  status: 'scheduled' | 'in_progress' | 'offered' | 'hired';
  notes: string;
}

export default function CorporatePage() {
  const { user, switchRole } = useAuth();
  const [bounties, setBounties] = useState<CorporateBounty[]>(MOCK_BOUNTIES);
  const [talentSearch, setTalentSearch] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [minCqsFilter, setMinCqsFilter] = useState<number>(0);

  // Active Tab: 'talent' | 'bounties' | 'pipeline' | 'partnerships'
  const [activeTab, setActiveTab] = useState<'talent' | 'bounties' | 'pipeline' | 'partnerships'>('talent');

  useEffect(() => {
    fetchBounties().then(setBounties).catch(() => {});
  }, []);

  // New Bounty Modal State
  const [showAddBounty, setShowAddBounty] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTrack, setNewTrack] = useState<TrackType>('programming');
  const [newReward, setNewReward] = useState('3,500 د.ل + مقابلة توظيف');
  const [newDesc, setNewDesc] = useState('');

  // Interview Modal State
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState<Candidate | null>(null);
  const [interviewPosition, setInterviewPosition] = useState('');
  const [interviewDate, setInterviewDate] = useState('2026-10-15');
  const [interviewTime, setInterviewTime] = useState('11:00');
  const [interviewMode, setInterviewMode] = useState<'in_person' | 'remote'>('in_person');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Partnership MoU Modal State
  const [showMouModal, setShowMouModal] = useState(false);
  const [mouTier, setMouTier] = useState('الشريك الذهبي');

  const isCorporate = user?.role === 'corporate';

  // Sample verified candidates pool
  const candidates = [
    {
      id: 'usr_academic_02',
      name: 'فاطمة الدربالي',
      university: 'جامعة طرابلس - تقنية المعلومات',
      track: 'programming',
      trackName: 'البرمجة وهندسة النظم',
      cqsScore: 9.8,
      points: 2940,
      badgesCount: 12,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      email: 'fatima.derbali@uot.edu.ly',
      skills: ['Next.js 15', 'Cloudflare D1', 'HLS Security', 'TypeScript'],
    },
    {
      id: 'usr_cand_02',
      name: 'صهيب المقريف',
      university: 'جامعة بنغازي - الهندسة الكهربائية',
      track: 'hardware',
      trackName: 'صيانة العتاد والميكروسولديرنج',
      cqsScore: 9.7,
      points: 2710,
      badgesCount: 10,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      email: 's.m@uot.edu.ly',
      skills: ['SMD Soldering', 'BGA Rework', 'Oscilloscope', 'Circuit Schematics'],
    },
    {
      id: 'usr_cand_03',
      name: 'ياسمين الورفلي',
      university: 'الجامعة الليبية الدولية - أمن المعلومات',
      track: 'security',
      trackName: 'الأمن السيبراني والتحقيق الجنائي',
      cqsScore: 9.9,
      points: 1680,
      badgesCount: 7,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      email: 'yasmin.w@example.com',
      skills: ['Penetration Testing', 'API Security', 'Forensics', 'Network Defense'],
    },
    {
      id: 'usr_cand_04',
      name: 'طارق الزنتاني',
      university: 'جامعة مصراتة - كلية الهندسة',
      track: 'ai_robotics',
      trackName: 'الذكاء الاصطناعي والروبوتات',
      cqsScore: 9.6,
      points: 2150,
      badgesCount: 9,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      email: 'tariq.z@misurata.edu.ly',
      skills: ['Computer Vision', 'PyTorch', 'ROS2', 'Embedded Linux'],
    },
  ];

  // Pipeline Interviews State
  const [interviews, setInterviews] = useState<ScheduledInterview[]>([
    {
      id: 'inv_101',
      candidateId: 'usr_academic_02',
      candidateName: 'فاطمة الدربالي',
      candidateAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
      candidateTrack: 'البرمجة وهندسة النظم',
      positionTitle: 'مهندسة برمجيات سحابية وتطبيقات Next.js',
      date: '2026-10-18',
      time: '10:30 ص',
      mode: 'in_person',
      locationOrLink: 'مقر حاضنة بوصلة الجيل التقني - قاعة الاجتماعات A',
      status: 'scheduled',
      notes: 'تم ترشيحها بعد تفوقها في تحدي معمارية النظم الموزعة بمعيار CQS 9.8.',
    },
  ]);

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(talentSearch.toLowerCase()) || 
                          c.university.toLowerCase().includes(talentSearch.toLowerCase()) ||
                          c.skills.some((s) => s.toLowerCase().includes(talentSearch.toLowerCase()));
    const matchesTrack = selectedTrack === 'all' || c.track === selectedTrack;
    const matchesCqs = c.cqsScore >= minCqsFilter;
    return matchesSearch && matchesTrack && matchesCqs;
  });

  const handleCreateBounty = (e: React.FormEvent) => {
    e.preventDefault();
    const newB: CorporateBounty = {
      id: `bounty_${Date.now()}`,
      companyName: user?.fullName || 'شركة شريكة',
      companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=150',
      title: newTitle,
      track: newTrack,
      rewardAmount: newReward,
      deadline: '2026-12-01T00:00:00Z',
      description: newDesc,
      requirements: ['تسليم نموذج أولي', 'كود نظيف مع توثيق تقني'],
      applicantsCount: 0,
      isActive: true,
    };

    setBounties([newB, ...bounties]);
    fetch('/api/bounties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bounty: newB }),
    }).catch(() => {});
    setShowAddBounty(false);
    setNewTitle('');
    setNewDesc('');
    showToast('تم طرح التحدي بنجاح وإدراجه في منصة إتقان ومجتمع التحديات!');
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidateForInterview) return;

    const newInv: ScheduledInterview = {
      id: `inv_${Date.now()}`,
      candidateId: selectedCandidateForInterview.id,
      candidateName: selectedCandidateForInterview.name,
      candidateAvatar: selectedCandidateForInterview.avatar,
      candidateTrack: selectedCandidateForInterview.trackName,
      positionTitle: interviewPosition || 'مهندس تخصصي',
      date: interviewDate,
      time: interviewTime,
      mode: interviewMode,
      locationOrLink: interviewMode === 'in_person' 
        ? 'مقر حاضنة بوصلة الجيل التقني - شارع النصر، طرابلس' 
        : 'رابط فيديو مشفر (سيرسل للبريد الجامعي)',
      status: 'scheduled',
      notes: interviewNotes || 'طلب مقابلة مباشر من بوابة الشركات.',
    };

    setInterviews([newInv, ...interviews]);
    setSelectedCandidateForInterview(null);
    setInterviewPosition('');
    setInterviewNotes('');
    showToast(`تم إرسال دعوة المقابلة إلى ${selectedCandidateForInterview.name} بنجاح!`);
    setActiveTab('pipeline');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-slate-900 border border-emerald-500 text-white shadow-2xl flex items-center gap-3 modal-enter">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white mr-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
            <Building2 className="w-4 h-4" />
            <span>بوابة الشركات والقطاع الخاص (B2B Talent Engine)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            استقطاب الكفاءات التقنية الموثقة وإدارة التحديات
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            ابحث في بنك المواهب المعتمد من حاضنة «بوصلة الجيل التقني»، واطرح تحديات واقعية للتوظيف المباشر وجدول المقابلات فورياً.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isCorporate && (
            <button
              onClick={() => switchRole('corporate')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors btn-press"
            >
              التبديل لدور الشركات
            </button>
          )}
          <button
            onClick={() => setShowAddBounty(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all btn-press"
          >
            <Plus className="w-4 h-4" />
            <span>طرح باونتي / تحدي توظيف</span>
          </button>
        </div>
      </div>

      {/* Interactive Tabs Navigation (Emil Kowalski Physics) */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('talent')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all btn-press whitespace-nowrap ${
            activeTab === 'talent'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>بنك الكفاءات الموثقة</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'talent' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {candidates.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bounties')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all btn-press whitespace-nowrap ${
            activeTab === 'bounties'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>تحديات الباونتي ورعاية المشروعات</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'bounties' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {bounties.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all btn-press whitespace-nowrap ${
            activeTab === 'pipeline'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>سجل ومتابعة المقابلات</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'pipeline' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
            {interviews.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('partnerships')}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all btn-press whitespace-nowrap ${
            activeTab === 'partnerships'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>حزم شراكة الحاضنة B2B</span>
          <span className="text-[10px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded font-bold">
            رسمية
          </span>
        </button>
      </div>

      {/* Tab 1: Verified Talent Search Engine */}
      {activeTab === 'talent' && (
        <section className="space-y-6 modal-enter">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <span>فرز وتصفية بنك الكفاءات الموثقة (Verified Talent)</span>
              </h2>
              <span className="text-xs text-slate-500">
                جميع المتدربين خضعوا لاختبارات CQS وتدريبات عملية بحاضنة بوصلة الجيل التقني بطرابلس
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={talentSearch}
                  onChange={(e) => setTalentSearch(e.target.value)}
                  placeholder="ابحث بالاسم، الجامعة، أو المهارة..."
                  className="pr-9 pl-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-emerald-500 w-64"
                />
              </div>

              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="all">كافة التخصصات التقنية</option>
                <option value="programming">البرمجة وهندسة النظم</option>
                <option value="hardware">العتاد والصيانة الدقيقة</option>
                <option value="security">الأمن السيبراني</option>
                <option value="ai_robotics">الذكاء الاصطناعي</option>
              </select>

              <select
                value={minCqsFilter}
                onChange={(e) => setMinCqsFilter(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
              >
                <option value="0">كافة درجات CQS</option>
                <option value="9.5">درجة CQS 9.5 فما فوق</option>
                <option value="9.8">المتفوقون CQS 9.8+</option>
              </select>
            </div>
          </div>

          {/* Talent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between card-tactile"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cand.avatar}
                      alt={cand.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {cand.name}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="text-[11px] text-slate-500 block">{cand.university}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                        {cand.trackName}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">درجة CQS المعتمدة</span>
                      <strong className="text-emerald-500 font-mono text-sm">{cand.cqsScore} / 10</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">الأوسمة المنجزة</span>
                      <strong className="text-amber-500 font-mono text-sm">{cand.badgesCount} وسام</strong>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">المهارات المعتمدة عملياً:</span>
                    <div className="flex flex-wrap gap-1">
                      {cand.skills.map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <Link
                    href={`/passport/${cand.id}`}
                    className="flex-1 text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1 btn-press"
                  >
                    <span>جواز المهارات</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedCandidateForInterview(cand);
                      setInterviewPosition(`مهندس ${cand.trackName}`);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 btn-press flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>طلب مقابلة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCandidates.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Filter className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">لم يتم العثور على كفاءات مطابقة لمعايير البحث</p>
              <button
                onClick={() => { setTalentSearch(''); setSelectedTrack('all'); setMinCqsFilter(0); }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold btn-press"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Sponsored Bounties & Challenges Manager */}
      {activeTab === 'bounties' && (
        <section className="space-y-6 modal-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-500" />
                <span>تحديات الباونتي ورعاية المشروعات (Sponsored Bounties)</span>
              </h2>
              <span className="text-xs text-slate-500">
                تحديات مهنية مطروحة من كبرى المؤسسات لاختبار الكفاءات في مشكلات واقعية مع مكافآت مباشرة
              </span>
            </div>

            <button
              onClick={() => setShowAddBounty(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all btn-press flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>طرح باونتي جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bounties.map((b) => (
              <div
                key={b.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between card-tactile"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={b.companyLogo} alt={b.companyName} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.companyName}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      نشط
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {b.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {b.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
                    <span className="text-[10px] text-slate-400 block">المكافأة المخصصة:</span>
                    <strong className="text-amber-600 dark:text-amber-400 font-bold block mt-0.5">
                      {b.rewardAmount}
                    </strong>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{b.applicantsCount} حلول مقدمة</span>
                  <Link
                    href="/community"
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold btn-press"
                  >
                    عرض في المجتمع
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 3: Hiring Pipeline & Scheduled Interviews */}
      {activeTab === 'pipeline' && (
        <section className="space-y-6 modal-enter">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <span>سجل المقابلات ومتابعة التوظيف (Hiring Pipeline)</span>
              </h2>
              <span className="text-xs text-slate-500">
                متابعة المقابلات المجدولة بمقر الحاضنة أو عن بعد، وتقييم المرشحين
              </span>
            </div>

            <button
              onClick={() => setActiveTab('talent')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 btn-press flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-emerald-500" />
              <span>استكشاف كفاءات جديدة</span>
            </button>
          </div>

          <div className="space-y-4">
            {interviews.map((inv) => (
              <div
                key={inv.id}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 card-tactile"
              >
                <div className="flex items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={inv.candidateAvatar}
                    alt={inv.candidateName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {inv.candidateName}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {inv.candidateTrack}
                      </span>
                    </div>

                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                      الوظيفة المستهدفة: {inv.positionTitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {inv.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {inv.time}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        {inv.mode === 'in_person' ? (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-amber-500" />
                            {inv.locationOrLink}
                          </>
                        ) : (
                          <>
                            <Video className="w-3.5 h-3.5 text-sky-500" />
                            {inv.locationOrLink}
                          </>
                        )}
                      </span>
                    </div>

                    {inv.notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 mt-2">
                        {inv.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>مجدولة للمقابلة</span>
                  </span>
                  <Link
                    href={`/passport/${inv.candidateId}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 btn-press"
                  >
                    الجواز المعتمد
                  </Link>
                </div>
              </div>
            ))}

            {interviews.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300">لا توجد مقابلات مجدولة حالياً</p>
                <p className="text-xs text-slate-500">اختر أحد المتدربين من بنك الكفاءات لإرسال دعوة مقابلة فورية.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tab 4: Incubator Strategic Partnership Tiers */}
      {activeTab === 'partnerships' && (
        <section className="space-y-8 modal-enter">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>رعاية وبناء الكفاءات الوطنية</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              برامج الشراكة الرسمية مع حاضنة «بوصلة الجيل التقني»
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              انضم كشريك مؤسسي استراتيجي لاستقطاب نخبة الخريجين الليبيين ورعاية المسارات الحيوية.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tech Partner */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between card-tactile">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">المستوى الأساسي</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">الشريك التقني (Tech Partner)</h3>
                <div className="text-2xl font-black text-slate-900 dark:text-white">انضمام مجاني</div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" /> تصفح بنك الكفاءات الموثقة والبحث الذكي
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" /> جدولة مقابلات مباشرة مع أصحاب الجوازات الرقمية
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" /> طرح مسابقة باونتي واحدة فصلياً
                  </li>
                </ul>
              </div>

              <button
                onClick={() => { setMouTier('الشريك التقني'); setShowMouModal(true); }}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-800 dark:text-slate-200 btn-press"
              >
                تفعيل الحساب التقني
              </button>
            </div>

            {/* Gold Strategic Partner */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-950/30 via-slate-900 to-slate-950 border-2 border-emerald-500 space-y-6 flex flex-col justify-between relative shadow-xl shadow-emerald-500/10 card-tactile">
              <div className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                الأكثر طلباً للشركات
              </div>
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">شريك استراتيجي</span>
                <h3 className="text-xl font-bold text-white">الشريك الذهبي المعتمد</h3>
                <div className="text-2xl font-black text-white">رعاية وتوظيف</div>
                <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> أولوية وصول مبكر لكافة خريجي الورش الميدانية
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> تنظيم يوم توظيف مخصص (Recruitment Day) بمقر الحاضنة
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> إدراج شعار الشركة في الشهادات الرقمية المعتمدة
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> طرح غير محدود لتحديات الباونتي والتوظيف
                  </li>
                </ul>
              </div>

              <button
                onClick={() => { setMouTier('الشريك الذهبي المعتمد'); setShowMouModal(true); }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 btn-press"
              >
                طلب عقد اتفاقية رعاية
              </button>
            </div>

            {/* Platinum Exclusive */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col justify-between card-tactile">
              <div className="space-y-4">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block">رعاية وطنية شاملة</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">الشريك البلاتيني الحصري</h3>
                <div className="text-2xl font-black text-slate-900 dark:text-white">شراكة وطنية</div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500" /> رعاية وتسمية مسار تدريبي تقني كامل بالاسم
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500" /> تخصيص وتجهيز مختبر تدريب ميداني بحاضنة بوصلة الجيل التقني
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500" /> استقطاب حصري لأعلى 5% في معيار الجودة CQS
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-blue-500" /> توقيع مذكرة تفاهم رسمية وتغطية إعلامية موسعة
                  </li>
                </ul>
              </div>

              <button
                onClick={() => { setMouTier('الشريك البلاتيني الحصري'); setShowMouModal(true); }}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white btn-press"
              >
                توقيع مذكرة تفاهم (MoU)
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Interview Scheduling Modal */}
      {selectedCandidateForInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 space-y-6 shadow-2xl modal-enter">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">جدولة مقابلة وتوظيف مباشر</h3>
              </div>
              <button
                onClick={() => setSelectedCandidateForInterview(null)}
                className="text-slate-400 hover:text-white p-1 btn-press"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Card Summary */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedCandidateForInterview.avatar}
                alt={selectedCandidateForInterview.name}
                className="w-12 h-12 rounded-xl object-cover border border-emerald-500"
              />
              <div>
                <h4 className="text-sm font-bold text-white">{selectedCandidateForInterview.name}</h4>
                <span className="text-[11px] text-slate-400">{selectedCandidateForInterview.university}</span>
                <span className="text-[10px] text-emerald-400 font-bold block">
                  معيار CQS: {selectedCandidateForInterview.cqsScore} / 10
                </span>
              </div>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">المسمى الوظيفي المستهدف:</label>
                <input
                  type="text"
                  required
                  value={interviewPosition}
                  onChange={(e) => setInterviewPosition(e.target.value)}
                  placeholder="مثال: مطور برمجيات Full-Stack أو أخصائي أمن سيبراني"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">التاريخ المفضل:</label>
                  <input
                    type="date"
                    required
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الوقت:</label>
                  <input
                    type="time"
                    required
                    value={interviewTime}
                    onChange={(e) => setInterviewTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">طبيعة المقابلة:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInterviewMode('in_person')}
                    className={`p-3 rounded-xl border text-right text-xs font-bold transition-all btn-press ${
                      interviewMode === 'in_person'
                        ? 'border-emerald-500 bg-emerald-500/20 text-white'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-emerald-400 mb-1" />
                    <span>حضوري بمقر الحاضنة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInterviewMode('remote')}
                    className={`p-3 rounded-xl border text-right text-xs font-bold transition-all btn-press ${
                      interviewMode === 'remote'
                        ? 'border-emerald-500 bg-emerald-500/20 text-white'
                        : 'border-slate-700 text-slate-400'
                    }`}
                  >
                    <Video className="w-4 h-4 text-sky-400 mb-1" />
                    <span>عن بعد (فيديو مشفر)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">رسالة وتفاصيل للمترشح:</label>
                <textarea
                  rows={2}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="ملاحظات إضافية حول التحدي أو الأسئلة التقنية..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all btn-press"
              >
                تأكيد وإرسال دعوة المقابلة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Bounty Modal */}
      {showAddBounty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 space-y-6 shadow-2xl modal-enter">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <span>طرح باونتي أو مسابقة جديدة للشركات</span>
              </h3>
              <button onClick={() => setShowAddBounty(false)} className="text-slate-400 hover:text-white text-xs btn-press">
                إغلاق ✕
              </button>
            </div>

            <form onSubmit={handleCreateBounty} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">عنوان التحدي:</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: بناء نظام تحكم حراري للوحات الصناعية"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المسار:</label>
                  <select
                    value={newTrack}
                    onChange={(e) => setNewTrack(e.target.value as TrackType)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm"
                  >
                    <option value="programming">البرمجة وهندسة الأنظمة</option>
                    <option value="hardware">العتاد والصيانة الدقيقة</option>
                    <option value="security">الأمن السيبراني</option>
                    <option value="ai_robotics">الذكاء الاصطناعي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">المكافأة أو الحافز:</label>
                  <input
                    type="text"
                    required
                    value={newReward}
                    onChange={(e) => setNewReward(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">تفاصيل ومتطلبات التحدي:</label>
                <textarea
                  rows={3}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="اشرح المشكلة التقنية والمخرجات المتوقعة من المتدرب..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all btn-press"
              >
                نشر الباونتي في المنصة
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MoU Modal */}
      {showMouModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 space-y-6 shadow-2xl modal-enter text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">طلب توقيع مذكرة تفاهم (MoU)</h3>
              <p className="text-xs text-slate-400">
                لقد اخترت الانضمام إلى برنامج <strong>{mouTier}</strong> بإشراف حاضنة «بوصلة الجيل التقني».
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 text-right text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">الجهة المشرفة:</span>
                <span className="font-semibold text-white">حاضنة بوصلة الجيل التقني - طرابلس</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">الشركة المتقدمة:</span>
                <span className="font-semibold text-white">{user?.fullName || 'شركة شريكة'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">الحالة:</span>
                <span className="font-bold text-emerald-400">جاهز للتوقيع والتفعيل</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowMouModal(false);
                  showToast('تم تسجيل طلب الشراكة بنجاح! سيتواصل فريق الحاضنة معكم خلال 24 ساعة.');
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold btn-press shadow-lg shadow-emerald-600/30"
              >
                تأكيد إرسال الطلب
              </button>
              <button
                onClick={() => setShowMouModal(false)}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 btn-press"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
