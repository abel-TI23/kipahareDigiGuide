# 📊 SETUP TRACKING TABLES - QR Scans & Visitors

Jalankan SQL ini di **Supabase Dashboard** → **SQL Editor**

```sql
-- ============================================
-- TABLE: qr_scans (Track QR Code Scans)
-- ============================================

CREATE TABLE IF NOT EXISTS qr_scans (
  id SERIAL PRIMARY KEY,
  artifact_id INTEGER REFERENCES artifacts(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visitor_ip VARCHAR(45),
  user_agent TEXT
);

-- Index for faster queries
CREATE INDEX idx_qr_scans_artifact_id ON qr_scans(artifact_id);
CREATE INDEX idx_qr_scans_scanned_at ON qr_scans(scanned_at);

-- ============================================
-- TABLE: visitors (Track Unique Visitors)
-- ============================================

CREATE TABLE IF NOT EXISTS visitors (
  id SERIAL PRIMARY KEY,
  visitor_ip VARCHAR(45) UNIQUE,
  first_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visit_count INTEGER DEFAULT 1
);

-- Index for faster queries
CREATE INDEX idx_visitors_visitor_ip ON visitors(visitor_ip);

-- ============================================
-- RLS POLICIES (Allow Public Insert)
-- ============================================

-- Enable RLS
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (tracking)
CREATE POLICY "Allow public insert qr_scans"
ON qr_scans FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Allow public insert visitors"
ON visitors FOR INSERT
TO public
WITH CHECK (true);

-- Allow public to update visitors (for visit count)
CREATE POLICY "Allow public update visitors"
ON visitors FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow admin to read all
CREATE POLICY "Allow public select qr_scans"
ON qr_scans FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow public select visitors"
ON visitors FOR SELECT
TO public
USING (true);
```

## ✅ Verify

Setelah run SQL, cek di Supabase Dashboard:
1. **Table Editor** → Seharusnya ada:
   - `qr_scans` table
   - `visitors` table
2. **Policies** tab → Seharusnya ada policies untuk INSERT, SELECT, UPDATE

Done! ✅
