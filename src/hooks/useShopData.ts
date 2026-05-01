import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fallbackSlides, type Product, type Slide, type Category } from "@/data/shop";

const ALL_CAT: Category = { id: "all", name: "Все", emoji: "✦" };

export function useShopData() {
  const [products, setProducts] = useState<Product[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [categories, setCategories] = useState<Category[]>([ALL_CAT]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [{ data: cats }, { data: prods }, { data: sls }] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("slides").select("*").order("created_at"),
    ]);

    setCategories([
      ALL_CAT,
      ...((cats ?? []).map((c) => ({ id: c.id, name: c.name, emoji: c.emoji }))),
    ]);
    setProducts(
      (prods ?? []).map((p) => ({
        id: p.id, name: p.name, price: Number(p.price), image: p.image, category: p.category,
      })),
    );
    setSlides(
      (sls ?? []).length
        ? sls!.map((s) => ({ id: s.id, title: s.title, subtitle: s.subtitle ?? "", image: s.image }))
        : fallbackSlides,
    );
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return { products, slides, categories, loading, reload: load };
}
