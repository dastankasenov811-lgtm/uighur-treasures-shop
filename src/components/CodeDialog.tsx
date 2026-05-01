import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: (code: string) => void;
}

export function CodeDialog({ open, onOpenChange, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error: err } = await supabase.functions.invoke("admin-shop", {
      body: { code, action: "verify" },
    });
    setLoading(false);
    if (!err && data?.ok) {
      onSuccess(code);
      setCode("");
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 600);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) { setCode(""); setError(false); } }}>
      <DialogContent className="border-border/60 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold shadow-gold">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <DialogTitle className="text-center font-display text-2xl">Системный доступ</DialogTitle>
          <DialogDescription className="text-center">
            Введите код для входа в админ-панель
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4 pt-2">
          <Input
            type="password"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="• • • •"
            autoFocus
            className={`h-14 text-center font-display text-2xl tracking-[0.5em] ${error ? "border-destructive animate-pulse" : ""}`}
          />
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold py-3 font-semibold text-primary-foreground transition-all hover:shadow-gold active:scale-95 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Войти
          </button>
          {error && <p className="text-center text-sm text-destructive">Неверный код</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}
