"use client";
import { useState, type FormEvent } from "react";
import { Icon } from "./icons";
import type { Prefill } from "./leadStore";

export const SERVICE_OPTIONS = ["Home Interior", "Office Interior", "Restaurant Interior", "Hotel Interior", "Custom Furniture", "Remodeling", "Exterior Design"];
export const CITIES = ["Dhaka", "Chittagong", "Sylhet", "Other"];
export const BUDGETS = ["Under 10 lakh", "10 - 25 lakh", "25 - 50 lakh", "50 lakh +"];

const field = "w-full rounded-sm border border-[#1F2937]/15 bg-[#F0F7F3] px-3.5 py-3 text-xs md:text-sm text-[#1F2937] outline-none transition placeholder:text-[#1F2937]/40 focus:border-[#2F7D5B] focus:bg-white";
const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;
type V = { name: string; phone: string; email: string; city: string; service: string; budget: string; message: string };
const EMPTY: V = { name: "", phone: "", email: "", city: "", service: "", budget: "", message: "" };

function validate(v: V) {
  const e: Partial<Record<keyof V, string>> = {};
  if (v.name.trim().length < 2) e.name = "Please enter your name";
  if (!BD_PHONE.test(v.phone.replace(/[\s-]/g, ""))) e.phone = "Enter a valid Bangladeshi mobile number";
  if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) e.email = "Enter a valid email";
  return e;
}

function Err({ err, k }: { err: Partial<Record<keyof V, string>>; k: keyof V }) {
  return err[k] ? <p className="mt-1 pl-1 text-[11px] text-red-600">{err[k]}</p> : null;
}

/** Shared consultation / contact form: validates, posts to /api/real-estate/lead. Used in the modal and the contact page. */
export default function LeadForm({ prefill = {}, source = "real-estate-web", onDone }: { prefill?: Prefill; source?: string; onDone?: () => void }) {
  const [v, setV] = useState<V>({ ...EMPTY, ...prefill });
  const [prevPrefill, setPrevPrefill] = useState(prefill);
  if (prevPrefill !== prefill) {
    setPrevPrefill(prefill);
    setV((p) => ({ ...p, ...prefill }));
  }
  const [err, setErr] = useState<Partial<Record<keyof V, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent" | "fail">("idle");

  const set = (k: keyof V) => (e: { target: { value: string } }) => setV((p) => ({ ...p, [k]: e.target.value }));
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hp = new FormData(e.currentTarget).get("website"); // honeypot
    const errs = validate(v); setErr(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    try {
      const res = await fetch("/api/real-estate/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...v, website: hp, source }) });
      setState(res.ok ? "sent" : "fail");
    } catch { setState("fail"); }
  };

  if (state === "sent") return (
    <div className="py-8 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-sm bg-[#2F7D5B] text-white"><Icon n="check" className="h-6 w-6" /></div>
      <h3 className="mt-4 text-xl font-bold text-[#1F2937]">Thank you, {v.name.split(" ")[0]}!</h3>
      <p className="mt-2 text-xs text-[#1F2937]/65 md:text-sm">Our team will call you within one working day to schedule your free consultation.</p>
      {onDone && <button type="button" onClick={onDone} className="mt-6 rounded-sm bg-[#1F2937] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white">Done</button>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-3 md:grid-cols-2">
        <div><input value={v.name} onChange={set("name")} placeholder="Your name *" className={field} /><Err err={err} k="name" /></div>
        <div><input value={v.phone} onChange={set("phone")} type="tel" placeholder="Phone (01XXXXXXXXX) *" className={field} /><Err err={err} k="phone" /></div>
        <div><input value={v.email} onChange={set("email")} type="email" placeholder="Email (optional)" className={field} /><Err err={err} k="email" /></div>
        <select value={v.city} onChange={set("city")} className={field}><option value="">City</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={v.service} onChange={set("service")} className={field}><option value="">Service</option>{SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={v.budget} onChange={set("budget")} className={field}><option value="">Budget range</option>{BUDGETS.map((b) => <option key={b}>{b}</option>)}</select>
        <textarea value={v.message} onChange={set("message")} rows={3} placeholder="Tell us about your project" className={`${field} md:col-span-2`} />
      </div>
      {state === "fail" && <p className="mt-3 text-xs text-red-600">Something went wrong. Please try again or call us directly.</p>}
      <button type="submit" disabled={state === "sending"} className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-[#2F7D5B] py-3.5 text-xs md:text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-[#276a4d] disabled:opacity-60">
        {state === "sending" ? "Sending..." : "Book my free consultation"}{state !== "sending" && <Icon n="arrow" className="h-4 w-4" />}
      </button>
    </form>
  );
}
