import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { ADMIN_CODE } from "@/data/shop";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => void;
}

export function CodeDialog({ open, onOpenChange, onSuccess }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === ADMIN_CODE) {
      setCode("");
      setError(false);
      onSuccess();
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
            className="w-full rounded-xl bg-gradient-gold py-3 font-semibold text-primary-foreground transition-all hover:shadow-gold active:scale-95"
          >
            Войти
          </button>
          {error && <p className="text-center text-sm text-destructive">Неверный код</p>}
        </form>
      </DialogContent>
    </Dialog>
  );
}
