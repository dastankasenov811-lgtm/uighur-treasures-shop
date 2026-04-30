import { useEffect, useState } from "react";
import { defaultProducts, defaultSlides, defaultCategories, type Product, type Slide, type Category } from "@/data/shop";

const PRODUCTS_KEY = "uighur_products_v2";
const SLIDES_KEY = "uighur_slides_v2";
const CATEGORIES_KEY = "uighur_categories_v2";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export function useShopData() {
  const [products, setProducts] = useState<Product[]>(() => load(PRODUCTS_KEY, defaultProducts));
  const [slides, setSlides] = useState<Slide[]>(() => load(SLIDES_KEY, defaultSlides));
  const [categories, setCategories] = useState<Category[]>(() => load(CATEGORIES_KEY, defaultCategories));

  useEffect(() => { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(SLIDES_KEY, JSON.stringify(slides)); }, [slides]);
  useEffect(() => { localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories)); }, [categories]);

  return { products, setProducts, slides, setSlides, categories, setCategories };
}
