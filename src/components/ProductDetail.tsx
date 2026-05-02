import { useEffect, useMemo, useState } from "react";
import { X, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/shop";
import { WHATSAPP_PHONE } from "@/data/shop";

interface Props {
  product: Product | null;
  onClose: () => void;
}

const formatPrice = (p: number) => new Intl.NumberFormat("ru-RU").format(p) + " ₸";

export function ProductDetail({ product, onClose }: Props) {
  const [variantId, setVariantId] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  // Список всех фото: основное + дополнительные
  const gallery = useMemo(() => {
    if (!product) return [];
    const arr = [product.image, ...(product.images ?? [])].filter(Boolean);
    return Array.from(new Set(arr));
  }, [product]);

  // Сброс при смене товара
  useEffect(() => {
    setVariantId(null);
    setImgIdx(0);
  }, [product?.id]);

  // Блокировка скролла body
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [product]);

  if (!product) return null;

  const activeVariant = product.variants?.find((v) => v.id === variantId) ?? null;
  const currentPrice = activeVariant?.price ?? product.price;
  const displayImage =
    activeVariant?.image
      ? activeVariant.image
      : gallery[imgIdx] ?? product.image;

  const order = () => {
    const variantLine = activeVariant ? `\n• Вариант: ${activeVariant.label}` : "";
    const text = `Здравствуйте! Хочу заказать:\n\n• ${product.name}${variantLine}\n• Цена: ${formatPrice(currentPrice)}\n\nСпасибо!`;
    window.open(
      `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const prev = () => setImgIdx((i) => (i - 1 + gallery.length) % gallery.length);
  const next = () => setImgIdx((i) => (i + 1) % gallery.length);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-background animate-fade-in">
      {/* Top bar */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur-xl">
        <button
          onClick={onClose}
          className="rounded-full p-2 text-foreground hover:bg-muted"
          aria-label="Закрыть"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-display text-sm text-muted-foreground">Товар</span>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-foreground hover:bg-muted"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div className="mx-auto max-w-md pb-32">
        {/* Gallery */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={displayImage}
            alt={product.name}
            className="h-full w-full object-cover"
          />
          {!activeVariant?.image && gallery.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground backdrop-blur hover:bg-background"
                aria-label="Предыдущее"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground backdrop-blur hover:bg-background"
                aria-label="Следующее"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {gallery.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === imgIdx ? "w-6 bg-primary" : "w-1.5 bg-foreground/40"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {!activeVariant?.image && gallery.length > 1 && (
          <div className="flex gap-2 overflow-x-auto px-4 py-3">
            {gallery.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setImgIdx(i)}
                className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                  i === imgIdx ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={src} alt="" className="h-16 w-16 object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="space-y-6 px-5 pt-4">
          {/* Name + price */}
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold leading-tight">{product.name}</h1>
            <p className="font-display text-3xl font-bold text-gradient-gold">
              {formatPrice(currentPrice)}
            </p>
          </div>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Выберите вариант</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const active = v.id === variantId;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVariantId(active ? null : v.id)}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      }`}
                    >
                      {v.label}
                      {v.price != null && v.price !== product.price && (
                        <span className="ml-1.5 text-xs text-muted-foreground">
                          {formatPrice(v.price)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Описание</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {product.description}
              </p>
            </div>
          )}

          {/* Attributes */}
          {product.attributes?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Характеристики</h3>
              <dl className="overflow-hidden rounded-xl border border-border/60 bg-card">
                {product.attributes.map((a, i) => (
                  <div
                    key={i}
                    className="flex justify-between gap-4 border-b border-border/40 px-4 py-2.5 last:border-0"
                  >
                    <dt className="text-sm text-muted-foreground">{a.name}</dt>
                    <dd className="text-sm font-medium text-foreground text-right">{a.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-border/40 bg-background/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto max-w-md">
          <button
            onClick={order}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-gold py-3.5 text-base font-semibold text-primary-foreground transition-all hover:shadow-gold active:scale-95"
          >
            <ShoppingBag className="h-5 w-5" />
            Заказать через WhatsApp · {formatPrice(currentPrice)}
          </button>
        </div>
      </div>
    </div>
  );
}
