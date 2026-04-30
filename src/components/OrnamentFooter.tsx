import footerOrnament from "@/assets/uyghur-ornament-full.jpg";

interface Props {
  onSecretClick?: () => void;
}

export function OrnamentFooter({ onSecretClick }: Props) {
  return (
    <footer className="relative mt-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial-gold" />

      <div className="relative px-6 pt-12 pb-6 text-center">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-primary/80">
          Uighur Shop
        </p>
        <h3 className="mt-3 font-display text-2xl font-bold text-gradient-gold">
          Искусство востока
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-xs text-muted-foreground">
          Каждое изделие — наследие культуры, рождённое из традиций
        </p>
      </div>

      {/* Full-width Uyghur ornament */}
      <div className="relative w-full">
        <img
          src={footerOrnament}
          alt=""
          aria-hidden
          loading="lazy"
          className="block w-full select-none"
          style={{
            filter: "drop-shadow(0 -8px 30px hsl(38 80% 50% / 0.25)) brightness(0.95)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/30" />
      </div>

      <div className="relative bg-[hsl(var(--deep-bg))] py-6 text-center">
        {/* Hidden admin entry — disguised as brand mark */}
        <button
          onClick={onSecretClick}
          className="font-display text-[11px] uppercase tracking-[0.35em] text-muted-foreground/50 transition hover:text-primary/80"
        >
          · Uighur Shop ·
        </button>
        <p className="mt-1 text-[10px] text-muted-foreground/40">
          © {new Date().getFullYear()} Все права защищены
        </p>
      </div>
    </footer>
  );
}
