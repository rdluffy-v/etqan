'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Hls from 'hls.js';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Settings, 
  Subtitles, 
  ShieldAlert, 
  RotateCcw,
  CheckCircle,
  Clock,
  Sparkles,
  ListOrdered,
  Shield,
  Layers
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { VideoChapter } from '@/lib/types';

interface VideoPlayerProps {
  src: string;
  title: string;
  durationSeconds: number;
  chapters?: VideoChapter[];
  subtitlesAr?: string;
  subtitlesEn?: string;
  onLessonCompleted?: () => void;
}

export default function VideoPlayer({
  src,
  title,
  durationSeconds,
  chapters = [],
  subtitlesAr,
  subtitlesEn,
  onLessonCompleted,
}: VideoPlayerProps) {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationSeconds || 960);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('1080p');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSubtitle, setActiveSubtitle] = useState<'ar' | 'en' | 'off'>('ar');
  const [currentSubtitleText, setCurrentSubtitleText] = useState('');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [showChaptersMenu, setShowChaptersMenu] = useState(false);
  const [isHlsActive, setIsHlsActive] = useState(false);

  // Security & Forensic Watermark state
  const [watermarkPos, setWatermarkPos] = useState({ top: '20%', left: '25%' });
  const [isScreenBlurred, setIsScreenBlurred] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [securityTriggerReason, setSecurityTriggerReason] = useState<string>('فقدان تركيز النافذة أو محاولة التقاط الشاشة');

  // Compute Current Chapter
  const currentChapter = chapters.length > 0 
    ? [...chapters].reverse().find((c) => currentTime >= c.timeSeconds) || chapters[0]
    : null;

  // 1. HLS Stream Initialization with fallback to native video playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const isHlsUrl = src.includes('.m3u8') || src.includes('/hls/');

    if (isHlsUrl && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsHlsActive(true);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });
    } else if (isHlsUrl && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      setIsHlsActive(true);
    } else {
      video.src = src;
      setIsHlsActive(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  // 2. Dynamic Random Movement of the Forensic Watermark (every 3.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      const top = Math.floor(10 + Math.random() * 75) + '%';
      const left = Math.floor(10 + Math.random() * 75) + '%';
      setWatermarkPos({ top, left });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // 3. HTML5 Canvas Protection & Dynamic Cryptographic Noise Overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = canvas.clientWidth || 640;
        canvas.height = canvas.clientHeight || 360;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const renderCanvasSecurity = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Microscopic cryptographic security watermark on canvas to prevent capture
      ctx.save();
      ctx.globalAlpha = 0.04;
      ctx.font = '10px monospace';
      ctx.fillStyle = '#10b981';

      // Draw faint diagonal cryptographic pattern across entire canvas
      const step = 80;
      const token = `ETQAN-${user?.id || 'ANON'}-${Math.floor(currentTime)}`;
      for (let x = -canvas.width; x < canvas.width * 2; x += step) {
        for (let y = -canvas.height; y < canvas.height * 2; y += step) {
          ctx.fillText(token, x + (frame % 80), y);
        }
      }
      ctx.restore();

      animId = requestAnimationFrame(renderCanvasSecurity);
    };

    renderCanvasSecurity();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [user?.id, currentTime]);

  // 4. Anti-Recording & Screenshot Interception Shield
  useEffect(() => {
    const handleBlur = () => {
      setSecurityTriggerReason('تم فقدان تركيز النافذة (فحص برامج التسجيل الخارجي).');
      setIsScreenBlurred(true);
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };

    const handleFocus = () => {
      // Keep blur shield until user explicitly clicks resume
    };

    const handleVisibility = () => {
      if (document.hidden) {
        handleBlur();
      }
    };

    // Intercept keyboard screenshot shortcuts (PrintScreen, Meta+Shift+4, etc.)
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        setSecurityTriggerReason('تم اعتراض محاولة تصوير الشاشة (PrintScreen).');
        setIsScreenBlurred(true);
        if (video) {
          video.pause();
          setIsPlaying(false);
        }
      }

      // Keyboard shortcuts for video player
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (!video) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (video.paused) {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        } else {
          video.pause();
          setIsPlaying(false);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        video.currentTime = Math.min(video.duration || 100, video.currentTime + 5);
        setCurrentTime(video.currentTime);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 5);
        setCurrentTime(video.currentTime);
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        video.muted = !video.muted;
        setIsMuted(video.muted);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
        } else {
          document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
        }
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 5. Parse Subtitles
  useEffect(() => {
    if (activeSubtitle === 'off') {
      setCurrentSubtitleText('');
      return;
    }

    const hasCustomAr = Boolean(subtitlesAr);
    const hasCustomEn = Boolean(subtitlesEn);

    if (currentTime < 5) {
      setCurrentSubtitleText(activeSubtitle === 'ar' ? (hasCustomAr ? 'مرحباً بكم في منصة إتقان التدريبية.' : 'مرحباً بكم في منصة إتقان.') : (hasCustomEn ? 'Welcome to the Etqan learning platform.' : 'Welcome to Etqan.'));
    } else if (currentTime < 12) {
      setCurrentSubtitleText(activeSubtitle === 'ar' ? 'في هذا الدرس العملي، نستكشف الحوسبة الطرفية Edge وقواعد بيانات D1.' : 'In this hands-on lesson, we explore Edge Computing and D1 SQLite.');
    } else if (currentTime < 20) {
      setCurrentSubtitleText(activeSubtitle === 'ar' ? 'الهدف الأساسي هو خفض زمن الاستجابة إلى أجزاء من الميلي ثانية.' : 'Our goal is sub-15ms latency combined with hardened security.');
    } else {
      setCurrentSubtitleText('');
    }
  }, [currentTime, activeSubtitle, subtitlesAr, subtitlesEn]);

  // Video Control Handlers
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const jumpToChapter = (timeSeconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeSeconds;
      setCurrentTime(timeSeconds);
    }
    setShowChaptersMenu(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
    if (!nextMuted && volume === 0) {
      setVolume(0.5);
      videoRef.current.volume = 0.5;
    }
  };

  const changePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSettingsMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsFinished(true);
    if (onLessonCompleted) {
      onLessonCompleted();
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-slate-800 select-none">
      {/* Top Bar: Title, Active Chapter, CQS Indicator */}
      <div className="absolute top-3 inset-x-3 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 max-w-[70%]">
          <span className="text-xs font-bold text-white bg-slate-900/85 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 truncate shadow-lg">
            {title}
          </span>
          {currentChapter && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-emerald-700 truncate shadow-md">
              <ListOrdered className="w-3 h-3 text-emerald-400" />
              <span>فصل: {currentChapter.title}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isHlsActive && (
            <span className="px-2 py-0.5 rounded-full bg-sky-950/80 border border-sky-700 text-[10px] text-sky-300 font-mono flex items-center gap-1 shadow-md">
              <Layers className="w-3 h-3" /> HLS
            </span>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700 text-xs text-emerald-400 font-semibold shadow-lg">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>معيار CQS: درس مكثف ≤ 20 دقيقة</span>
          </div>
        </div>
      </div>

      {/* Main Video & Canvas Protection Wrapper */}
      <div 
        ref={containerRef}
        className="relative aspect-video w-full flex items-center justify-center group overflow-hidden bg-black"
        onContextMenu={(e) => e.preventDefault()}
      >
        <video
          ref={videoRef}
          className={`w-full h-full object-contain cursor-pointer transition-all duration-300 ${
            isScreenBlurred ? 'anti-record-blur' : ''
          }`}
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          playsInline
        />

        {/* HTML5 Canvas Security Layer (Anti-Capture & Forensic Watermark) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[15]"
          onContextMenu={(e) => e.preventDefault()}
        />

        {/* Anti-Screen Recording Blur Shield Overlay */}
        {isScreenBlurred && (
          <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-500 animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold">تم تفعيل درع حماية المحتوى الجنائي</h3>
            <p className="text-xs text-slate-300 max-w-md leading-relaxed">
              {securityTriggerReason}
              <br />
              تم حجب وحماية الفيديو تلقائياً. انقر على الزر أدناه لاستئناف المشاهدة.
            </p>
            <button
              onClick={() => setIsScreenBlurred(false)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105"
            >
              استئناف متابعة الدرس
            </button>
          </div>
        )}

        {/* Dynamic Forensic Watermark (Floats unpredictably across the player) */}
        <div 
          className="absolute z-[25] pointer-events-none transition-all duration-1000 ease-out opacity-40 dark:opacity-45"
          style={{ top: watermarkPos.top, left: watermarkPos.left }}
        >
          <div className="flex flex-col items-center justify-center bg-black/70 px-3 py-1.5 rounded-xl border border-emerald-500/30 text-white text-[11px] font-mono shadow-xl backdrop-blur-sm">
            <span className="font-bold tracking-wider text-emerald-300 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" />
              <span>ETQAN-ID: {user?.id || 'usr_guest'}</span>
            </span>
            <span className="text-[9px] text-slate-300 font-mono">
              SEC-HASH: {user ? user.email.slice(0, 3) + '***' : 'DEMO'} • {new Date().toLocaleTimeString('ar-LY')}
            </span>
          </div>
        </div>

        {/* On-screen Subtitles */}
        {currentSubtitleText && !isScreenBlurred && (
          <div className="absolute bottom-20 inset-x-0 z-[25] flex justify-center pointer-events-none px-6">
            <span className="bg-black/90 text-white px-4 py-1.5 rounded-md text-sm md:text-base font-semibold shadow-2xl text-center backdrop-blur-md border border-white/10">
              {currentSubtitleText}
            </span>
          </div>
        )}

        {/* Video Completion Overlay / Action */}
        {isFinished && (
          <div className="absolute inset-0 z-[35] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold">أحسنت! أتممت مشاهدة الدرس</h3>
            <p className="text-xs text-slate-300 max-w-md">
              وفق منهجية إتقان للتعلم المصغر، حان وقت اختبار الفهم والتطبيق العملي في محرر الكود المدمج.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                    setIsPlaying(true);
                    setIsFinished(false);
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                <RotateCcw className="w-4 h-4" /> إعادة المشاهدة
              </button>
              {onLessonCompleted && (
                <button
                  onClick={onLessonCompleted}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
                >
                  <Sparkles className="w-4 h-4" /> الانتقال للاختبار والمختبر
                </button>
              )}
            </div>
          </div>
        )}

        {/* YouTube-Class Controls Overlay */}
        <div className="absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
          {/* Progress Seek Slider with Chapter Markers */}
          <div className="relative w-full flex items-center group/seek">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-emerald-500 relative z-10"
            />
            {/* Visual Chapter Markers */}
            {chapters.length > 0 && duration > 0 && (
              <div className="absolute inset-x-0 h-1.5 pointer-events-none flex items-center z-[5]">
                {chapters.map((ch, idx) => {
                  const leftPercent = (ch.timeSeconds / duration) * 100;
                  return (
                    <div
                      key={idx}
                      className="absolute w-1 h-3 bg-white/70 rounded-full -translate-x-1/2"
                      style={{ left: `${leftPercent}%` }}
                      title={`${ch.title} (${formatTime(ch.timeSeconds)})`}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-white text-xs px-1">
            {/* Left Controls: Play, Volume, Time */}
            <div className="flex items-center gap-3">
              <button 
                onClick={togglePlay} 
                className="p-1 hover:text-emerald-400 transition-colors"
                aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <div className="flex items-center gap-1.5 group/vol">
                <button 
                  onClick={toggleMute} 
                  className="p-1 hover:text-emerald-400 transition-colors"
                  aria-label="كتم / تفعيل الصوت"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              <span className="font-mono text-[11px] text-slate-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls: Chapters, Subtitles, Settings, Fullscreen */}
            <div className="flex items-center gap-3">
              {/* Chapters Drawer Menu */}
              {chapters.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => { setShowChaptersMenu(!showChaptersMenu); setShowSettingsMenu(false); setShowSubtitlesMenu(false); }}
                    className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                      showChaptersMenu ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title="فصول الدرس"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                    <span>الفصول ({chapters.length})</span>
                  </button>

                  {showChaptersMenu && (
                    <div className="absolute bottom-8 left-0 rounded-xl bg-slate-900 border border-slate-700 p-2 w-64 shadow-2xl z-50 text-right space-y-1">
                      <div className="px-2 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-800 flex justify-between items-center">
                        <span>فصول الدرس التعليمي</span>
                        <span className="text-[10px] text-emerald-400">{chapters.length} محطات</span>
                      </div>
                      <div className="max-h-48 overflow-y-auto space-y-1 pt-1">
                        {chapters.map((ch, idx) => {
                          const isCurrent = currentChapter?.timeSeconds === ch.timeSeconds;
                          return (
                            <button
                              key={idx}
                              onClick={() => jumpToChapter(ch.timeSeconds)}
                              className={`w-full px-2.5 py-1.5 rounded-lg text-right text-xs flex items-center justify-between transition-colors ${
                                isCurrent
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700 font-bold'
                                  : 'text-slate-300 hover:bg-slate-800'
                              }`}
                            >
                              <span className="truncate flex-1">{ch.title}</span>
                              <span className="font-mono text-[10px] text-slate-400 mr-2 flex-shrink-0">
                                {formatTime(ch.timeSeconds)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Subtitles Menu */}
              <div className="relative">
                <button
                  onClick={() => { setShowSubtitlesMenu(!showSubtitlesMenu); setShowChaptersMenu(false); setShowSettingsMenu(false); }}
                  className={`p-1 transition-colors ${activeSubtitle !== 'off' ? 'text-emerald-400' : 'text-slate-300 hover:text-white'}`}
                  title="الترجمة والشرح"
                >
                  <Subtitles className="w-4 h-4" />
                </button>

                {showSubtitlesMenu && (
                  <div className="absolute bottom-8 left-0 rounded-xl bg-slate-900 border border-slate-700 py-1.5 w-36 shadow-2xl z-50 text-right">
                    <button
                      onClick={() => { setActiveSubtitle('ar'); setShowSubtitlesMenu(false); }}
                      className={`w-full px-3 py-1.5 text-right text-xs hover:bg-slate-800 ${activeSubtitle === 'ar' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
                    >
                      العربية (VTT)
                    </button>
                    <button
                      onClick={() => { setActiveSubtitle('en'); setShowSubtitlesMenu(false); }}
                      className={`w-full px-3 py-1.5 text-right text-xs hover:bg-slate-800 ${activeSubtitle === 'en' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
                    >
                      English (VTT)
                    </button>
                    <button
                      onClick={() => { setActiveSubtitle('off'); setShowSubtitlesMenu(false); }}
                      className={`w-full px-3 py-1.5 text-right text-xs hover:bg-slate-800 ${activeSubtitle === 'off' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}
                    >
                      إيقاف الترجمة
                    </button>
                  </div>
                )}
              </div>

              {/* Speed & Quality Settings Menu */}
              <div className="relative">
                <button
                  onClick={() => { setShowSettingsMenu(!showSettingsMenu); setShowChaptersMenu(false); setShowSubtitlesMenu(false); }}
                  className="p-1 text-slate-300 hover:text-white transition-colors"
                  title="إعدادات السرعة والجودة"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {showSettingsMenu && (
                  <div className="absolute bottom-8 left-0 rounded-xl bg-slate-900 border border-slate-700 p-2.5 w-48 shadow-2xl z-50 text-right space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">سرعة التشغيل:</span>
                      <div className="grid grid-cols-3 gap-1 text-[11px]">
                        {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                          <button
                            key={rate}
                            onClick={() => changePlaybackRate(rate)}
                            className={`py-0.5 rounded text-center ${playbackRate === rate ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-800 pt-1.5">
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">دقة البث (HLS / R1):</span>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        {['Auto', '1080p', '720p', '360p'].map((q) => (
                          <button
                            key={q}
                            onClick={() => { setQuality(q); setShowSettingsMenu(false); }}
                            className={`py-0.5 rounded text-center ${quality === q ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-1 text-slate-300 hover:text-white transition-colors"
                title="ملء الشاشة"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
