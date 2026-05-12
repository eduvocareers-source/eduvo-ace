import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { Calendar, MapPin, CheckCircle2, Ticket, ArrowRight, AlertCircle } from "lucide-react";
import { districts } from "@/lib/mock-data";
import { FadeIn, SectionLabel } from "@/components/site/Motion";
import { Countdown } from "@/components/site/Countdown";
import { supabase } from "@/integrations/supabase/client";

const EXPO_DATE = new Date("2026-02-14T09:00:00+05:30");

export const Route = createFileRoute("/expo")({
  head: () => ({
    meta: [
      { title: "Eduvo Expo 2026 — Free Registration" },
      { name: "description", content: "Register free for the Eduvo Career Expo 2026, Kochi. 150+ colleges, on-spot counselling, scholarship desks." },
    ],
  }),
  component: ExpoPage,
});

const STREAMS = ["Science (Bio)", "Science (Computer)", "Science (Maths)", "Commerce", "Humanities", "Vocational", "Other"];
const GUIDANCE = ["Course selection", "College selection", "Career discovery", "Scholarship & finance", "Study abroad pathway", "Entrance exam strategy"];
const STUDY_LOC = ["India", "Abroad", "Open to both"];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit number"),
  email: z.string().trim().email("Invalid email").max(120).optional().or(z.literal("")),
  district: z.string().min(1, "Select a district"),
  stream: z.string().min(1, "Select your Plus Two stream"),
  guidance: z.string().min(1, "Tell us what guidance you need"),
  study_location: z.string().min(1, "Select study preference"),
  parent_attending: z.enum(["yes", "no"], { message: "Let us know if a parent is attending" }),
});
type Form = z.infer<typeof schema>;

function makeTicketId() {
  return `EXPO-2026-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function ExpoPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    name: "", phone: "", email: "", district: "",
    stream: "", guidance: "", study_location: "", parent_attending: "" as "yes" | "no",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const update = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value as never });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the form");
      return;
    }
    setSubmitting(true);
    const ticket_id = makeTicketId();
    const { error: dbError } = await supabase.from("expo_registrations").insert({
      ticket_id,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email || null,
      district: parsed.data.district,
      stream: parsed.data.stream,
      guidance: parsed.data.guidance,
      study_location: parsed.data.study_location,
      parent_attending: parsed.data.parent_attending === "yes",
    });
    setSubmitting(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    navigate({ to: "/ticket/$ticketId", params: { ticketId: ticket_id } });
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
            <div className="mt-8 max-w-md mx-auto">
              <Countdown target={EXPO_DATE} />
            </div>
          </div>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 grid lg:grid-cols-5 gap-6"
        >
          <form onSubmit={submit} className="lg:col-span-3 glass rounded-3xl p-7 sm:p-10 shadow-elevated">
            <h2 className="font-display text-2xl">Register in under a minute</h2>
            <p className="text-sm text-muted-foreground mt-1">We'll generate your premium QR ticket instantly.</p>

            <div className="mt-7 grid sm:grid-cols-2 gap-4">
              <Field label="Full name">
                <input value={form.name} onChange={update("name")} placeholder="Aiswarya Nair" maxLength={80} className="input" required />
              </Field>
              <Field label="WhatsApp number">
                <input value={form.phone} onChange={update("phone")} placeholder="9847474747" inputMode="numeric" maxLength={10} className="input" required />
              </Field>
              <Field label="Email (optional)">
                <input value={form.email} onChange={update("email")} placeholder="you@example.com" type="email" maxLength={120} className="input" />
              </Field>
              <Field label="District">
                <select value={form.district} onChange={update("district")} className="input" required>
                  <option value="">Select district</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Plus Two stream">
                <select value={form.stream} onChange={update("stream")} className="input" required>
                  <option value="">Select stream</option>
                  {STREAMS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Guidance you're looking for">
                <select value={form.guidance} onChange={update("guidance")} className="input" required>
                  <option value="">Select guidance</option>
                  {GUIDANCE.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="Planning to study">
                <select value={form.study_location} onChange={update("study_location")} className="input" required>
                  <option value="">Select preference</option>
                  {STUDY_LOC.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Parent attending with you?">
                <select value={form.parent_attending} onChange={update("parent_attending")} className="input" required>
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </Field>
            </div>

            {error && (
              <div className="mt-5 flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-gold text-primary-foreground font-semibold shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Generating..." : (<>Generate Premium Ticket <ArrowRight className="w-4 h-4" /></>)}
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
                  "1-on-1 counselling with admissions teams",
                  "Discover suitable courses & careers",
                  "Scholarship & finance desks",
                  "Live aptitude analysis with Dr ACE",
                  "Goodie bag from partner colleges",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" /> {t}
                  </li>
                ))}
              </ul>
              <Link to="/" className="mt-6 inline-block text-xs text-primary hover:text-gold-soft">
                Already registered? Look up your ticket →
              </Link>
            </div>
          </div>
        </motion.div>
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
