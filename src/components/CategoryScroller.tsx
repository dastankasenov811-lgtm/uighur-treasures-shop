import type { Category } from "@/data/shop";

interface Props {
  categories: Category[];
  active: string;
  onChange: (id: string) => void;
}

export function CategoryScroller({ categories, active, onChange }: Props) {
  return (
    <div className="no-scrollbar -mx-4 overflow-x-auto px-4 py-4">
      <div className="flex gap-2.5">
        {categories.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "border-primary bg-gradient-gold text-primary-foreground shadow-gold scale-105"
                  : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <span className="text-base">{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
