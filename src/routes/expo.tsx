import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import QRCode from "qrcode";
import { Calendar, MapPin, CheckCircle2, Download, Ticket, ArrowRight } from "lucide-react";
import { districts, courses } from "@/lib/mock-data";
import { FadeIn, SectionLabel } from "@/components/site/Motion";

export const Route = createFileRoute("/expo")({
  head: () => ({
    meta: [
      { title: "Eduvo Expo 2026 — Free Registration" },
      { name: "description", content: "Register free for the Eduvo Career Expo 2026, Kochi. 150+ colleges, on-spot counselling, scholarship desks." },
      { property: "og:title", content: "Eduvo Expo 2026 — Free Registration" },
      { property: "og:description", content: "Generate your QR ticket in under a minute." },
    ],
  }),
  component: ExpoPage,
});

type Form = { name: string; phone: string; district: string; course: string };

function ExpoPage() {
  const [form, setForm] = useState<Form>({ name: "", phone: "", district: "", course: "" });
  const [qr, setQr] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const valid = form.name.trim().length >= 2 && /^\d{10}$/.test(form.phone) && form.district && form.course;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    const id = `EXPO-2026-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const payload = JSON.stringify({ id, ...form, event: "Eduvo Expo 2026" });
    const dataUrl = await QRCode.toDataURL(payload, {
      margin: 1,
      width: 480,
      color: { dark: "#0d1530", light: "#f4d27a" },
    });
    setTicketId(id);
    setQr(dataUrl);
    setSubmitting(false);
  };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto">
            <SectionLabel>Eduvo Expo 2026</SectionLabel>
            <h1 className="font-display text-5xl sm:text-6xl">Your <span className="text-gradient-gold">free pass</span> to Kerala's biggest career expo</h1>
            <div className="mt-5 flex flex-wrap justify-center gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> 14–15 February 2026</span>
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Le Meridien, Kochi</span>
            </div>
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {!qr ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 grid lg:grid-cols-5 gap-6"
            >
              <form onSubmit={submit} className="lg:col-span-3 glass rounded-3xl p-7 sm:p-10 shadow-elevated">
                <h2 className="font-display text-2xl">Register in under a minute</h2>
                <p className="text-sm text-muted-foreground mt-1">We'll generate a QR ticket instantly.</p>

                <div className="mt-7 grid sm:grid-cols-2 gap-4">
                  <Field label="Full name">
                    <input value={form.name} onChange={update("name")} placeholder="Aiswarya Nair" className="input" required />
                  </Field>
                  <Field label="WhatsApp number">
                    <input value={form.phone} onChange={update("phone")} placeholder="9847474747" inputMode="numeric" maxLength={10} className="input" required />
                  </Field>
                  <Field label="District">
                    <select value={form.district} onChange={update("district")} className="input" required>
                      <option value="">Select district</option>
                      {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="Interested course">
                    <select value={form.course} onChange={update("course")} className="input" required>
                      <option value="">Select course</option>
                      {courses.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </Field>
                </div>

                <button
                  type="submit"
                  disabled={!valid || submitting}
                  className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-gold text-primary-foreground font-semibold shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Generating..." : (<>Generate QR Ticket <ArrowRight className="w-4 h-4" /></>)}
                </button>
                <p className="mt-3 text-xs text-muted-foreground">By registering you agree to receive event reminders on WhatsApp.</p>
              </form>

              <div className="lg:col-span-2 glass-gold rounded-3xl p-7 sm:p-10 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/30 rounded-full blur-3xl" />
                <div className="relative">
                  <Ticket className="w-8 h-8 text-primary" />
                  <h3 className="mt-4 font-display text-2xl">What you get</h3>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    {[
                      "Free entry both days",
                      "On-spot counselling with admissions team",
                      "Scholarship & finance desks",
                      "Live aptitude analysis with Dr ACE",
                      "Goodie bag from partner colleges",
                    ].map((t) => (
                      <li key={t} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 max-w-xl mx-auto"
            >
              <div className="glass rounded-3xl p-8 sm:p-10 shadow-elevated text-center relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-30" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 glass-gold rounded-full px-3 py-1 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Registration confirmed
                  </div>
                  <h2 className="mt-5 font-display text-3xl">You're in, {form.name.split(" ")[0]}!</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Save this QR — show at entry.</p>

                  <div className="mt-7 inline-block bg-gradient-gold p-3 rounded-2xl shadow-glow">
                    <img src={qr} alt="Expo ticket QR" width={240} height={240} className="rounded-lg" />
                  </div>

                  <div className="mt-5 text-sm">
                    <div className="text-muted-foreground">Ticket ID</div>
                    <div className="font-mono text-base text-gradient-gold">{ticketId}</div>
                  </div>

                  <div className="mt-7 flex flex-wrap justify-center gap-3">
                    <a
                      href={qr}
                      download={`${ticketId}.png`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold"
                    >
                      <Download className="w-4 h-4" /> Download QR
                    </a>
                    <Link to="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:glass-gold text-sm">
                      Back home
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .input {
          width: 100%;
          background: oklch(0.18 0.05 260 / 0.6);
          border: 1px solid oklch(0.78 0.15 85 / 0.18);
          color: var(--color-foreground);
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input:focus { border-color: oklch(0.78 0.15 85 / 0.6); }
        .input::placeholder { color: var(--color-muted-foreground); }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}
