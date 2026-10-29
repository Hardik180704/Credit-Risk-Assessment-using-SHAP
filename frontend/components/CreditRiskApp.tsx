"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import LoanForm from "./LoanForm";
import ResultCard from "./ResultCard";
import ThemeToggle from "./ThemeToggle";
import {
  predictLoan,
  type LoanApplicationPayload,
  type PredictionResponse,
} from "@/lib/api";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.99 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
  exit: { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.3, ease: EASE } },
};

type Status = "idle" | "loading" | "done" | "error";

const cardShell =
  "rounded-2xl border border-stone-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] dark:border-stone-800 dark:bg-stone-900 dark:shadow-none";

function BrandMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-5 w-5"
    >
      <path d="M4.5 16.5a8 8 0 0 1 15 0" />
      <g
        className="transition-transform duration-700 ease-out group-hover:-rotate-[24deg]"
        style={{ transformOrigin: "12px 16.5px" }}
      >
        <path d="M12 16.5 15 10" stroke="#34D399" />
        <circle
          cx="12"
          cy="16.5"
          r="1.8"
          className="fill-stone-900 stroke-none dark:fill-stone-100"
        />
      </g>
    </svg>
  );
}

function GhostGauge() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14 text-stone-300 dark:text-stone-700">
      <path
        d="M8 44a24 24 0 0 1 48 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M32 44 44 24"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="44" r="2.8" fill="currentColor" />
    </svg>
  );
}

function PlaceholderCard() {
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="show"
      exit="exit"
      className={`${cardShell} flex min-h-[20rem] flex-col items-center justify-center p-8 text-center`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-stone-200 dark:border-stone-700/80">
        <GhostGauge />
      </span>
      <p className="mt-4 font-display text-xl text-stone-800 dark:text-stone-200">
        No assessment yet
      </p>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-400 dark:text-stone-500">
        Complete the application form and press Evaluate risk — the model
        returns P(default), the tuned decision threshold and a high / low-risk
        verdict.
      </p>
    </motion.div>
  );
}

function LoadingCard() {
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="show"
      exit="exit"
      className={`${cardShell} flex min-h-[20rem] flex-col justify-center p-8`}
    >
      <div className="flex items-center justify-between">
        <div className="h-4 w-36 animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-stone-100 dark:bg-stone-800" />
      </div>
      <div className="mx-auto mt-6 grid h-40 w-40 place-items-center rounded-full border-[12px] border-stone-100 sm:h-48 sm:w-48 dark:border-stone-800">
        <div className="h-8 w-24 animate-pulse rounded-md bg-stone-100 dark:bg-stone-800" />
      </div>
      <div className="mt-6 h-2 w-full animate-pulse rounded-full bg-stone-100 dark:bg-stone-800" />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="h-16 animate-pulse rounded-xl bg-stone-100 dark:bg-stone-800" />
        <div className="h-16 animate-pulse rounded-xl bg-stone-100 dark:bg-stone-800" />
      </div>
      <p className="mt-6 text-center font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
        Evaluating application
      </p>
    </motion.div>
  );
}

function ErrorCard({ message }: { message: string }) {
  return (
    <motion.div
      variants={fade}
      initial="hidden"
      animate="show"
      exit="exit"
      className={`${cardShell} flex min-h-[20rem] flex-col items-center justify-center p-8 text-center`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-200 bg-rose-50 dark:border-rose-900/60 dark:bg-rose-950/40">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="h-5 w-5 text-rose-600 dark:text-rose-400"
        >
          <path d="M12 8v5" />
          <circle cx="12" cy="16.4" r="0.4" fill="currentColor" />
          <path d="M10.3 4.2 3.6 15.9a2 2 0 0 0 1.7 3h13.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
        </svg>
      </span>
      <p className="mt-4 font-display text-xl text-stone-800 dark:text-stone-200">
        Prediction failed
      </p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-stone-500 dark:text-stone-400">
        {message}
      </p>
    </motion.div>
  );
}

export default function CreditRiskApp() {
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const asideRef = useRef<HTMLDivElement | null>(null);

  const handlePredict = async (payload: LoanApplicationPayload) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await predictLoan(payload);
      setResult(res);
      setRunId((id) => id + 1);
      setStatus("done");
    } catch (err) {
      setResult(null);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while contacting the API."
      );
      setStatus("error");
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setStatus("idle");
  };

  useEffect(() => {
    if (
      status === "done" &&
      runId > 0 &&
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches
    ) {
      asideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [status, runId]);

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <motion.header variants={item}>
        <div className="flex items-center justify-between">
          <a href="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white shadow-sm ring-1 ring-stone-900/10 transition-shadow duration-300 group-hover:shadow-md dark:bg-stone-100 dark:text-stone-900 dark:ring-white/10">
              <BrandMark />
            </span>
            <span className="flex flex-col">
              <span className="font-display text-xl leading-none text-stone-900 dark:text-stone-100">
                Risk<span className="italic text-stone-500 dark:text-stone-400">Lens</span>
              </span>
              <span className="mt-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.28em] text-stone-400 dark:text-stone-500">
                Credit Decisioning
              </span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
        <h1 className="mt-10 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-stone-900 dark:text-stone-100 sm:text-6xl">
          Know the risk{" "}
          <em className="italic text-stone-400 dark:text-stone-500">before the loan.</em>
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-stone-500 dark:text-stone-400">
          Enter the applicant and loan details below. The model returns a
          default probability, the decision threshold it was tuned on, and the
          resulting verdict.
        </p>
      </motion.header>

      <div className="mt-8 grid gap-5 lg:grid-cols-12 lg:items-start">
        <motion.section variants={item} className="lg:col-span-7">
          <LoanForm onSubmit={handlePredict} loading={status === "loading"} />
        </motion.section>

        <motion.div
          ref={asideRef}
          variants={item}
          className="self-start lg:sticky lg:top-8 lg:col-span-5"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            {status === "idle" && <PlaceholderCard key="idle" />}
            {status === "loading" && <LoadingCard key="loading" />}
            {status === "error" && error && (
              <ErrorCard key="error" message={error} />
            )}
            {status === "done" && result && (
              <ResultCard
                key={`result-${runId}`}
                result={result}
                onReset={reset}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
