'use client';

import React, { useState } from 'react';
import { QuizQuestion } from '@/lib/types';
import { HelpCircle, CheckCircle2, XCircle, ArrowLeft, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  questions: QuizQuestion[];
  onPassed: () => void;
  onClose?: () => void;
}

export default function QuizModal({ questions, onPassed, onClose }: QuizModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = questions[currentIndex];
  const isSelected = selectedAnswers[currentIndex] !== undefined;
  const isCorrect = selectedAnswers[currentIndex] === currentQ?.correctAnswer;

  const handleSelectOption = (idx: number) => {
    if (showFeedback) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: idx });
  };

  const handleConfirmAnswer = () => {
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      questions.forEach((q, i) => {
        if (selectedAnswers[i] === q.correctAnswer) correctCount++;
      });

      const passRate = correctCount / questions.length;
      if (passRate >= 0.5) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
        onPassed();
      }
      setQuizFinished(true);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowFeedback(false);
    setQuizFinished(false);
    setCurrentIndex(0);
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">اختبار الفهم السريع (Concept Quiz)</h3>
            <span className="text-xs text-slate-500">حلقة التعلم المصغر: قياس استيعاب الدرس فورياً</span>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          السؤال {currentIndex + 1} من {questions.length}
        </span>
      </div>

      {!quizFinished ? (
        <div className="mt-5 space-y-4">
          <p className="text-sm md:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
            {currentQ.question}
          </p>

          <div className="space-y-2 pt-2">
            {currentQ.options.map((option, idx) => {
              const selected = selectedAnswers[currentIndex] === idx;
              let btnClass = 'border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-800/40';

              if (showFeedback) {
                if (idx === currentQ.correctAnswer) {
                  btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold';
                } else if (selected && idx !== currentQ.correctAnswer) {
                  btnClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300';
                }
              } else if (selected) {
                btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={showFeedback}
                  className={`w-full text-right p-3.5 rounded-xl border text-xs md:text-sm flex items-center justify-between transition-all ${btnClass}`}
                >
                  <span className="flex-1">{option}</span>
                  {showFeedback && idx === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mr-2" />
                  )}
                  {showFeedback && selected && idx !== currentQ.correctAnswer && (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mr-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {showFeedback && (
            <div className={`p-4 rounded-xl text-xs md:text-sm border leading-relaxed animate-in fade-in duration-200 ${
              isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200' : 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200'
            }`}>
              <span className="font-bold block mb-1">
                {isCorrect ? '✓ إجابة صحيحة ومتقنة!' : 'توضيح المفاهيم: '}
              </span>
              {currentQ.explanation}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            {!showFeedback ? (
              <button
                onClick={handleConfirmAnswer}
                disabled={!isSelected}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs md:text-sm font-semibold transition-colors"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs md:text-sm font-semibold transition-colors"
              >
                <span>{currentIndex + 1 === questions.length ? 'إنهاء الاختبار' : 'السؤال التالي'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
            اكتمل اختبار الفهم بنجاح!
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            تم تسجيل استيعابك للمفاهيم الأساسية، يمكنك الآن المتابعة إلى بيئة التطبيق العملي.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RotateCcw className="w-3.5 h-3.5" /> إعادة الاختبار
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                التطبيق العملي في المحرر
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
