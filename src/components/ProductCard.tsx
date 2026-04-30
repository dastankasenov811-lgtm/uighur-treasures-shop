import { ShoppingBag } from "lucide-react";
import type { Product } from "@/data/shop";
import { WHATSAPP_PHONE } from "@/data/shop";

interface Props { product: Product; index?: number; }

const formatPrice = (p: number) => new Intl.NumberFormat("ru-RU").format(p) + " ₸";

export function ProductCard({ product, index = 0 }: Props) {
  const orderViaWhatsApp = () => {
    const text = `Здравствуйте! Хочу заказать:\n\n• ${product.name}\n• Цена: ${formatPrice(product.price)}\n\nСпасибо!`;
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card shadow-card transition-all duration-500 hover:-translate-y-1 hover:border-primary/50 hover:shadow-elevated animate-fade-in"
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
        <button
          onClick={orderViaWhatsApp}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-gold py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-gold active:scale-95"
        >
          <ShoppingBag className="h-4 w-4" />
          Заказать
        </button>
      </div>
    </article>
  );
}
