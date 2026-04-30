import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";
import pMilk from "@/assets/product-milk.jpg";
import pDrink from "@/assets/product-drink.jpg";
import pFrozen from "@/assets/product-frozen.jpg";
import pBread from "@/assets/product-bread.jpg";
import pSweets from "@/assets/product-sweets.jpg";
import pMeat from "@/assets/product-meat.jpg";

export type Slide = { id: string; image: string; title: string; subtitle: string };
export type Product = { id: string; name: string; price: number; image: string; category: string };
export type Category = { id: string; name: string; emoji: string };

export const defaultSlides: Slide[] = [
  { id: "s1", image: slide1, title: "Уйгурская кухня", subtitle: "Аутентичные вкусы Востока" },
  { id: "s2", image: slide2, title: "Молочные премиум", subtitle: "Свежесть с фермы" },
  { id: "s3", image: slide3, title: "Чайная церемония", subtitle: "Традиции в каждом глотке" },
];

export const categories: Category[] = [
  { id: "all", name: "Все", emoji: "✦" },
  { id: "dairy", name: "Молочные", emoji: "🥛" },
  { id: "drinks", name: "Напитки", emoji: "🥤" },
  { id: "frozen", name: "Заморозка", emoji: "❄️" },
  { id: "bread", name: "Выпечка", emoji: "🥖" },
  { id: "sweets", name: "Сладости", emoji: "🍯" },
  { id: "meat", name: "Мясо", emoji: "🥩" },
];

export const defaultProducts: Product[] = [
  { id: "1", name: "Молоко домашнее", price: 850, image: pMilk, category: "dairy" },
  { id: "2", name: "Компот ягодный", price: 1200, image: pDrink, category: "drinks" },
  { id: "3", name: "Манты замороженные", price: 2400, image: pFrozen, category: "frozen" },
  { id: "4", name: "Лепёшка нан", price: 600, image: pBread, category: "bread" },
  { id: "5", name: "Сухофрукты ассорти", price: 3200, image: pSweets, category: "sweets" },
  { id: "6", name: "Баранина свежая", price: 5800, image: pMeat, category: "meat" },
];

export const WHATSAPP_PHONE = "77001234567"; // без + и пробелов
export const ADMIN_CODE = "2580";
