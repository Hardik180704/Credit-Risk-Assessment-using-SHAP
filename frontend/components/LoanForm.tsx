"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import type { LoanApplicationPayload } from "@/lib/api";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const section: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

type FormState = {
  person_age: string;
  person_income: string;
  person_home_ownership: string;
  person_emp_length: string;
  loan_intent: string;
  loan_grade: string;
  loan_amnt: string;
  loan_int_rate: string;
  loan_percent_income: string;
  cb_person_default_on_file: string;
  cb_person_cred_hist_length: string;
};

const initialForm: FormState = {
  person_age: "",
  person_income: "",
  person_home_ownership: "RENT",
  person_emp_length: "",
  loan_intent: "PERSONAL",
  loan_grade: "A",
  loan_amnt: "",
  loan_int_rate: "",
  loan_percent_income: "",
  cb_person_default_on_file: "N",
  cb_person_cred_hist_length: "",
};

const HOME_OWNERSHIP = [
  { value: "RENT", label: "Rent" },
  { value: "OWN", label: "Own" },
  { value: "MORTGAGE", label: "Mortgage" },
  { value: "OTHER", label: "Other" },
];

const LOAN_INTENTS = [
  { value: "DEBTCONSOLIDATION", label: "Debt consolidation" },
  { value: "EDUCATION", label: "Education" },
  { value: "HOMEIMPROVEMENT", label: "Home improvement" },
  { value: "MEDICAL", label: "Medical" },
  { value: "PERSONAL", label: "Personal" },
  { value: "VENTURE", label: "Venture" },
];

const LOAN_GRADES = ["A", "B", "C", "D", "E", "F", "G"].map((g) => ({
  value: g,
  label: `Grade ${g}`,
}));

const DEFAULT_ON_FILE = [
  { value: "N", label: "No — clean record" },
  { value: "Y", label: "Yes — default on file" },
];

const inputClass =
  "w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2 text-sm text-stone-900 outline-none transition duration-150 placeholder:text-stone-300 hover:border-stone-300 focus:border-stone-900 focus:ring-4 focus:ring-stone-900/5 dark:border-stone-800 dark:bg-stone-900 dark:placeholder:text-stone-600 dark:text-stone-100 dark:hover:border-stone-700 dark:focus:border-stone-300 dark:focus:ring-white/10";

const labelClass =
  "mb-1.5 block text-xs font-medium text-stone-500 dark:text-stone-400";

type FieldName = keyof FormState;

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="2.5"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function Section({
  no,
  title,
  children,
}: {
  no: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section variants={section} className="mt-7 first:mt-0">
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-[10px] font-medium tracking-[0.2em] text-stone-400 dark:text-stone-600">
          {no}
        </span>
        <h3 className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-stone-600 dark:text-stone-400">
          {title}
        </h3>
        <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700/70" />
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
        {children}
      </div>
    </motion.section>
  );
}

function TextField({
  label,
  name,
  form,
  setField,
  min,
  max,
  step,
  placeholder,
  unit,
}: {
  label: string;
  name: FieldName;
  form: FormState;
  setField: (name: FieldName, value: string) => void;
  min?: string;
  max?: string;
  step?: string;
  placeholder?: string;
  unit?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type="number"
          required
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          value={form[name]}
          onChange={(e) => setField(name, e.target.value)}
          className={`${inputClass} ${unit ? "pr-14" : ""}`}
        />
        {unit && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase text-stone-400 dark:text-stone-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  name,
  form,
  setField,
  options,
}: {
  label: string;
  name: FieldName;
  form: FormState;
  setField: (name: FieldName, value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          required
          value={form[name]}
          onChange={(e) => setField(name, e.target.value)}
          className={`${inputClass} cursor-pointer appearance-none pr-9`}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronIcon className="h-4 w-4 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
      </div>
    </div>
  );
}

export default function LoanForm({
  onSubmit,
  loading,
}: {
  onSubmit: (payload: LoanApplicationPayload) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<FormState>(initialForm);

  const setField = (name: FieldName, value: string) =>
    setForm((f) => ({ ...f, [name]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      person_age: Number(form.person_age),
      person_income: Number(form.person_income),
      person_home_ownership: form.person_home_ownership,
      person_emp_length: Number(form.person_emp_length),
      loan_intent: form.loan_intent,
      loan_grade: form.loan_grade,
      loan_amnt: Number(form.loan_amnt),
      loan_int_rate: Number(form.loan_int_rate),
      loan_percent_income: Number(form.loan_percent_income),
      cb_person_default_on_file: form.cb_person_default_on_file,
      cb_person_cred_hist_length: Number(form.cb_person_cred_hist_length),
    });
  };

  return (
    <motion.div
      variants={section}
      className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-6 dark:border-stone-800 dark:bg-stone-900 dark:shadow-none"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">
          Application details
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone-400 dark:text-stone-500">
          All fields required
        </span>
      </div>

      <form onSubmit={handleSubmit}>
        <Section no="01" title="Applicant profile">
          <TextField
            label="Age"
            name="person_age"
            form={form}
            setField={setField}
            min="18"
            max="100"
            step="1"
            placeholder="e.g. 32"
            unit="yrs"
          />
          <TextField
            label="Annual income"
            name="person_income"
            form={form}
            setField={setField}
            min="0"
            step="any"
            placeholder="e.g. 65000"
            unit="$"
          />
          <SelectField
            label="Home ownership"
            name="person_home_ownership"
            form={form}
            setField={setField}
            options={HOME_OWNERSHIP}
          />
          <TextField
            label="Employment length"
            name="person_emp_length"
            form={form}
            setField={setField}
            min="0"
            step="any"
            placeholder="e.g. 4"
            unit="yrs"
          />
        </Section>

        <Section no="02" title="Loan details">
          <SelectField
            label="Loan intent"
            name="loan_intent"
            form={form}
            setField={setField}
            options={LOAN_INTENTS}
          />
          <SelectField
            label="Loan grade"
            name="loan_grade"
            form={form}
            setField={setField}
            options={LOAN_GRADES}
          />
          <TextField
            label="Loan amount"
            name="loan_amnt"
            form={form}
            setField={setField}
            min="0"
            step="any"
            placeholder="e.g. 12000"
            unit="$"
          />
          <TextField
            label="Interest rate"
            name="loan_int_rate"
            form={form}
            setField={setField}
            min="0"
            step="any"
            placeholder="e.g. 11.5"
            unit="%"
          />
          <TextField
            label="Loan vs income"
            name="loan_percent_income"
            form={form}
            setField={setField}
            min="0"
            step="any"
            placeholder="e.g. 0.25"
            unit="ratio"
          />
        </Section>

        <Section no="03" title="Credit history">
          <SelectField
            label="Previous default"
            name="cb_person_default_on_file"
            form={form}
            setField={setField}
            options={DEFAULT_ON_FILE}
          />
          <TextField
            label="Credit history length"
            name="cb_person_cred_hist_length"
            form={form}
            setField={setField}
            min="0"
            step="1"
            placeholder="e.g. 6"
            unit="yrs"
          />
        </Section>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.985 }}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-[15px] font-semibold text-white outline-none transition-colors duration-150 hover:bg-stone-800 focus-visible:ring-4 focus-visible:ring-stone-900/20 disabled:pointer-events-none disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white dark:focus-visible:ring-white/25"
        >
          {loading ? (
            <>
              <Spinner />
              Evaluating…
            </>
          ) : (
            <>
              Evaluate risk
              <ArrowIcon />
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
