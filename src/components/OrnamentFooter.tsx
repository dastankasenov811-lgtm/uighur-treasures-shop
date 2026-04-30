interface Props {
  onSecretClick?: () => void;
}

export function OrnamentFooter({ onSecretClick }: Props) {
  return (
    <footer className="relative mt-12">
      <div className="relative bg-[hsl(var(--deep-bg))] py-8 text-center">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-primary/80">
          Uighur Shop
        </p>
        <h3 className="mt-2 font-display text-xl font-bold text-gradient-gold">
          Искусство востока
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-xs text-muted-foreground">
          Каждое изделие — наследие культуры
        </p>

        <button
          onClick={onSecretClick}
          className="mt-6 font-display text-[11px] uppercase tracking-[0.35em] text-muted-foreground/40 transition hover:text-primary/70"
        >
          · Uighur Shop ·
        </button>
        <p className="mt-1 text-[10px] text-muted-foreground/30">
          © {new Date().getFullYear()} Все права защищены
        </p>
      </div>
    </footer>
  );
}
