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
  { id: "s1", image: slide1, title: "Уйгурская культура", subtitle: "Наследие в каждой детали" },
  { id: "s2", image: slide2, title: "Премиум коллекция", subtitle: "Искусство и стиль" },
  { id: "s3", image: slide3, title: "Традиционные мотивы", subtitle: "От мастеров востока" },
];

export const defaultCategories: Category[] = [
  { id: "all", name: "Все", emoji: "✦" },
  { id: "clothes", name: "Одежда", emoji: "👘" },
  { id: "dishes", name: "Посуда", emoji: "🍽️" },
  { id: "decor", name: "Декор", emoji: "🏺" },
  { id: "textile", name: "Текстиль", emoji: "🧵" },
  { id: "jewelry", name: "Украшения", emoji: "💎" },
  { id: "accessories", name: "Аксессуары", emoji: "👜" },
];

export const defaultProducts: Product[] = [
  { id: "1", name: "Шёлковый халат", price: 28000, image: pMilk, category: "clothes" },
  { id: "2", name: "Расписная пиала", price: 4500, image: pDrink, category: "dishes" },
  { id: "3", name: "Декоративная ваза", price: 12000, image: pFrozen, category: "decor" },
  { id: "4", name: "Тюбетейка ручной работы", price: 8500, image: pBread, category: "clothes" },
  { id: "5", name: "Серебряный браслет", price: 18000, image: pSweets, category: "jewelry" },
  { id: "6", name: "Тканый ковёр", price: 65000, image: pMeat, category: "textile" },
];

export const WHATSAPP_PHONE = "77001234567";
export const ADMIN_CODE = "2580";
