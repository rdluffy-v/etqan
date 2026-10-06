'use client';

import React, { useState } from 'react';
import { SandboxEnvironment } from '@/lib/types';
import { Terminal, Play, RotateCcw, CheckCircle2, XCircle, Sparkles, Code2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SandboxEditorProps {
  sandbox: SandboxEnvironment;
  onSuccess?: () => void;
}

export default function SandboxEditor({ sandbox, onSuccess }: SandboxEditorProps) {
  const [code, setCode] = useState(sandbox.initialCode);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<{ description: string; passed: boolean; output: string }[] | null>(null);

  const handleRunCode = () => {
    setIsRunning(true);
    setConsoleOutput(['> جاري تنفيذ الكود في بيئة الحوسبة الطرفية...']);

    setTimeout(() => {
      const logs: string[] = [];

      const safeFormat = (val: unknown): string => {
        if (val === null) return 'null';
        if (val === undefined) return 'undefined';
        if (typeof val === 'object') {
          try {
            return JSON.stringify(val);
          } catch {
            return '[Object]';
          }
        }
        return String(val);
      };

      const customConsole = {
        log: (...args: unknown[]) => {
          logs.push(args.map(safeFormat).join(' '));
        },
        warn: (...args: unknown[]) => {
          logs.push('⚠️ ' + args.map(safeFormat).join(' '));
        },
        error: (...args: unknown[]) => {
          logs.push('❌ ' + args.map(safeFormat).join(' '));
        },
        info: (...args: unknown[]) => {
          logs.push('ℹ️ ' + args.map(safeFormat).join(' '));
        },
      };

      try {
        // Safe evaluation simulation for javascript
        const runFunction = new Function('console', code);
        runFunction(customConsole);

        if (logs.length === 0) {
          logs.push('✓ تم تنفيذ الكود بنجاح (بدون مخرجات console)');
        }
        setConsoleOutput(logs);
      } catch (err: unknown) {
        const error = err as Error;
        setConsoleOutput([`❌ خطأ أثناء التنفيذ: ${error?.message || 'SyntaxError'}`]);
      }

      setIsRunning(false);
    }, 400);
  };

  const handleRunTests = () => {
    setIsRunning(true);
    setConsoleOutput(['> جاري تقييم حالات الاختبار المعيارية في البيئة المعزولة...']);

    setTimeout(() => {
      const results: { description: string; passed: boolean; output: string }[] = [];
      let allPassed = true;

      const safeFormat = (val: unknown): string => {
        if (val === null) return 'null';
        if (val === undefined) return 'undefined';
        if (typeof val === 'object') {
          try {
            return JSON.stringify(val);
          } catch {
            return '[Object]';
          }
        }
        return String(val);
      };

      try {
        sandbox.testCases.forEach((tc) => {
          let isPassed = false;
          let actualOutputStr = '';

          try {
            if (tc.inputCode) {
              const testRunner = new Function(`
                ${code}
                try {
                  return (${tc.inputCode});
                } catch (e) {
                  return "ERROR: " + e.message;
                }
              `);
              const actual = testRunner();
              actualOutputStr = safeFormat(actual);
              isPassed = actualOutputStr.trim() === tc.expectedOutput.trim();
            } else {
              // General execution check
              const testRunner = new Function('console', code);
              testRunner({ log: () => {}, warn: () => {}, error: () => {}, info: () => {} });
              isPassed = true;
              actualOutputStr = tc.expectedOutput;
            }
          } catch (e: unknown) {
            const err = e as Error;
            actualOutputStr = `خطأ: ${err?.message || 'Execution error'}`;
            isPassed = false;
          }

          if (!isPassed) allPassed = false;

          results.push({
            description: tc.description,
            passed: isPassed,
            output: actualOutputStr,
          });
        });

        setTestResults(results);

        if (allPassed) {
          setConsoleOutput((prev) => [
            ...prev,
            '✓ اجتاز الكود كافة حالات الاختبار المعيارية بنجاح تام (100%)!'
          ]);
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore
          }
          if (onSuccess) onSuccess();
        } else {
          setConsoleOutput((prev) => [
            ...prev,
            '⚠️ فشلت بعض حالات الاختبار، راجع نتائج الفحص وصحح المنطق البرمجي.'
          ]);
        }
      } catch (err: unknown) {
        const error = err as Error;
        setConsoleOutput([`❌ تعذر إنهاء الاختبارات: ${error?.message}`]);
      }

      setIsRunning(false);
    }, 500);
  };

  const handleReset = () => {
    setCode(sandbox.initialCode);
    setConsoleOutput([]);
    setTestResults(null);
  };

  const handleApplySolution = () => {
    setCode(sandbox.solutionCode);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              مختبر الكود والتطبيق العملي (In-Browser Sandbox)
            </h3>
            <span className="text-[11px] text-slate-500">
              اللغة: JavaScript (Edge Environment)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplySolution}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 text-xs font-medium transition-colors"
          >
            عرض الكود النموذجي
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 transition-colors"
            title="إعادة تعيين الكود"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 text-white text-xs font-semibold transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>تشغيل الكود</span>
          </button>
          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>فحص الاختبارات</span>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 text-xs md:text-sm text-emerald-900 dark:text-emerald-200">
        <span className="font-bold ml-1">المهمة البرمجية:</span>
        {sandbox.instructions}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-200 dark:divide-slate-800">
        {/* Code Editor Area */}
        <div className="relative font-mono text-xs md:text-sm bg-slate-950 text-slate-100 p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            dir="ltr"
            className="w-full h-64 bg-transparent outline-none resize-none font-mono leading-relaxed"
            placeholder="// اكتب كودك هنا..."
            spellCheck={false}
          />
        </div>

        {/* Console & Test Results Area */}
        <div className="bg-slate-900 text-slate-200 p-4 flex flex-col justify-between min-h-[260px]">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>شاشة المخرجات (Console Terminal):</span>
            </div>

            {consoleOutput.length > 0 ? (
              <div className="font-mono text-xs space-y-1 text-slate-300" dir="ltr">
                {consoleOutput.map((line, idx) => (
                  <div key={idx} className="leading-relaxed">
                    {line}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                اضغط «تشغيل الكود» لرؤية النتائج أو «فحص الاختبارات» لاجتياز التحدي.
              </p>
            )}

            {/* Test Cases Results */}
            {testResults && (
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300">نتائج الفحص المعياري:</span>
                {testResults.map((tr, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                      tr.passed ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {tr.passed ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                      {tr.description}
                    </span>
                    <span className="font-mono text-[10px] opacity-80">المخرج: {tr.output}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
