import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, LogOut, Search, Users, TicketCheck, Calendar, ShieldAlert, ScanLine, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, checkIsAdmin } from "@/lib/auth";
import { QrScanner } from "@/components/site/QrScanner";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Eduvo Careers" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Reg = {
  id: string;
  ticket_id: string;
  name: string;
  phone: string;
  email: string | null;
  district: string;
  stream: string | null;
  guidance: string | null;
  study_location: string | null;
  parent_attending: boolean | null;
  checked_in: boolean;
  checked_in_at: string | null;
  created_at: string;
};

type Toast = { kind: "ok" | "warn" | "err"; msg: string };

function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [regs, setRegs] = useState<Reg[]>([]);
  const [q, setQ] = useState("");
  const [fetching, setFetching] = useState(true);
  const [scanOpen, setScanOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [busyScan, setBusyScan] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/login" }); return; }
    checkIsAdmin(user.id).then(setIsAdmin);
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    let alive = true;
    (async () => {
      setFetching(true);
      const { data } = await supabase
        .from("expo_registrations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);
      if (alive) { setRegs((data ?? []) as Reg[]); setFetching(false); }
    })();

    const ch = supabase
      .channel("admin-regs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "expo_registrations" }, (p) => {
        setRegs((prev) => [p.new as Reg, ...prev]);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "expo_registrations" }, (p) => {
        const next = p.new as Reg;
        setRegs((prev) => prev.map((x) => x.id === next.id ? next : x));
      })
      .subscribe();
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [isAdmin]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return regs;
    return regs.filter((r) =>
      r.name.toLowerCase().includes(s) ||
      r.phone.includes(s) ||
      r.ticket_id.toLowerCase().includes(s) ||
      r.district.toLowerCase().includes(s) ||
      (r.stream ?? "").toLowerCase().includes(s) ||
      (r.guidance ?? "").toLowerCase().includes(s)
    );
  }, [regs, q]);

  const stats = useMemo(() => ({
    total: regs.length,
    checkedIn: regs.filter((r) => r.checked_in).length,
    today: regs.filter((r) => new Date(r.created_at).toDateString() === new Date().toDateString()).length,
  }), [regs]);

  const exportCSV = () => {
    const header = ["Ticket ID", "Name", "Phone", "Email", "District", "Stream", "Guidance", "Study", "Parent", "Checked In", "Checked In At", "Registered At"];
    const rows = filtered.map((r) => [
      r.ticket_id, r.name, r.phone, r.email ?? "", r.district,
      r.stream ?? "", r.guidance ?? "", r.study_location ?? "",
      r.parent_attending == null ? "" : r.parent_attending ? "Yes" : "No",
      r.checked_in ? "Yes" : "No",
      r.checked_in_at ? new Date(r.checked_in_at).toISOString() : "",
      new Date(r.created_at).toISOString(),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eduvo-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleCheckIn = async (r: Reg) => {
    const next = !r.checked_in;
    const patch = { checked_in: next, checked_in_at: next ? new Date().toISOString() : null };
    const { error } = await supabase.from("expo_registrations").update(patch).eq("id", r.id);
    if (!error) setRegs((prev) => prev.map((x) => x.id === r.id ? { ...x, ...patch } : x));
  };

  const extractTicketId = (raw: string): string | null => {
    const t = raw.trim();
    // Accept either a raw ticket id or a URL containing /ticket/<id>
    const m = t.match(/ticket\/([A-Z0-9-]+)/i);
    if (m) return m[1].toUpperCase();
    if (/^EXPO-\d{4}-[A-Z0-9]+$/i.test(t)) return t.toUpperCase();
    return null;
  };

  const handleScan = useCallback(async (raw: string) => {
    if (busyScan) return;
    const ticketId = extractTicketId(raw);
    if (!ticketId) {
      setToast({ kind: "err", msg: "Unrecognised QR. Expected an Eduvo ticket." });
      return;
    }
    setBusyScan(true);
    const { data, error } = await supabase
      .from("expo_registrations")
      .select("*")
      .eq("ticket_id", ticketId)
      .maybeSingle();
    if (error || !data) {
      setBusyScan(false);
      setToast({ kind: "err", msg: `Ticket ${ticketId} not found.` });
      return;
    }
    const r = data as Reg;
    if (r.checked_in) {
      setBusyScan(false);
      const at = r.checked_in_at ? new Date(r.checked_in_at).toLocaleString() : "earlier";
      setToast({ kind: "warn", msg: `${r.name} already checked in at ${at}.` });
      return;
    }
    const now = new Date().toISOString();
    const { error: upErr } = await supabase
      .from("expo_registrations")
      .update({ checked_in: true, checked_in_at: now })
      .eq("id", r.id);
    setBusyScan(false);
    if (upErr) { setToast({ kind: "err", msg: upErr.message }); return; }
    setRegs((prev) => prev.map((x) => x.id === r.id ? { ...x, checked_in: true, checked_in_at: now } : x));
    setToast({ kind: "ok", msg: `Checked in: ${r.name} (${ticketId}).` });
    setScanOpen(false);
  }, [busyScan]);


  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  if (loading || isAdmin === null) {
    return <div className="py-24 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <section className="py-20">
        <div className="max-w-md mx-auto glass rounded-3xl p-10 text-center">
          <ShieldAlert className="w-10 h-10 text-primary mx-auto" />
          <h1 className="mt-4 font-display text-2xl">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account ({user?.email}) doesn't have admin access yet. Open the
            backend dashboard and add a row to <span className="font-mono">user_roles</span> with
            your user id and role <span className="font-mono">admin</span>.
          </p>
          <button onClick={signOut} className="mt-6 px-5 py-2.5 rounded-xl glass hover:glass-gold text-sm">
            Sign out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.3em] text-gradient-gold">Admin</span>
            <h1 className="font-display text-4xl">Expo Registrations</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-gold text-primary-foreground text-sm font-semibold shadow-glow">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={signOut} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass hover:glass-gold text-sm">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Stat icon={Users} label="Total registrations" value={stats.total} />
          <Stat icon={TicketCheck} label="Checked in" value={stats.checkedIn} />
          <Stat icon={Calendar} label="Today" value={stats.today} />
        </div>

        <div className="mt-8 glass rounded-2xl p-4 sm:p-6">
          <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, phone, ticket, district…"
              className="bg-transparent w-full outline-none text-sm"
            />
            <span className="text-xs text-muted-foreground">{filtered.length} / {regs.length}</span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/40">
                  <th className="py-3 pr-3">Ticket</th>
                  <th className="py-3 pr-3">Name</th>
                  <th className="py-3 pr-3">Phone</th>
                  <th className="py-3 pr-3">District</th>
                  <th className="py-3 pr-3">Stream</th>
                  <th className="py-3 pr-3">Guidance</th>
                  <th className="py-3 pr-3">Study</th>
                  <th className="py-3 pr-3">Parent</th>
                  <th className="py-3 pr-3">When</th>
                  <th className="py-3 pr-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {fetching && (
                  <tr><td colSpan={10} className="py-10 text-center text-muted-foreground">Loading registrations…</td></tr>
                )}
                {!fetching && filtered.length === 0 && (
                  <tr><td colSpan={10} className="py-10 text-center text-muted-foreground">No registrations match.</td></tr>
                )}
                {filtered.map((r) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-border/20 hover:bg-primary/5"
                  >
                    <td className="py-3 pr-3 font-mono text-xs">
                      <Link to="/ticket/$ticketId" params={{ ticketId: r.ticket_id }} className="text-primary hover:text-gold-soft">
                        {r.ticket_id}
                      </Link>
                    </td>
                    <td className="py-3 pr-3">{r.name}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{r.phone}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{r.district}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{r.stream ?? "—"}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{r.guidance ?? "—"}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{r.study_location ?? "—"}</td>
                    <td className="py-3 pr-3 text-muted-foreground">{r.parent_attending == null ? "—" : r.parent_attending ? "Yes" : "No"}</td>
                    <td className="py-3 pr-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="py-3 pr-3">
                      <button
                        onClick={() => toggleCheckIn(r)}
                        className={`text-xs px-2.5 py-1 rounded-md transition ${
                          r.checked_in ? "glass-gold text-foreground" : "glass text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {r.checked_in ? "Checked in" : "Mark in"}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl glass-gold flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <div className="font-display text-3xl text-gradient-gold">{value.toLocaleString()}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
