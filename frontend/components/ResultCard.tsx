"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { PredictionResponse } from "@/lib/api";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function CountUp({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf: number;
    const t0 = performance.now();
    const duration = 1400;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className={className}>{display.toFixed(1)}%</span>;
}

export default function ResultCard({
  result,
  onReset,
}: {
  result: PredictionResponse;
  onReset: () => void;
}) {
  const high = result.default_prediction === 1;
  const prob = Math.min(Math.max(result.default_probability, 0), 1);
  const threshold = Math.min(Math.max(result.threshold, 0), 1);

  const R = 84;
  const C = 2 * Math.PI * R;
  const arcClass = high
    ? "stroke-rose-600 dark:stroke-rose-400"
    : "stroke-emerald-600 dark:stroke-emerald-400";
  const accentText = high
    ? "text-rose-600 dark:text-rose-400"
    : "text-emerald-600 dark:text-emerald-400";
  const badgeClass = high
    ? "border-rose-200 bg-rose-50/60 text-rose-600 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-400"
    : "border-emerald-200 bg-emerald-50/60 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.99 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6 dark:border-stone-800 dark:bg-stone-900 dark:shadow-none"
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl text-stone-900 dark:text-stone-100">
          Assessment result
        </h3>
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] ${badgeClass}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              high ? "bg-rose-500 dark:bg-rose-400" : "bg-emerald-500 dark:bg-emerald-400"
            }`}
          />
          {result.Result}
        </motion.span>
      </div>

      <div className="relative mx-auto mt-5 h-40 w-40 sm:h-48 sm:w-48">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={R}
            strokeWidth="10"
            className="fill-none stroke-stone-100 dark:stroke-stone-800"
          />
          <motion.circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={C}
            className={arcClass}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C * (1 - prob) }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.15 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <CountUp
            value={prob * 100}
            className={`font-display text-4xl whitespace-nowrap tabular-nums ${accentText}`}
          />
          <span className="mt-1.5 whitespace-nowrap font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-stone-400 dark:text-stone-500">
            default probability
          </span>
        </div>
      </div>

      <div className="mt-5">
        <div className="relative h-2 rounded-full bg-stone-100 dark:bg-stone-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${prob * 100}%` }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
            className="absolute inset-y-0 left-0 rounded-full bg-stone-800 dark:bg-stone-200"
          />
          <div
            className="absolute -top-1.5 h-5 w-[3px] -translate-x-1/2 rounded-full bg-stone-400 ring-2 ring-white dark:bg-stone-500 dark:ring-stone-900"
            style={{ left: `${threshold * 100}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] font-medium tracking-wide text-stone-400 dark:text-stone-500">
          <span>P 0.0</span>
          <span className="text-stone-500 dark:text-stone-300">
            threshold {threshold.toFixed(2)}
          </span>
          <span>1.0</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 divide-x divide-stone-200 overflow-hidden rounded-xl border border-stone-200 dark:divide-stone-800 dark:border-stone-800">
        <div className="px-4 py-3">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">
            Threshold
          </p>
          <p className="mt-1 font-mono text-base font-medium tabular-nums text-stone-800 dark:text-stone-200">
            {threshold.toFixed(3)}
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">
            Outcome
          </p>
          <p
            className={`mt-1 font-mono text-base font-medium tabular-nums ${accentText}`}
          >
            {high ? "DEFAULT (1)" : "REPAID (0)"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-stone-400 dark:text-stone-500">
        An application is flagged high-risk when P(default) meets or exceeds
        the decision threshold tuned during training.
      </p>

      <button
        onClick={onReset}
        className="mt-5 w-full rounded-xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-500 transition-colors duration-150 hover:border-stone-300 hover:bg-stone-50 hover:text-stone-800 dark:border-stone-800 dark:text-stone-400 dark:hover:border-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-100"
      >
        Evaluate another application
      </button>
    </motion.div>
  );
}
