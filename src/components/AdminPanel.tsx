import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Product, Slide, Category, Variant, Attribute } from "@/data/shop";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  adminCode: string;
  products: Product[];
  slides: Slide[];
  categories: Category[];
  onChanged: () => void;
}

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

type VariantDraft = { id: string; label: string; price: string; imageFile: File | null };
type AttrDraft = Attribute;

export function AdminPanel({ open, onOpenChange, adminCode, products, slides, categories, onChanged }: Props) {
  const [tab, setTab] = useState<"products" | "slides" | "categories">("products");
  const [busy, setBusy] = useState(false);

  const editableCats = categories.filter((c) => c.id !== "all");
  const firstCat = editableCats[0]?.id ?? "";

  // ===== Product form =====
  const [pType, setPType] = useState<"simple" | "detailed">("simple");
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pCategory, setPCategory] = useState(firstCat);
  const [pImageFile, setPImageFile] = useState<File | null>(null);
  // detailed-only
  const [pDescription, setPDescription] = useState("");
  const [pGalleryFiles, setPGalleryFiles] = useState<File[]>([]);
  const [pVariants, setPVariants] = useState<VariantDraft[]>([]);
  const [pAttrs, setPAttrs] = useState<AttrDraft[]>([]);

  const resetProductForm = () => {
    setPName(""); setPPrice(""); setPImageFile(null);
    setPDescription(""); setPGalleryFiles([]);
    setPVariants([]); setPAttrs([]);
  };

  // slides / categories
  const [sTitle, setSTitle] = useState("");
  const [sSubtitle, setSSubtitle] = useState("");
  const [sImageFile, setSImageFile] = useState<File | null>(null);
  const [cName, setCName] = useState("");
  const [cEmoji, setCEmoji] = useState("✦");

  const call = async (action: string, payload: unknown) => {
    const { data, error } = await supabase.functions.invoke("admin-shop", {
      body: { code: adminCode, action, payload },
    });
    if (error || (data as { error?: string })?.error) {
      throw new Error((data as { error?: string })?.error ?? error?.message ?? "Ошибка");
    }
    return data as { url?: string; data?: unknown; ok?: boolean };
  };

  const uploadImage = async (file: File, folder: string) => {
    const dataUrl = await fileToDataUrl(file);
    const res = await call("uploadImage", { dataUrl, folder });
    return res.url as string;
  };

  // ===== Add product =====
  const addProduct = async () => {
    if (!pName || !pPrice || !pImageFile) {
      toast({ title: "Заполните название, цену и главное фото", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const mainUrl = await uploadImage(pImageFile, "products");

      let images: string[] = [];
      let variants: Variant[] = [];
      let attributes: Attribute[] = [];
      let description = "";

      if (pType === "detailed") {
        // gallery
        if (pGalleryFiles.length) {
          images = await Promise.all(pGalleryFiles.map((f) => uploadImage(f, "products")));
        }
        // variants
        variants = await Promise.all(
          pVariants
            .filter((v) => v.label.trim())
            .map(async (v) => {
              const out: Variant = { id: v.id, label: v.label.trim() };
              if (v.price.trim()) out.price = Number(v.price);
              if (v.imageFile) out.image = await uploadImage(v.imageFile, "products");
              return out;
            }),
        );
        attributes = pAttrs.filter((a) => a.name.trim() && a.value.trim());
        description = pDescription;
      }

      await call("addProduct", {
        name: pName,
        price: Number(pPrice),
        image: mainUrl,
        category: pCategory || firstCat,
        product_type: pType,
        images,
        description,
        variants,
        attributes,
      });

      resetProductForm();
      toast({ title: pType === "detailed" ? "Расширенный товар добавлен" : "Товар добавлен" });
      onChanged();
    } catch (e) {
      toast({ title: "Ошибка", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const removeProduct = async (id: string) => {
    setBusy(true);
    try { await call("deleteProduct", { id }); onChanged(); }
    catch (e) { toast({ title: "Ошибка", description: (e as Error).message, variant: "destructive" }); }
    finally { setBusy(false); }
  };

  const addSlide = async () => {
    if (!sTitle || !sImageFile) return;
    setBusy(true);
    try {
      const url = await uploadImage(sImageFile, "slides");
      await call("addSlide", { title: sTitle, subtitle: sSubtitle, image: url });
      setSTitle(""); setSSubtitle(""); setSImageFile(null);
      toast({ title: "Слайд добавлен" });
      onChanged();
    } catch (e) { toast({ title: "Ошибка", description: (e as Error).message, variant: "destructive" }); }
    finally { setBusy(false); }
  };

  const removeSlide = async (id: string) => {
    setBusy(true);
    try { await call("deleteSlide", { id }); onChanged(); }
    catch (e) { toast({ title: "Ошибка", description: (e as Error).message, variant: "destructive" }); }
    finally { setBusy(false); }
  };

  const addCategory = async () => {
    if (!cName.trim()) return;
    const id = cName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-я0-9-]/gi, "") + "-" + Date.now().toString(36);
    setBusy(true);
    try {
      await call("addCategory", { id, name: cName.trim(), emoji: cEmoji || "✦" });
      setCName(""); setCEmoji("✦");
      toast({ title: "Категория добавлена" });
      onChanged();
    } catch (e) { toast({ title: "Ошибка", description: (e as Error).message, variant: "destructive" }); }
    finally { setBusy(false); }
  };

  const removeCategory = async (id: string) => {
    if (id === "all") return;
    setBusy(true);
    try { await call("deleteCategory", { id }); onChanged(); }
    catch (e) { toast({ title: "Ошибка", description: (e as Error).message, variant: "destructive" }); }
    finally { setBusy(false); }
  };

  // variant helpers
  const addVariantRow = () =>
    setPVariants((arr) => [...arr, { id: crypto.randomUUID(), label: "", price: "", imageFile: null }]);
  const updateVariant = (id: string, patch: Partial<VariantDraft>) =>
    setPVariants((arr) => arr.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  const removeVariant = (id: string) =>
    setPVariants((arr) => arr.filter((v) => v.id !== id));

  // attribute helpers
  const addAttrRow = () => setPAttrs((arr) => [...arr, { name: "", value: "" }]);
  const updateAttr = (i: number, patch: Partial<AttrDraft>) =>
    setPAttrs((arr) => arr.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  const removeAttr = (i: number) => setPAttrs((arr) => arr.filter((_, idx) => idx !== i));

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

                {/* Type switch */}
                <div className="flex gap-1 rounded-xl bg-muted p-1">
                  <button
                    type="button"
                    onClick={() => setPType("simple")}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                      pType === "simple" ? "bg-background text-foreground shadow" : "text-muted-foreground"
                    }`}
                  >
                    1× Обычный
                    <span className="block text-[10px] font-normal opacity-70">фото · название · цена</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPType("detailed")}
                    className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                      pType === "detailed" ? "bg-gradient-gold text-primary-foreground shadow-gold" : "text-muted-foreground"
                    }`}
                  >
                    2× С отдельной страницей
                    <span className="block text-[10px] font-normal opacity-70">галерея · варианты · описание</span>
                  </button>
                </div>

                {/* Common fields */}
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
                  <Label>{pType === "detailed" ? "Главное фото" : "Фото"}</Label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 py-6 text-sm text-muted-foreground hover:border-primary/50">
                    <ImageIcon className="h-4 w-4" />
                    {pImageFile ? `${pImageFile.name} ✓` : "Загрузить фото"}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => setPImageFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>

                {/* Detailed-only fields */}
                {pType === "detailed" && (
                  <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-3">
                    {/* Gallery */}
                    <div className="space-y-2">
                      <Label>Дополнительные фото (галерея)</Label>
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-background/40 py-4 text-xs text-muted-foreground hover:border-primary/50">
                        <ImageIcon className="h-4 w-4" />
                        {pGalleryFiles.length ? `${pGalleryFiles.length} фото выбрано` : "Выбрать несколько фото"}
                        <input
                          type="file" accept="image/*" multiple className="hidden"
                          onChange={(e) => setPGalleryFiles(Array.from(e.target.files ?? []))}
                        />
                      </label>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label>Подробное описание</Label>
                      <Textarea
                        rows={4}
                        value={pDescription}
                        onChange={(e) => setPDescription(e.target.value)}
                        placeholder="Материал, особенности, размеры…"
                      />
                    </div>

                    {/* Variants */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Варианты (цвет / размер / объём)</Label>
                        <button
                          type="button" onClick={addVariantRow}
                          className="flex items-center gap-1 text-xs text-primary"
                        >
                          <Plus className="h-3 w-3" /> добавить
                        </button>
                      </div>
                      {pVariants.length === 0 && (
                        <p className="text-xs text-muted-foreground">Не обязательно. Добавь, если у товара есть выбор.</p>
                      )}
                      {pVariants.map((v) => (
                        <div key={v.id} className="space-y-2 rounded-lg border border-border/60 bg-background/60 p-2.5">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Название (Красный, M, 500мл)"
                              value={v.label}
                              onChange={(e) => updateVariant(v.id, { label: e.target.value })}
                              className="flex-1"
                            />
                            <Input
                              type="number"
                              placeholder="Цена"
                              value={v.price}
                              onChange={(e) => updateVariant(v.id, { price: e.target.value })}
                              className="w-24"
                            />
                            <button
                              type="button" onClick={() => removeVariant(v.id)}
                              className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground hover:border-primary/50">
                            <ImageIcon className="h-3.5 w-3.5" />
                            {v.imageFile ? v.imageFile.name : "Фото варианта (необязательно)"}
                            <input
                              type="file" accept="image/*" className="hidden"
                              onChange={(e) => updateVariant(v.id, { imageFile: e.target.files?.[0] ?? null })}
                            />
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Attributes */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Характеристики</Label>
                        <button
                          type="button" onClick={addAttrRow}
                          className="flex items-center gap-1 text-xs text-primary"
                        >
                          <Plus className="h-3 w-3" /> добавить
                        </button>
                      </div>
                      {pAttrs.length === 0 && (
                        <p className="text-xs text-muted-foreground">Например: Материал — Шёлк, Страна — Китай.</p>
                      )}
                      {pAttrs.map((a, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            placeholder="Название"
                            value={a.name}
                            onChange={(e) => updateAttr(i, { name: e.target.value })}
                            className="flex-1"
                          />
                          <Input
                            placeholder="Значение"
                            value={a.value}
                            onChange={(e) => updateAttr(i, { value: e.target.value })}
                            className="flex-1"
                          />
                          <button
                            type="button" onClick={() => removeAttr(i)}
                            className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button onClick={addProduct} disabled={busy} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
                  {busy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
                  Добавить
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-lg">Текущие товары ({products.length})</h3>
                {products.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-2.5">
                    <img src={p.image} alt={p.name} className="h-14 w-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-primary">{p.price.toLocaleString("ru-RU")} ₸</p>
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                          p.product_type === "detailed"
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {p.product_type === "detailed" ? "2×" : "1×"}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => removeProduct(p.id)} disabled={busy} className="rounded-lg p-2 text-destructive hover:bg-destructive/10 disabled:opacity-50">
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
                <Button onClick={addCategory} disabled={busy} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
                  {busy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
                  Добавить категорию
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-lg">Категории ({editableCats.length})</h3>
                {editableCats.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
                    <span className="text-2xl">{c.emoji}</span>
                    <p className="flex-1 text-sm font-medium">{c.name}</p>
                    <button onClick={() => removeCategory(c.id)} disabled={busy} className="rounded-lg p-2 text-destructive hover:bg-destructive/10 disabled:opacity-50">
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
                    {sImageFile ? `${sImageFile.name} ✓` : "Загрузить фото"}
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => setSImageFile(e.target.files?.[0] ?? null)} />
                  </label>
                </div>
                <Button onClick={addSlide} disabled={busy} className="w-full bg-gradient-gold text-primary-foreground hover:opacity-90">
                  {busy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Plus className="mr-1 h-4 w-4" />}
                  Добавить слайд
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
                    <button onClick={() => removeSlide(s.id)} disabled={busy} className="rounded-lg p-2 text-destructive hover:bg-destructive/10 disabled:opacity-50">
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
