import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";

export type Slide = { id: string; image: string; title: string; subtitle: string };

export type Variant = {
  id: string;
  label: string;     // "Красный", "M", "500мл"
  price?: number;    // если задан — заменяет основную цену
  image?: string;    // опционально — отдельное фото варианта
};

export type Attribute = { name: string; value: string };

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  // Расширенные поля
  product_type: "simple" | "detailed";
  images: string[];
  description: string;
  variants: Variant[];
  attributes: Attribute[];
};

export type Category = { id: string; name: string; emoji: string };

export const fallbackSlides: Slide[] = [
  { id: "s1", image: slide1, title: "Уйгурская культура", subtitle: "Наследие в каждой детали" },
  { id: "s2", image: slide2, title: "Премиум коллекция", subtitle: "Искусство и стиль" },
  { id: "s3", image: slide3, title: "Традиционные мотивы", subtitle: "От мастеров востока" },
];

export const WHATSAPP_PHONE = "77075306136";
