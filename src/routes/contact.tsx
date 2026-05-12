import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { FadeIn, SectionLabel } from "@/components/site/Motion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Eduvo Careers × Dr ACE" },
      { name: "description", content: "Talk to Kerala's most trusted education consultancy. Kochi office, WhatsApp, or fill the form." },
      { property: "og:title", content: "Contact — Eduvo Careers" },
      { property: "og:description", content: "Reach our admissions team — free 30-minute discovery calls." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.length < 2 || !form.email.includes("@") || form.message.length < 10) return;
    setSent(true);
  };

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <SectionLabel>Get in touch</SectionLabel>
          <h1 className="font-display text-5xl sm:text-6xl">Let's <span className="text-gradient-gold">talk</span></h1>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            Free 30-minute discovery call. No obligations, no spam — just clarity on your next step.
          </p>
        </FadeIn>

        <div className="mt-12 grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: MapPin, title: "Visit", text: "Cherukulamba, malappuram , 676504" },
              { icon: Phone, title: "Call", text: "+91 8592866008" },
              { icon: Mail, title: "Email", text: "hello@eduvocareers.in" },
              { icon: MessageCircle, title: "WhatsApp", text: "Tap the floating button" },
            ].map((i, idx) => (
              <FadeIn key={i.title} delay={idx * 0.07}>
                <motion.div whileHover={{ x: 6 }} className="glass rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl glass-gold flex items-center justify-center">
                    <i.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{i.title}</div>
                    <div className="mt-0.5 font-medium">{i.text}</div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.15}>
            <form onSubmit={submit} className="lg:col-span-3 glass rounded-3xl p-7 sm:p-10 shadow-elevated">
              {sent ? (
                <div className="text-center py-10">
                  <div className="inline-flex items-center gap-2 glass-gold rounded-full px-3 py-1 text-xs">
                    <Send className="w-3.5 h-3.5 text-primary" /> Message sent
                  </div>
                  <h3 className="mt-4 font-display text-2xl">Thanks, {form.name.split(" ")[0] || "friend"}.</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Our team replies within one working day.</p>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl">Send us a message</h2>
                  <div className="mt-6 space-y-4">
                    <Field label="Your name">
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aiswarya Nair" className="input" required />
                    </Field>
                    <Field label="Email">
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="input" required />
                    </Field>
                    <Field label="Message">
                      <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your goals..." rows={5} className="input resize-none" required />
                    </Field>
                  </div>
                  <button type="submit" className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-gold text-primary-foreground font-semibold shadow-glow">
                    Send message <Send className="w-4 h-4" />
                  </button>
                </>
              )}
            </form>
          </FadeIn>
        </div>
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
