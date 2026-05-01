
DROP POLICY IF EXISTS "Anyone can upload shop images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete shop images" ON storage.objects;
-- Public read remains. Inserts/deletes only via service role (edge function).
