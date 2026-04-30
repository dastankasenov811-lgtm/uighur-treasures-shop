import footerOrnament from "@/assets/uyghur-footer.png";

export function OrnamentFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden">
      {/* Radial gold glow */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial-gold" />

      <div className="relative px-6 pt-12 pb-6 text-center">
        <p className="font-display text-xs uppercase tracking-[0.4em] text-primary/80">
          Uighur Shop
        </p>
        <h3 className="mt-3 font-display text-2xl font-bold text-gradient-gold">
          Вкус древних традиций
        </h3>
        <p className="mx-auto mt-2 max-w-xs text-xs text-muted-foreground">
          Каждый продукт — наследие культуры, проверенное временем
        </p>
      </div>

      {/* Full-width ornament */}
      <div className="relative w-full">
        <img
          src={footerOrnament}
          alt=""
          aria-hidden
          loading="lazy"
          className="block w-full select-none opacity-90"
          style={{
            filter: "drop-shadow(0 -8px 30px hsl(38 80% 50% / 0.3))",
          }}
        />
      </div>

      <div className="relative bg-[hsl(var(--deep-bg))] py-5 text-center text-[11px] text-muted-foreground/70">
        © {new Date().getFullYear()} Uighur Shop · Все права защищены
      </div>
    </footer>
  );
}
