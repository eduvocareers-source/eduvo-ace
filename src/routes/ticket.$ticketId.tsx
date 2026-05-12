import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  CheckCircle2, Download, Calendar, MapPin, ArrowLeft, MessageCircle,
  CalendarPlus, FileDown, Image as ImageIcon, GraduationCap, Sparkles, User,
} from "lucide-react";
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
  stream: string | null;
  guidance: string | null;
  study_location: string | null;
  parent_attending: boolean | null;
  created_at: string;
};

const EVENT = {
  name: "Eduvo Careers × Dr ACE Expo 2026",
  shortName: "Eduvo Expo 2026",
  venue: "Le Meridien Convention Centre, Kochi",
  start: new Date("2026-02-14T09:00:00+05:30"),
  end: new Date("2026-02-15T18:00:00+05:30"),
  dateLabel: "14–15 February 2026",
  timeLabel: "9:00 AM – 6:00 PM",
};

function icsDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function TicketPage() {
  const { ticketId } = Route.useParams();
  const [reg, setReg] = useState<Reg | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "missing">("loading");
  const ticketRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<null | "png" | "pdf">(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("expo_registrations")
        .select("ticket_id,name,phone,district,stream,guidance,study_location,parent_attending,created_at")
        .eq("ticket_id", ticketId)
        .maybeSingle();
      if (!alive) return;
      if (!data) { setStatus("missing"); return; }
      setReg(data as Reg);
      const payload = JSON.stringify({ id: data.ticket_id, name: data.name, event: EVENT.shortName });
      const dataUrl = await QRCode.toDataURL(payload, {
        margin: 1,
        width: 600,
        color: { dark: "#0b1330", light: "#ffffff" },
      });
      if (!alive) return;
      setQr(dataUrl);
      setStatus("ok");
    })();
    return () => { alive = false; };
  }, [ticketId]);

  const downloadImage = async () => {
    if (!ticketRef.current || !reg) return;
    setExporting("png");
    try {
      const canvas = await html2canvas(ticketRef.current, { backgroundColor: null, scale: 2, useCORS: true });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reg.ticket_id}.png`;
      a.click();
    } finally { setExporting(null); }
  };

  const downloadPDF = async () => {
    if (!ticketRef.current || !reg) return;
    setExporting("pdf");
    try {
      const canvas = await html2canvas(ticketRef.current, { backgroundColor: null, scale: 2, useCORS: true });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width, canvas.height] });
      pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${reg.ticket_id}.pdf`);
    } finally { setExporting(null); }
  };

  const addToCalendar = () => {
    if (!reg) return;
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Eduvo Careers//Expo 2026//EN",
      "BEGIN:VEVENT",
      `UID:${reg.ticket_id}@eduvocareers.in`,
      `DTSTAMP:${icsDate(new Date())}`,
      `DTSTART:${icsDate(EVENT.start)}`,
      `DTEND:${icsDate(EVENT.end)}`,
      `SUMMARY:${EVENT.name}`,
      `LOCATION:${EVENT.venue}`,
      `DESCRIPTION:Your ticket: ${reg.ticket_id}\\nName: ${reg.name}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reg.ticket_id}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4">
        <Link to="/expo" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Register another
        </Link>

        {/* Success banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md text-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
            className="mx-auto w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center shadow-glow"
          >
            <CheckCircle2 className="w-9 h-9 text-primary-foreground" strokeWidth={2.5} />
          </motion.div>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl">You're in, {reg.name.split(" ")[0]}!</h1>
          <p className="mt-2 text-sm text-muted-foreground inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-primary" /> Your premium ticket is ready
          </p>
        </motion.div>

        {/* THE TICKET */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotateX: -10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          style={{ perspective: 1200 }}
        >
          <div ref={ticketRef} style={ticketWrap}>
            {/* Decorative glow */}
            <div style={glow1} />
            <div style={glow2} />

            <div style={ticketInner}>
              {/* MAIN STUB */}
              <div style={mainStub}>
                {/* Header */}
                <div style={brandRow}>
                  <div style={logoBox}>
                    <GraduationCap color="#0b1330" size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <div style={brandTop}>EDUVO CAREERS <span style={{ color: "#d8b86a" }}>×</span> DR ACE</div>
                    <div style={brandSub}>OFFICIAL EVENT TICKET · ADMIT ONE</div>
                  </div>
                </div>

                <div style={titleBlock}>
                  <div style={eventTag}>KERALA'S BIGGEST CAREER EXPO</div>
                  <h2 style={eventTitle}>EXPO <span style={{ color: "#f4d27a" }}>2026</span></h2>
                  <div style={eventSub}>Discover Your Future · 150+ Colleges · On-spot Counselling</div>
                </div>

                {/* Name + meta grid */}
                <div style={attendeeBlock}>
                  <div style={attendeeLabel}><User size={11} style={{ display: "inline", marginRight: 4 }} /> ATTENDEE</div>
                  <div style={attendeeName}>{reg.name}</div>
                </div>

                <div style={metaGrid}>
                  <Meta label="DATE" value={EVENT.dateLabel} icon={<Calendar size={11} />} />
                  <Meta label="TIME" value={EVENT.timeLabel} />
                  <Meta label="VENUE" value="Le Meridien, Kochi" icon={<MapPin size={11} />} />
                  <Meta label="DISTRICT" value={reg.district} />
                  <Meta label="STREAM" value={reg.stream ?? "—"} />
                  <Meta label="STUDY" value={reg.study_location ?? "—"} />
                </div>

                {/* Footer bar */}
                <div style={footerBar}>
                  <div>
                    <div style={{ fontSize: 9, color: "#9ba6c9", letterSpacing: 1.2 }}>TICKET ID</div>
                    <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 14, color: "#f4d27a", letterSpacing: 1, marginTop: 2 }}>
                      {reg.ticket_id}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: "#9ba6c9", letterSpacing: 1.2 }}>ENTRY</div>
                    <div style={{ fontSize: 14, color: "#fff", marginTop: 2, fontWeight: 600 }}>FREE PASS</div>
                  </div>
                </div>
              </div>

              {/* PERFORATION */}
              <div style={perforation}>
                <div style={notchTop} />
                <div style={dashedLine} />
                <div style={notchBottom} />
              </div>

              {/* QR STUB */}
              <div style={qrStub}>
                <div style={{ fontSize: 9, color: "#9ba6c9", letterSpacing: 2, textAlign: "center" }}>
                  SCAN AT ENTRY
                </div>
                {qr && (
                  <div style={qrFrame}>
                    <img src={qr} alt="QR" style={{ width: 160, height: 160, display: "block", borderRadius: 6 }} />
                  </div>
                )}
                <div style={{ fontFamily: "ui-monospace, Menlo, monospace", fontSize: 10, color: "#f4d27a", letterSpacing: 1, textAlign: "center" }}>
                  {reg.ticket_id}
                </div>
                <div style={{ fontSize: 9, color: "#6f7aa3", textAlign: "center", marginTop: 6 }}>
                  eduvocareers.in
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-7 flex flex-wrap justify-center gap-3"
        >
          <button
            onClick={downloadImage}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold shadow-glow disabled:opacity-60"
          >
            <ImageIcon className="w-4 h-4" /> {exporting === "png" ? "Saving…" : "Download Image"}
          </button>
          <button
            onClick={downloadPDF}
            disabled={exporting !== null}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:glass-gold text-sm font-semibold disabled:opacity-60"
          >
            <FileDown className="w-4 h-4 text-primary" /> {exporting === "pdf" ? "Saving…" : "Download PDF"}
          </button>
          <button
            onClick={addToCalendar}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:glass-gold text-sm font-semibold"
          >
            <CalendarPlus className="w-4 h-4 text-primary" /> Add to Calendar
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass hover:glass-gold text-sm font-semibold"
          >
            <MessageCircle className="w-4 h-4 text-primary" /> WhatsApp Us
          </a>
        </motion.div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Save this ticket on your phone or print it. Show the QR at the entry desk.
        </p>
      </div>
    </section>
  );
}

function Meta({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div style={metaCell}>
      <div style={{ fontSize: 9, color: "#9ba6c9", letterSpacing: 1.4, display: "flex", alignItems: "center", gap: 4 }}>
        {icon}{label}
      </div>
      <div style={{ fontSize: 12, color: "#fff", marginTop: 3, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

/* -------------- INLINE STYLES (html2canvas-safe, hex colors only) -------------- */
const ticketWrap: React.CSSProperties = {
  position: "relative",
  borderRadius: 28,
  padding: 14,
  background: "linear-gradient(135deg, #f4d27a 0%, #c89b3c 50%, #f4d27a 100%)",
  boxShadow: "0 30px 80px -20px rgba(11,19,48,0.7), 0 0 0 1px rgba(244,210,122,0.4)",
};
const glow1: React.CSSProperties = {
  position: "absolute", top: -60, right: -60, width: 220, height: 220,
  background: "radial-gradient(circle, rgba(244,210,122,0.5), transparent 70%)",
  filter: "blur(40px)", pointerEvents: "none",
};
const glow2: React.CSSProperties = {
  position: "absolute", bottom: -60, left: -60, width: 220, height: 220,
  background: "radial-gradient(circle, rgba(101,143,255,0.4), transparent 70%)",
  filter: "blur(40px)", pointerEvents: "none",
};
const ticketInner: React.CSSProperties = {
  position: "relative",
  display: "flex",
  borderRadius: 20,
  background: "linear-gradient(145deg, #0b1330 0%, #131c44 60%, #0b1330 100%)",
  overflow: "hidden",
  minHeight: 360,
};
const mainStub: React.CSSProperties = {
  flex: 1,
  padding: "26px 28px",
  display: "flex",
  flexDirection: "column",
  gap: 18,
  borderRight: "0",
  position: "relative",
};
const brandRow: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12 };
const logoBox: React.CSSProperties = {
  width: 36, height: 36, borderRadius: 10,
  background: "linear-gradient(135deg, #f4d27a, #c89b3c)",
  display: "flex", alignItems: "center", justifyContent: "center",
};
const brandTop: React.CSSProperties = { fontSize: 12, color: "#fff", fontWeight: 700, letterSpacing: 1.5 };
const brandSub: React.CSSProperties = { fontSize: 9, color: "#9ba6c9", letterSpacing: 2, marginTop: 2 };
const titleBlock: React.CSSProperties = { borderTop: "1px solid rgba(244,210,122,0.18)", borderBottom: "1px solid rgba(244,210,122,0.18)", padding: "16px 0" };
const eventTag: React.CSSProperties = { fontSize: 9, color: "#f4d27a", letterSpacing: 2 };
const eventTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 44, color: "#fff", margin: "4px 0 4px", lineHeight: 1, fontWeight: 700,
};
const eventSub: React.CSSProperties = { fontSize: 11, color: "#cdd4ee" };
const attendeeBlock: React.CSSProperties = {};
const attendeeLabel: React.CSSProperties = { fontSize: 9, color: "#9ba6c9", letterSpacing: 1.4 };
const attendeeName: React.CSSProperties = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontSize: 26, color: "#f4d27a", marginTop: 4, fontWeight: 600, lineHeight: 1.1,
};
const metaGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 10,
};
const metaCell: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(244,210,122,0.12)",
  borderRadius: 10, padding: "8px 10px",
};
const footerBar: React.CSSProperties = {
  marginTop: "auto",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: 14,
  borderTop: "1px dashed rgba(244,210,122,0.25)",
};
const perforation: React.CSSProperties = {
  position: "relative",
  width: 24,
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
};
const notchTop: React.CSSProperties = {
  width: 24, height: 24, borderRadius: "0 0 24px 24px",
  background: "linear-gradient(135deg, #f4d27a 0%, #c89b3c 100%)",
  marginTop: -1,
};
const notchBottom: React.CSSProperties = {
  width: 24, height: 24, borderRadius: "24px 24px 0 0",
  background: "linear-gradient(135deg, #f4d27a 0%, #c89b3c 100%)",
  marginBottom: -1,
};
const dashedLine: React.CSSProperties = {
  flex: 1,
  width: 1,
  borderLeft: "2px dashed rgba(244,210,122,0.4)",
  margin: "4px 0",
};
const qrStub: React.CSSProperties = {
  width: 220,
  padding: "26px 20px",
  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  gap: 12,
  background: "linear-gradient(180deg, #0b1330 0%, #0a1029 100%)",
};
const qrFrame: React.CSSProperties = {
  background: "#fff",
  padding: 8,
  borderRadius: 10,
  boxShadow: "0 0 0 2px rgba(244,210,122,0.5)",
};
