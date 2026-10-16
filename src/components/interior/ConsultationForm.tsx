"use client";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { interior, submitEnquiry, type Enquiry } from "@/lib/interior";

const EMPTY: Enquiry = { name: "", phone: "", email: "", projectType: "", budget: "", area: "", message: "" };
type Errors = Partial<Record<keyof Enquiry, string>>;

function validate(v: Enquiry): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name.";
  if (!/^\+?[0-9][0-9\s-]{7,14}$/.test(v.phone.trim())) e.phone = "Enter a valid mobile number, for example +880 1711 288948.";
  if (v.email && !/^\S+@\S+\.\S+$/.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!v.projectType) e.projectType = "Choose a project type.";
  if (v.area && (Number(v.area) <= 0 || Number.isNaN(Number(v.area)))) e.area = "Enter the area as a number.";
  return e;
}

const input =
  "w-full border-b border-lv-line bg-transparent py-3 text-[15px] text-lv-ink outline-none transition-colors placeholder:text-lv-mute/70 focus:border-lv-ink focus-visible:outline-none aria-[invalid=true]:border-red-700";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs text-lv-mute">{label}</label>
      {children}
      <p id={`${id}-err`} role="alert" className="min-h-5 pt-1 text-xs text-red-700">{error}</p>
    </div>
  );
}

export default function ConsultationForm({ onDone }: { onDone?: () => void }) {
  const uid = useId();
  const c = interior.contact;
  const [v, setV] = useState<Enquiry>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (k: keyof Enquiry) => (e: { target: { value: string } }) => {
    setV((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };
  const blur = (k: keyof Enquiry) => () => setErrors((p) => ({ ...p, [k]: validate(v)[k] }));
  const props = (k: keyof Enquiry) => ({
    id: `${uid}-${k}`, value: v[k], onChange: set(k), onBlur: blur(k), className: input,
    "aria-invalid": !!errors[k], "aria-describedby": `${uid}-${k}-err`,
  });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (new FormData(e.currentTarget).get("website")) return; // honeypot
    const found = validate(v);
    setErrors(found);
    if (Object.keys(found).length) {
      (e.currentTarget.querySelector("[aria-invalid=true]") as HTMLElement | null)?.focus();
      return;
    }
    setStatus("sending");
    await submitEnquiry(v);
    setStatus("sent");
  };

  if (status === "sent") {
    return (
      <div className="flex min-h-80 flex-col items-start justify-center gap-4 animate-lv-fade" role="status">
        <svg viewBox="0 0 32 32" className="size-12 text-lv-ink" fill="none" aria-hidden>
          <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1" />
          <path d="M9 16.5l4.5 4.5L23 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="30" className="animate-lv-draw" />
        </svg>
        <h3 className="lv-h2">{c.success.title}</h3>
        <p className="max-w-sm text-lv-mute">{c.success.text}</p>
        {onDone && <button type="button" onClick={onDone} className="mt-2 h-12 rounded-md bg-lv-ink px-7 text-sm text-white transition-colors hover:bg-lv-deep">Close</button>}
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-x-8 sm:grid-cols-2">
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <Field id={`${uid}-name`} label="Full name" error={errors.name}>
        <input {...props("name")} name="name" autoComplete="name" placeholder="Your name" />
      </Field>
      <Field id={`${uid}-phone`} label="Mobile number" error={errors.phone}>
        <input {...props("phone")} name="phone" type="tel" autoComplete="tel" placeholder="+880 1XXX XXXXXX" />
      </Field>
      <div className="sm:col-span-2">
        <Field id={`${uid}-email`} label="Email (optional)" error={errors.email}>
          <input {...props("email")} name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        </Field>
      </div>
      <Field id={`${uid}-projectType`} label="Project type" error={errors.projectType}>
        <select {...props("projectType")} name="projectType" className={`${input} ${v.projectType ? "" : "text-lv-mute/70"}`}>
          <option value="" disabled>Select a type</option>
          {c.projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field id={`${uid}-budget`} label="Budget range (optional)">
        <select {...props("budget")} name="budget" className={`${input} ${v.budget ? "" : "text-lv-mute/70"}`}>
          <option value="">Select a range</option>
          {c.budgets.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field id={`${uid}-area`} label="Area in sqft (optional)" error={errors.area}>
          <input {...props("area")} name="area" inputMode="numeric" placeholder="2500" />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field id={`${uid}-message`} label="Message (optional)">
          <textarea {...props("message")} name="message" rows={3} placeholder="Tell us about your space and timeline" />
        </Field>
      </div>
      <button type="submit" disabled={status === "sending"}
        className="mt-2 inline-flex h-12 items-center justify-center gap-3 rounded-md bg-lv-ink px-8 text-sm text-white transition-colors hover:bg-lv-deep disabled:opacity-70 sm:col-span-2 sm:justify-self-start">
        {status === "sending" ? (<><span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Sending</>) : "Book consultation"}
      </button>
    </form>
  );
}

export { ConsultationForm };

