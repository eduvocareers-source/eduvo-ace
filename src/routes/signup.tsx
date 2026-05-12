import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Eduvo Careers" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin + "/admin",
        data: { display_name: name.trim() },
      },
    });
    setBusy(false);
    if (error) { setError(error.message); return; }
    // If session is set immediately (auto-confirm enabled), go to admin
    const { data: { session } } = await supabase.auth.getSession();
    if (session) { navigate({ to: "/admin" }); return; }
    setDone(true);
  };

  return (
    <section className="py-20">
      <div className="max-w-md mx-auto px-4">
        <div className="glass rounded-3xl p-8 sm:p-10 shadow-elevated">
          <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="mt-5 font-display text-3xl">Create account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign up to access your dashboard.</p>

          {done ? (
            <div className="mt-6 flex items-start gap-2 text-sm bg-primary/10 border border-primary/30 rounded-lg px-3 py-3">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
              <span>Check your email to verify your account, then sign in.</span>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-7 space-y-4">
              <Field label="Name">
                <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className="input" required />
              </Field>
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
              <button disabled={busy} className="w-full px-5 py-3 rounded-xl bg-gradient-gold text-primary-foreground font-semibold shadow-glow disabled:opacity-50">
                {busy ? "Creating…" : "Create account"}
              </button>
            </form>
          )}

          <p className="mt-5 text-xs text-muted-foreground">
            Have an account? <Link to="/login" className="text-primary">Sign in</Link>
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
