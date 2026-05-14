import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { X, Camera, AlertCircle } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onScan: (text: string) => void;
};

export function QrScanner({ open, onClose, onScan }: Props) {
  const elId = "qr-reader-region";
  const ref = useRef<Html5Qrcode | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setErr(null);
    setLast(null);
    let cancelled = false;

    const start = async () => {
      try {
        const scanner = new Html5Qrcode(elId, { verbose: false });
        ref.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 12, qrbox: { width: 260, height: 260 } },
          (decoded) => {
            if (cancelled) return;
            setLast(decoded);
            onScan(decoded);
          },
          () => { /* ignore frame decode errors */ }
        );
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unable to start camera";
        setErr(msg);
      }
    };
    start();

    return () => {
      cancelled = true;
      const s = ref.current;
      ref.current = null;
      if (s) {
        s.stop().catch(() => undefined).finally(() => {
          try { s.clear(); } catch { /* noop */ }
        });
      }
    };
  }, [open, onScan]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass rounded-3xl w-full max-w-md p-5 shadow-elevated">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-primary" />
            <h3 className="font-display text-lg">Scan ticket QR</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass hover:glass-gold flex items-center justify-center" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div id={elId} className="mt-4 rounded-2xl overflow-hidden bg-black/40 aspect-square" />

        {err && (
          <div className="mt-4 flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {err}
          </div>
        )}
        {last && !err && (
          <p className="mt-3 text-xs text-muted-foreground truncate">Last: <span className="font-mono text-foreground">{last}</span></p>
        )}
        <p className="mt-3 text-[11px] text-muted-foreground">Allow camera access. Scanner closes after each successful check-in.</p>
      </div>
    </div>
  );
}
