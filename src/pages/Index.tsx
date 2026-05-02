import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryScroller } from "@/components/CategoryScroller";
import { ProductCard } from "@/components/ProductCard";
import { OrnamentFooter } from "@/components/OrnamentFooter";
import { CodeDialog } from "@/components/CodeDialog";
import { AdminPanel } from "@/components/AdminPanel";
import { ProductDetail } from "@/components/ProductDetail";
import { useShopData } from "@/hooks/useShopData";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/data/shop";
import singersBg from "@/assets/hero-singers.jpg";
import ornamentBg from "@/assets/uyghur-ornament-full.jpg";

const Index = () => {
  const { products, slides, categories, reload } = useShopData();
  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [openProduct, setOpenProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let list = activeCat === "all" ? products : products.filter((p) => p.category === activeCat);
    if (query.trim()) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [products, activeCat, query]);

  const activeCatName = categories.find((c) => c.id === activeCat)?.name ?? "Товары";

  return (
    <div className="relative min-h-screen">
      {/* === LAYERED PAGE BACKGROUND === */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Singers — top region (behind hero carousel area) */}
        <div
          className="absolute inset-x-0 top-0 h-[420px]"
          style={{
            backgroundImage: `url(${singersBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-background/40 via-background/60 to-background" />

        {/* Ornament — from carousel area down to footer */}
        <div
          className="absolute inset-x-0 top-[380px] bottom-0"
          style={{
            backgroundImage: `url(${ornamentBg})`,
            backgroundSize: "420px auto",
            backgroundRepeat: "repeat",
          }}
        />
        {/* Darken ornament */}
        <div className="absolute inset-x-0 top-[380px] bottom-0 bg-background/80" />
        {/* Smooth blend at top of ornament */}
        <div className="absolute inset-x-0 top-[360px] h-24 bg-gradient-to-b from-background to-transparent" />
      </div>

      {/* === TOP BAR (no menu button) === */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-border/30 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-display text-base font-bold tracking-wide text-gradient-gold">
              Uighur Shop
            </span>
          </div>
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full border border-border/60 bg-background/40 p-2 text-muted-foreground backdrop-blur transition hover:border-primary/50 hover:text-primary"
            aria-label="Поиск"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-md pt-14">
        <HeroCarousel slides={slides} />

        <div className="px-4">
          {searchOpen && (
            <div className="pt-5 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Поиск товаров..."
                  className="h-12 w-full rounded-xl border border-border bg-card/80 pl-10 pr-4 text-sm outline-none backdrop-blur transition focus:border-primary"
                />
              </div>
            </div>
          )}

          <CategoryScroller categories={categories} active={activeCat} onChange={setActiveCat} />

          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-bold">{activeCatName}</h2>
            <span className="text-xs text-muted-foreground">{filtered.length} товаров</span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-background/40 py-16 text-center text-sm text-muted-foreground backdrop-blur">
              Ничего не найдено
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onOpen={setOpenProduct} />
              ))}
            </div>
          )}
        </div>

        <OrnamentFooter onSecretClick={() => setShowCodeDialog(true)} />
      </main>

      <CodeDialog
        open={showCodeDialog}
        onOpenChange={setShowCodeDialog}
        onSuccess={(code) => {
          setAdminCode(code);
          setShowCodeDialog(false);
          setShowAdmin(true);
          toast({ title: "Доступ разрешён", description: "Добро пожаловать в админ-панель" });
        }}
      />

      <AdminPanel
        open={showAdmin}
        onOpenChange={setShowAdmin}
        adminCode={adminCode}
        products={products}
        slides={slides}
        categories={categories}
        onChanged={reload}
      />

      <ProductDetail product={openProduct} onClose={() => setOpenProduct(null)} />
    </div>
  );
};

export default Index;
