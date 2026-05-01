
-- Categories
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '✦',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Slides
CREATE TABLE public.slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read slides" ON public.slides FOR SELECT USING (true);

-- No client-side writes; only the edge function (service role) can write.
-- Service role bypasses RLS.

-- Storage bucket for shop images (public read)
INSERT INTO storage.buckets (id, name, public) VALUES ('shop-images', 'shop-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read shop images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'shop-images');

CREATE POLICY "Anyone can upload shop images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'shop-images');

CREATE POLICY "Anyone can delete shop images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'shop-images');

-- Seed default categories
INSERT INTO public.categories (id, name, emoji, sort_order) VALUES
  ('clothes', 'Одежда', '👘', 1),
  ('dishes', 'Посуда', '🍽️', 2),
  ('decor', 'Декор', '🏺', 3),
  ('textile', 'Текстиль', '🧵', 4),
  ('jewelry', 'Украшения', '💎', 5),
  ('accessories', 'Аксессуары', '👜', 6);
