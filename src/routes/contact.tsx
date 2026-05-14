import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send, Instagram, Facebook, Youtube, Linkedin, Headphones, GraduationCap } from "lucide-react";
import { useState } from "react";
import { FadeIn, SectionLabel } from "@/components/site/Motion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Eduvo Careers × Dr ACE" },
      { name: "description", content: "Talk to Kerala's most trusted education consultancy. Visit our Cherukulamba office, call, or WhatsApp." },
      { property: "og:title", content: "Contact — Eduvo Careers" },
      { property: "og:description", content: "Reach our admissions team — free 30-minute discovery calls." },
    ],
  }),
  component: ContactPage,
});

const OFFICE_ADDRESS =
  "Opposite DUHSS Panakkad School, Opposite IKTHSS Cherukulamba, Malappuram, Kerala 676504";
const MAPS_QUERY = encodeURIComponent("IKTHSS Cherukulamba, Malappuram, Kerala");
const MAPS_EMBED = `https://www.google.com/maps?q=${MAPS_QUERY}&output=embed`;
const MAPS_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

const PHONES: { label: string; number: string; icon: typeof Phone }[] = [
  { label: "Main Office", number: "6238995581", icon: Phone },
  { label: "Support", number: "9074445804", icon: Headphones },
  { label: "Admission & WhatsApp", number: "8592866008", icon: MessageCircle },
];

const SOCIALS = [
  { Icon: Instagram, href: "https://instagram.com/eduvocareers", label: "Instagram" },
  { Icon: Facebook, href: "https://facebook.com/eduvocareers", label: "Facebook" },
  { Icon: Youtube, href: "https://youtube.com/@eduvocareers", label: "YouTube" },
  { Icon: Linkedin, href: "https://linkedin.com/company/eduvocareers", label: "LinkedIn" },
];

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
            Free 30-minute discovery call. Drop into our Cherukulamba office, ring our team, or WhatsApp us — we reply within minutes.
          </p>
        </FadeIn>

        {/* Contact cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PHONES.map((p, i) => (
            <FadeIn key={p.number} delay={i * 0.06}>
              <motion.a
                whileHover={{ y: -4 }}
                href={`tel:+91${p.number}`}
                className="block glass rounded-2xl p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl glass-gold flex items-center justify-center">
                    <p.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{p.label}</div>
                    <div className="mt-0.5 font-display text-xl">+91 {p.number}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="text-[11px] text-primary">Tap to call</span>
                      <a
                        href={`https://wa.me/91${p.number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-gold-soft hover:underline"
                      >
                        · WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </motion.a>
            </FadeIn>
          ))}
        </div>

        {/* Address + Map + Form */}
        <div className="mt-8 grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <FadeIn>
              <div className="glass rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl glass-gold flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Visit our office</div>
                    <div className="mt-0.5 font-medium leading-relaxed">{OFFICE_ADDRESS}</div>
                    <a
                      href={MAPS_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs text-primary hover:text-gold-soft"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.05}>
              <div className="glass rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl glass-gold flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Email</div>
                    <a href="mailto:hello@eduvocareers.in" className="mt-0.5 font-medium hover:text-primary">hello@eduvocareers.in</a>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="glass rounded-2xl p-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Follow us</div>
                <div className="mt-3 flex items-center gap-3">
                  {SOCIALS.map(({ Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-lg glass hover:glass-gold flex items-center justify-center transition"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <GraduationCap className="w-4 h-4 text-primary" /> Office hours
                </div>
                <p className="mt-2 text-sm">Mon – Sat · 9:30 AM – 7:00 PM</p>
                <p className="text-sm text-muted-foreground">Sunday · By appointment</p>
              </div>
            </FadeIn>
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
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Aiswarya Nair" maxLength={80} className="input" required />
                    </Field>
                    <Field label="Email">
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" maxLength={120} className="input" required />
                    </Field>
                    <Field label="Message">
                      <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your goals..." rows={5} maxLength={1000} className="input resize-none" required />
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

        {/* Map embed */}
        <FadeIn delay={0.1}>
          <div className="mt-10 glass rounded-3xl p-2 overflow-hidden shadow-elevated">
            <div className="rounded-2xl overflow-hidden border border-border/40">
              <iframe
                title="Eduvo Careers office location"
                src={MAPS_EMBED}
                width="100%"
                height="380"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0, display: "block", filter: "grayscale(0.2) contrast(1.05)" }}
              />
            </div>
          </div>
        </FadeIn>
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
