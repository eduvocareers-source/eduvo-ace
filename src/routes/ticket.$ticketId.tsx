import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CheckCircle2, Download, Calendar, MapPin, ArrowLeft, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/ticket/$ticketId")({
  head: ({ params }) => ({
    meta: [
      { title: `Ticket ${params.ticketId} — Eduvo Expo 2026` },
      { name: "description", content: "Your confirmed Eduvo Expo 2026 entry ticket." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TicketPage,
});

type Reg = {
  ticket_id: string;
  name: string;
  phone: string;
  district: string;
  course: string;
  created_at: string;
};

function TicketPage() {
  const { ticketId } = Route.useParams();
  const [reg, setReg] = useState<Reg | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("expo_registrations")
        .select("ticket_id,name,phone,district,course,created_at")
        .eq("ticket_id", ticketId)
        .maybeSingle();
      if (!alive) return;
      if (!data) { setStatus("missing"); return; }
      setReg(data as Reg);
      const payload = JSON.stringify({ id: data.ticket_id, name: data.name, event: "Eduvo Expo 2026" });
      const dataUrl = await QRCode.toDataURL(payload, {
        margin: 1,
        width: 480,
        color: { dark: "#0d1530", light: "#f4d27a" },
      });
      if (!alive) return;
      setQr(dataUrl);
      setStatus("ok");
    })();
    return () => { alive = false; };
  }, [ticketId]);

  if (status === "loading") {
    return (
      <section className="py-24 text-center">
        <div className="inline-block w-10 h-10 rounded-2xl bg-gradient-gold animate-pulse" />
        <p className="mt-4 text-sm text-muted-foreground">Loading ticket…</p>
      </section>
    );
  }

  if (status === "missing" || !reg) {
    return (
      <section className="py-24">
        <div className="max-w-md mx-auto glass rounded-3xl p-10 text-center">
          <h1 className="font-display text-3xl">Ticket not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">We couldn't find a registration with ID <span className="font-mono">{ticketId}</span>.</p>
          <Link to="/expo" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold">
            Register now
          </Link>
        </div>
      </section>
    );
  }

  const wa = `https://wa.me/919847474747?text=${encodeURIComponent(`Hi Eduvo, this is ${reg.name}. My expo ticket is ${reg.ticket_id}.`)}`;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-xl px-4">
        <Link to="/expo" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Register another
        </Link>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 sm:p-10 shadow-elevated text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 glass-gold rounded-full px-3 py-1 text-xs">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Registration confirmed
            </div>
            <h1 className="mt-5 font-display text-3xl">You're in, {reg.name.split(" ")[0]}!</h1>
            <p className="mt-2 text-sm text-muted-foreground">Save this QR — show at entry.</p>

            {qr && (
              <div className="mt-7 inline-block bg-gradient-gold p-3 rounded-2xl shadow-glow">
                <img src={qr} alt="Expo ticket QR" width={240} height={240} className="rounded-lg" />
              </div>
            )}

            <div className="mt-5 text-sm">
              <div className="text-muted-foreground">Ticket ID</div>
              <div className="font-mono text-base text-gradient-gold">{reg.ticket_id}</div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 text-left text-xs">
              <Info label="Course"><span className="text-foreground">{reg.course}</span></Info>
              <Info label="District"><span className="text-foreground">{reg.district}</span></Info>
              <Info label="Date"><span className="text-foreground flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" />14–15 Feb 2026</span></Info>
              <Info label="Venue"><span className="text-foreground flex items-center gap-1"><MapPin className="w-3 h-3 text-primary" />Le Meridien, Kochi</span></Info>
            </dl>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {qr && (
                <a
                  href={qr}
                  download={`${reg.ticket_id}.png`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold"
                >
                  <Download className="w-4 h-4" /> Download QR
                </a>
              )}
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:glass-gold text-sm"
              >
                <MessageCircle className="w-4 h-4 text-primary" /> WhatsApp us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Info({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-lg px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}
