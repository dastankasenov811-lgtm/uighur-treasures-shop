import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X, Phone, Search } from "lucide-react";
import type { Category } from "@/data/shop";
import ornament from "@/assets/uyghur-ornament-full.jpg";
import { WHATSAPP_PHONE } from "@/data/shop";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categories: Category[];
  active: string;
  onSelect: (id: string) => void;
  onSearchClick: () => void;
}

export function SideMenu({ open, onOpenChange, categories, active, onSelect, onSearchClick }: Props) {
  const pick = (id: string) => {
    onSelect(id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[85vw] max-w-sm overflow-hidden border-r-border/50 bg-background p-0"
      >
        {/* Darkened ornament background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${ornament})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-background/82" />
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-background/70 via-background/40 to-background/85" />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
            <div>
              <p className="font-display text-[10px] uppercase tracking-[0.4em] text-primary/80">Меню</p>
              <h2 className="font-display text-2xl font-bold text-gradient-gold">Uighur Shop</h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full border border-border/50 p-2 text-muted-foreground hover:border-primary/50 hover:text-primary"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <p className="px-3 pb-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
              Категории
            </p>
            <div className="space-y-1.5">
              {categories.map((c) => {
                const isActive = c.id === active;
                return (
                  <button
                    key={c.id}
                    onClick={() => pick(c.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all ${
                      isActive
                        ? "bg-gradient-gold text-primary-foreground shadow-gold"
                        : "border border-border/30 bg-card/40 text-foreground hover:border-primary/40 hover:bg-card/70"
                    }`}
                  >
                    <span className="text-xl">{c.emoji}</span>
                    <span className="flex-1 font-medium">{c.name}</span>
                    <span className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground/60"}`}>›</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 border-t border-border/40 p-4">
            <button
              onClick={() => { onSearchClick(); onOpenChange(false); }}
              className="flex w-full items-center gap-3 rounded-xl border border-border/40 bg-card/40 px-4 py-3 text-sm text-foreground hover:border-primary/40"
            >
              <Search className="h-4 w-4 text-primary" />
              Поиск товаров
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-xl bg-gradient-gold px-4 py-3 text-sm font-semibold text-primary-foreground shadow-gold"
            >
              <Phone className="h-4 w-4" />
              Связаться с нами
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
