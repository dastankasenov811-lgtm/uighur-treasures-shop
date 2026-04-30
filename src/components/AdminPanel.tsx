import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon, X } from "lucide-react";
import type { Product, Slide, Category } from "@/data/shop";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  products: Product[];
  setProducts: (p: Product[]) => void;
  slides: Slide[];
  setSlides: (s: Slide[]) => void;
  categories: Category[];
  setCategories: (c: Category[]) => void;
}

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

export function AdminPanel({ open, onOpenChange, products, setProducts, slides, setSlides, categories, setCategories }: Props) {
  const [tab, setTab] = useState<"products" | "slides" | "categories">("products");

  const editableCats = categories.filter((c) => c.id !== "all");
  const firstCat = editableCats[0]?.id ?? "";

  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState(firstCat);
  const [pImage, setPImage] = useState("");

  const [sTitle, setSTitle] = useState("");
  const [sSubtitle, setSSubtitle] = useState("");
  const [sImage, setSImage] = useState("");

  const [cName, setCName] = useState("");
  const [cEmoji, setCEmoji] = useState("✦");

  const addProduct = () => {
    if (!pName || !pPrice || !pImage) return;
    setProducts([{ id: Date.now().toString(), name: pName, price: Number(pPrice), image: pImage, category: pCategory || firstCat }, ...products]);
    setPName(""); setPPrice(""); setPImage("");
  };
  const removeProduct = (id: string) => setProducts(products.filter((p) => p.id !== id));

  const addSlide = () => {
    if (!sTitle || !sImage) return;
    setSlides([...slides, { id: Date.now().toString(), title: sTitle, subtitle: sSubtitle, image: sImage }]);
    setSTitle(""); setSSubtitle(""); setSImage("");
  };
  const removeSlide = (id: string) => setSlides(slides.filter((s) => s.id !== id));

  const addCategory = () => {
    if (!cName.trim()) return;
    const id = cName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-я0-9-]/gi, "") + "-" + Date.now().toString(36);
    setCategories([...categories, { id, name: cName.trim(), emoji: cEmoji || "✦" }]);
    setCName(""); setCEmoji("✦");
  };
  const removeCategory = (id: string) => {
    if (id === "all") return;
    setCategories(categories.filter((c) => c.id !== id));
    setProducts(products.filter((p) => p.category !== id));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] overflow-y-auto rounded-t-3xl border-border/60 bg-background p-0">
        <SheetHeader className="sticky top-0 z-10 border-b border-border/50 bg-background/95 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-xl text-gradient-gold">Админ-панель</SheetTitle>
            <button onClick={() => onOpenChange(false)} className="rounded-full p-1.5 hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex gap-1 rounded-full bg-muted p-1">
            {(["products", "categories", "slides"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-full py-2 text-xs font-medium transition-all ${
                  tab === t ? "bg-gradient-gold text-primary-foreground shadow-gold" : "text-muted-foreground"
                }`}
              >
                {t === "products" ? "Товары" : t === "categories" ? "Категории" : "Слайды"}
              </button>
            ))}
          </div>
        </SheetHeader>

        <div className="px-5 py-5">
          {tab === "products" && (
            <div className="space-y-6">
              <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-4">
                <h3 className="font-display text-lg">Новый товар</h3>
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input value={pName} onChange={(e) => setPName(e.target.value)} placeholder="Шёлковый халат" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Цена (₸)</Label>
                    <Input type="number" value={pPrice} onChange={(e) => setPPrice(e.target.value)} placeholder="28000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Категория</Label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {editableCats.map((c) => (
                        <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Фото</Label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 py-6 text-sm text-muted-foreground hover:border-primary/50">
                    <ImageIcon className="h-4 w-4" />
                    {pImage ? "Фото загружено ✓" : "Загрузить фото"}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={async (e) => { const f = e.target.files?.[0]; if (f) setPImage(await fileToDataUrl(f)); }} />
                  </label>
                </div>
                <Button onClick={addProduct} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
                  <Plus className="mr-1 h-4 w-4" /> Добавить
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-lg">Текущие товары ({products.length})</h3>
                {products.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-2.5">
                    <img src={p.image} alt={p.name} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-primary">{p.price.toLocaleString("ru-RU")} ₸</p>
                    </div>
                    <button onClick={() => removeProduct(p.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "categories" && (
            <div className="space-y-6">
              <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-4">
                <h3 className="font-display text-lg">Новая категория</h3>
                <div className="grid grid-cols-[80px_1fr] gap-2">
                  <div className="space-y-2">
                    <Label>Эмодзи</Label>
                    <Input value={cEmoji} onChange={(e) => setCEmoji(e.target.value)} placeholder="👘" maxLength={2} className="text-center text-lg" />
                  </div>
                  <div className="space-y-2">
                    <Label>Название</Label>
                    <Input value={cName} onChange={(e) => setCName(e.target.value)} placeholder="Обувь" />
                  </div>
                </div>
                <Button onClick={addCategory} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
                  <Plus className="mr-1 h-4 w-4" /> Добавить категорию
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-lg">Категории ({editableCats.length})</h3>
                {editableCats.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
                    <span className="text-2xl">{c.emoji}</span>
                    <p className="flex-1 text-sm font-medium">{c.name}</p>
                    <button onClick={() => removeCategory(c.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "slides" && (
            <div className="space-y-6">
              <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-4">
                <h3 className="font-display text-lg">Новый слайд</h3>
                <div className="space-y-2">
                  <Label>Заголовок</Label>
                  <Input value={sTitle} onChange={(e) => setSTitle(e.target.value)} placeholder="Скидки недели" />
                </div>
                <div className="space-y-2">
                  <Label>Подзаголовок</Label>
                  <Input value={sSubtitle} onChange={(e) => setSSubtitle(e.target.value)} placeholder="До -30% на всё" />
                </div>
                <div className="space-y-2">
                  <Label>Фото</Label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 py-6 text-sm text-muted-foreground hover:border-primary/50">
                    <ImageIcon className="h-4 w-4" />
                    {sImage ? "Фото загружено ✓" : "Загрузить фото"}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={async (e) => { const f = e.target.files?.[0]; if (f) setSImage(await fileToDataUrl(f)); }} />
                  </label>
                </div>
                <Button onClick={addSlide} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
                  <Plus className="mr-1 h-4 w-4" /> Добавить слайд
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-lg">Слайды ({slides.length})</h3>
                {slides.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-2.5">
                    <img src={s.image} alt={s.title} className="h-14 w-20 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{s.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{s.subtitle}</p>
                    </div>
                    <button onClick={() => removeSlide(s.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
