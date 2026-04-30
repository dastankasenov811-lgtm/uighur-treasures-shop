import { useEffect, useState } from "react";
import type { Slide } from "@/data/shop";
import singersBg from "@/assets/hero-singers.jpg";

interface Props { slides: Slide[]; }

export function HeroCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <section className="relative">
      {/* Singers background — etched behind everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${singersBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-background/55" />

      <div className="relative z-10 h-[58vh] min-h-[380px] max-h-[560px] overflow-hidden">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-out"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <img
              src={s.image}
              alt={s.title}
              className="h-full w-full object-cover scale-105 opacity-90"
              loading={i === 0 ? "eager" : "lazy"}
            />
            <div className="absolute inset-0 bg-gradient-hero" />
            <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-10 animate-slide-up">
              <span className="inline-block rounded-full border border-primary/40 bg-background/40 px-3 py-1 text-xs uppercase tracking-[0.18em] text-primary backdrop-blur-md">
                Uighur Shop
              </span>
              <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
                {s.title}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Слайд ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-8 bg-primary shadow-gold" : "w-1.5 bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
