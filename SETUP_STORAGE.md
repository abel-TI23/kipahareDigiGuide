# 🖼️ SETUP SUPABASE STORAGE - Artifact Images

## 📋 LANGKAH 1: Create Storage Bucket

Buka Supabase Dashboard dan jalankan SQL ini:

```sql
-- Create storage bucket for artifact images
INSERT INTO storage.buckets (id, name, public)
VALUES ('artifacts-images', 'artifacts-images', true);

-- Set up storage policies for public read
CREATE POLICY "Public Access for Artifact Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'artifacts-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload artifact images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'artifacts-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update artifact images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'artifacts-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete artifact images"
ON storage.objects FOR DELETE
USING (bucket_id = 'artifacts-images' AND auth.role() = 'authenticated');
```

## ✅ VERIFY

Setelah run SQL, cek di Supabase Dashboard:
1. Klik "Storage" di sidebar
2. Seharusnya muncul bucket: `artifacts-images`
3. Status: Public

## 🔐 ALTERNATIVE: Setup via Dashboard UI

Jika SQL tidak work, manual setup:
1. Buka Supabase Dashboard → Storage
2. Click "New Bucket"
3. Name: `artifacts-images`
4. Public bucket: ✅ YES
5. Click "Create bucket"
6. Bucket settings → Policies → Add policies seperti SQL di atas

Done! ✅
