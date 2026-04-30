import { useMemo, useState } from "react";
import { Search, Menu, Sparkles } from "lucide-react";
import { HeroCarousel } from "@/components/HeroCarousel";
import { CategoryScroller } from "@/components/CategoryScroller";
import { ProductCard } from "@/components/ProductCard";
import { OrnamentFooter } from "@/components/OrnamentFooter";
import { SideMenu } from "@/components/SideMenu";
import { CodeDialog } from "@/components/CodeDialog";
import { AdminPanel } from "@/components/AdminPanel";
import { useShopData } from "@/hooks/useShopData";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const { products, setProducts, slides, setSlides, categories, setCategories } = useShopData();
  const [activeCat, setActiveCat] = useState("all");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  const filtered = useMemo(() => {
    let list = activeCat === "all" ? products : products.filter((p) => p.category === activeCat);
    if (query.trim()) list = list.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [products, activeCat, query]);

  const activeCatName = categories.find((c) => c.id === activeCat)?.name ?? "Товары";

  return (
    <div className="relative min-h-screen">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-30 border-b border-border/30 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-full border border-border/60 p-2 text-foreground transition hover:border-primary/50 hover:text-primary"
            aria-label="Меню"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-display text-base font-bold tracking-wide text-gradient-gold">
              Uighur Shop
            </span>
          </div>
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full border border-border/60 p-2 text-muted-foreground transition hover:border-primary/50 hover:text-primary"
            aria-label="Поиск"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md pt-14">
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
                  className="h-12 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm outline-none transition focus:border-primary"
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
            <div className="rounded-2xl border border-dashed border-border/60 py-16 text-center text-sm text-muted-foreground">
              Ничего не найдено
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>

        <OrnamentFooter onSecretClick={() => setShowCodeDialog(true)} />
      </main>

      <SideMenu
        open={menuOpen}
        onOpenChange={setMenuOpen}
        categories={categories}
        active={activeCat}
        onSelect={setActiveCat}
        onSearchClick={() => setSearchOpen(true)}
      />

      <CodeDialog
        open={showCodeDialog}
        onOpenChange={setShowCodeDialog}
        onSuccess={() => {
          setShowCodeDialog(false);
          setShowAdmin(true);
          toast({ title: "Доступ разрешён", description: "Добро пожаловать в админ-панель" });
        }}
      />

      <AdminPanel
        open={showAdmin}
        onOpenChange={setShowAdmin}
        products={products}
        setProducts={setProducts}
        slides={slides}
        setSlides={setSlides}
        categories={categories}
        setCategories={setCategories}
      />
    </div>
  );
};

export default Index;
