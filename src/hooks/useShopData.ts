import { useEffect, useState } from "react";
import { defaultProducts, defaultSlides, type Product, type Slide } from "@/data/shop";

const PRODUCTS_KEY = "uighur_products_v1";
const SLIDES_KEY = "uighur_slides_v1";

export function useShopData() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const raw = localStorage.getItem(PRODUCTS_KEY);
      return raw ? JSON.parse(raw) : defaultProducts;
    } catch { return defaultProducts; }
  });
  const [slides, setSlides] = useState<Slide[]>(() => {
    try {
      const raw = localStorage.getItem(SLIDES_KEY);
      return raw ? JSON.parse(raw) : defaultSlides;
    } catch { return defaultSlides; }
  });

  useEffect(() => { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(SLIDES_KEY, JSON.stringify(slides)); }, [slides]);

  return { products, setProducts, slides, setSlides };
}
