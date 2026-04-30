import { Home, Search, Phone, Settings } from "lucide-react";

interface Props {
  active: "home" | "search" | "contact" | "system";
  onChange: (key: "home" | "search" | "contact" | "system") => void;
}

const items = [
  { key: "home" as const, icon: Home, label: "Главная" },
  { key: "search" as const, icon: Search, label: "Поиск" },
  { key: "contact" as const, icon: Phone, label: "Контакты" },
  { key: "system" as const, icon: Settings, label: "Система" },
];

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {items.map(({ key, icon: Icon, label }) => {
          const isActive = active === key;
          const isSystem = key === "system";
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 transition-all duration-300 ${
                isActive ? "text-primary" : isSystem ? "text-muted-foreground/40" : "text-muted-foreground"
              }`}
              aria-label={label}
            >
              <Icon className={`h-5 w-5 transition-transform ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
