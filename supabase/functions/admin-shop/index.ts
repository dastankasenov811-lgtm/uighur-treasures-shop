import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ADMIN_CODE = Deno.env.get("ADMIN_CODE") ?? "2580";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function extractStoragePath(url: string): string | null {
  const m = url.match(/\/storage\/v1\/object\/public\/shop-images\/(.+)$/);
  return m ? decodeURIComponent(m[1]) : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { code, action, payload } = body ?? {};

    if (code !== ADMIN_CODE) {
      return json({ error: "Неверный код" }, 401);
    }

    if (action === "verify") return json({ ok: true });

    // ===== Products =====
    if (action === "addProduct") {
      const {
        name, price, image, category,
        product_type, images, description, variants, attributes,
      } = payload;
      if (!name || price == null || !image || !category) return json({ error: "Не все поля" }, 400);
      const row: Record<string, unknown> = { name, price, image, category };
      if (product_type === "detailed" || product_type === "simple") row.product_type = product_type;
      if (Array.isArray(images)) row.images = images;
      if (typeof description === "string") row.description = description;
      if (Array.isArray(variants)) row.variants = variants;
      if (Array.isArray(attributes)) row.attributes = attributes;
      const { data, error } = await supabase.from("products")
        .insert(row).select().single();
      if (error) throw error;
      return json({ data });
    }
    if (action === "deleteProduct") {
      const { id } = payload;
      const { data: prod } = await supabase.from("products").select("image").eq("id", id).single();
      if (prod?.image) {
        const path = extractStoragePath(prod.image);
        if (path) await supabase.storage.from("shop-images").remove([path]);
      }
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    // ===== Categories =====
    if (action === "addCategory") {
      const { id, name, emoji } = payload;
      if (!id || !name) return json({ error: "Не все поля" }, 400);
      const { data, error } = await supabase.from("categories")
        .insert({ id, name, emoji: emoji || "✦" }).select().single();
      if (error) throw error;
      return json({ data });
    }
    if (action === "deleteCategory") {
      const { id } = payload;
      // delete products in this category and their images
      const { data: prods } = await supabase.from("products").select("id, image").eq("category", id);
      if (prods?.length) {
        const paths = prods.map((p) => extractStoragePath(p.image)).filter(Boolean) as string[];
        if (paths.length) await supabase.storage.from("shop-images").remove(paths);
        await supabase.from("products").delete().eq("category", id);
      }
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    // ===== Slides =====
    if (action === "addSlide") {
      const { title, subtitle, image } = payload;
      if (!title || !image) return json({ error: "Не все поля" }, 400);
      const { data, error } = await supabase.from("slides")
        .insert({ title, subtitle: subtitle ?? "", image }).select().single();
      if (error) throw error;
      return json({ data });
    }
    if (action === "deleteSlide") {
      const { id } = payload;
      const { data: sl } = await supabase.from("slides").select("image").eq("id", id).single();
      if (sl?.image) {
        const path = extractStoragePath(sl.image);
        if (path) await supabase.storage.from("shop-images").remove([path]);
      }
      const { error } = await supabase.from("slides").delete().eq("id", id);
      if (error) throw error;
      return json({ ok: true });
    }

    // ===== Upload image (base64) =====
    if (action === "uploadImage") {
      const { dataUrl, folder } = payload as { dataUrl: string; folder: string };
      if (!dataUrl?.startsWith("data:")) return json({ error: "Bad image" }, 400);
      const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (!match) return json({ error: "Bad image format" }, 400);
      const mime = match[1];
      const ext = mime.split("/")[1].split("+")[0];
      const bytes = Uint8Array.from(atob(match[2]), (c) => c.charCodeAt(0));
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("shop-images")
        .upload(path, bytes, { contentType: mime, upsert: false });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("shop-images").getPublicUrl(path);
      return json({ url: pub.publicUrl });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Server error";
    console.error("admin-shop error:", msg);
    return json({ error: msg }, 500);
  }
});
