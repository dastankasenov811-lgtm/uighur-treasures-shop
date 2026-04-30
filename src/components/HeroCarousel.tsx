import { useEffect, useRef, useState } from "react";
import type { Slide } from "@/data/shop";

interface Props { slides: Slide[]; }

export function HeroCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef<number | null>(null);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  // Sync programmatic index → scroll position
  useEffect(() => {
    const el = trackRef.current;
    if (!el || isUserScrolling.current) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, [index]);

  // Sync swipe → index
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    isUserScrolling.current = true;
    if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current);
    scrollTimeout.current = window.setTimeout(() => {
      const slideW = el.clientWidth;
      const i = Math.round(el.scrollLeft / slideW);
      setIndex(i);
      isUserScrolling.current = false;
    }, 120);
  };

  if (!slides.length) return null;

  return (
    <section className="relative px-4 pt-4">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="relative w-full shrink-0 snap-center"
            style={{ scrollSnapAlign: "center" }}
          >
            <div className="relative h-[230px] overflow-hidden rounded-3xl border border-primary/20 shadow-elevated">
              <img
                src={s.image}
                alt={s.title}
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <span className="inline-block rounded-full border border-primary/40 bg-background/50 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-primary backdrop-blur-md">
                  Uighur Shop
                </span>
                <h2 className="mt-2 font-display text-xl font-bold leading-tight text-foreground">
                  {s.title}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{s.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Слайд ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? "w-6 bg-primary shadow-gold" : "w-1.5 bg-foreground/25"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
