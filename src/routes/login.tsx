import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogIn, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Eduvo Careers" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { setError(error.message); return; }
    navigate({ to: "/admin" });
  };

  return (
    <section className="py-20">
      <div className="max-w-md mx-auto px-4">
        <div className="glass rounded-3xl p-8 sm:p-10 shadow-elevated">
          <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
            <LogIn className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="mt-5 font-display text-3xl">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access the Eduvo admin dashboard.</p>

          <form onSubmit={submit} className="mt-7 space-y-4">
            <Field label="Email">
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input" required />
            </Field>
            <Field label="Password">
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={6} className="input" required />
            </Field>
            {error && (
              <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
              </div>
            )}
            <button
              disabled={busy}
              className="w-full px-5 py-3 rounded-xl bg-gradient-gold text-primary-foreground font-semibold shadow-glow disabled:opacity-50"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-5 text-xs text-muted-foreground">
            No account? <Link to="/signup" className="text-primary">Create one</Link>
          </p>
        </div>
      </div>
      <style>{`
        .input { width:100%; background: oklch(0.18 0.05 260 / 0.6); border:1px solid oklch(0.78 0.15 85 / 0.18); color: var(--color-foreground); padding: 0.75rem 1rem; border-radius: 0.75rem; font-size:0.875rem; outline:none; }
        .input:focus { border-color: oklch(0.78 0.15 85 / 0.6); }
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
