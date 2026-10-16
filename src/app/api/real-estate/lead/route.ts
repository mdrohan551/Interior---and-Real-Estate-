import { NextResponse } from "next/server";

const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

/** POST /api/real-estate/lead: validates a consultation / contact request. Connect your lead-management backend at the TODO. */
export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) return NextResponse.json({ ok: false }, { status: 400 });
  if (b.website) return NextResponse.json({ ok: true }); // honeypot: pretend success to bots

  const name = String(b.name ?? "").trim();
  const phone = String(b.phone ?? "").replace(/[\s-]/g, "");
  if (name.length < 2 || !BD_PHONE.test(phone)) return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });

  const lead = {
    name, phone, email: String(b.email ?? "").trim(), city: String(b.city ?? ""), service: String(b.service ?? ""),
    budget: String(b.budget ?? ""), message: String(b.message ?? "").slice(0, 2000), source: String(b.source ?? "real-estate-web"),
    createdAt: new Date().toISOString(),
  };
  // TODO: forward `lead` to your existing lead endpoint / DB / email / WhatsApp notification.
  console.log("[real-estate lead]", lead);
  return NextResponse.json({ ok: true });
}
