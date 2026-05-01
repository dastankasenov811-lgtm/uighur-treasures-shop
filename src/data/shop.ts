import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";
import slide3 from "@/assets/slide-3.jpg";

export type Slide = { id: string; image: string; title: string; subtitle: string };
export type Product = { id: string; name: string; price: number; image: string; category: string };
export type Category = { id: string; name: string; emoji: string };

// Fallback slides shown only while DB is empty / loading
export const fallbackSlides: Slide[] = [
  { id: "s1", image: slide1, title: "Уйгурская культура", subtitle: "Наследие в каждой детали" },
  { id: "s2", image: slide2, title: "Премиум коллекция", subtitle: "Искусство и стиль" },
  { id: "s3", image: slide3, title: "Традиционные мотивы", subtitle: "От мастеров востока" },
];

export const WHATSAPP_PHONE = "77075306136";
