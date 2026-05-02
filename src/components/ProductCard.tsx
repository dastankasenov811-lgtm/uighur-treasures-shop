import { ShoppingBag, Layers } from "lucide-react";
import type { Product } from "@/data/shop";
import { WHATSAPP_PHONE } from "@/data/shop";

interface Props {
  product: Product;
  index?: number;
  onOpen?: (product: Product) => void;
}

const formatPrice = (p: number) => new Intl.NumberFormat("ru-RU").format(p) + " ₸";

export function ProductCard({ product, index = 0, onOpen }: Props) {
  const isDetailed = product.product_type === "detailed";

  const orderViaWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Здравствуйте! Хочу заказать:\n\n• ${product.name}\n• Цена: ${formatPrice(product.price)}\n\nСпасибо!`;
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = () => {
    if (isDetailed && onOpen) onOpen(product);
  };

  return (
    <article
      onClick={handleCardClick}
      className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-elevated animate-fade-in ${
        isDetailed ? "cursor-pointer" : ""
      }`}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
        {isDetailed && (
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-[10px] font-medium text-primary backdrop-blur">
            <Layers className="h-3 w-3" />
            Подробнее
          </div>
        )}
      </div>

      <div className="relative space-y-3 p-3.5">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-gradient-gold">
            {formatPrice(product.price)}
          </span>
        </div>
        {isDetailed ? (
          <button
            onClick={(e) => { e.stopPropagation(); onOpen?.(product); }}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-background/40 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary/10 active:scale-95"
          >
            <Layers className="h-4 w-4" />
            Открыть
          </button>
        ) : (
          <button
            onClick={orderViaWhatsApp}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-gold py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-gold active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
            Заказать
          </button>
        )}
      </div>
    </article>
  );
}
