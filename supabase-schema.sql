-- Run this in your Supabase SQL editor
-- https://supabase.com/dashboard/project/_/sql

-- ─── Forms ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS bookings (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT        NOT NULL,
  email         TEXT        NOT NULL,
  event_type    TEXT        NOT NULL,
  proposed_date TEXT,
  city          TEXT,
  note          TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscribers (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email         TEXT        UNIQUE NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Content (editable by Bonn from the Supabase dashboard) ───────────────────

CREATE TABLE IF NOT EXISTS shows (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  date          TEXT        NOT NULL,       -- e.g. 'Apr 26'
  year          TEXT        NOT NULL,       -- e.g. '2026'
  venue         TEXT        NOT NULL,
  city          TEXT        NOT NULL,
  country       TEXT        NOT NULL DEFAULT 'IN',
  status        TEXT        NOT NULL DEFAULT 'tickets', -- 'tickets' | 'soldout' | 'invite'
  ticket_url    TEXT,
  sort_order    INT         NOT NULL DEFAULT 0,         -- lower = shown first
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mixes (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  catalog_no    TEXT        NOT NULL,       -- e.g. '005'
  title         TEXT        NOT NULL,
  release_date  TEXT        NOT NULL,       -- e.g. 'Mar 2026'
  duration      TEXT        NOT NULL,       -- e.g. '62 min'
  cover_url     TEXT,
  tags          TEXT[]      DEFAULT '{}',   -- e.g. '{Live,"Deep House"}'
  sc_url        TEXT,                       -- full SoundCloud track URL
  spotify_url   TEXT,
  youtube_url   TEXT,
  sort_order    INT         NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE bookings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shows       ENABLE ROW LEVEL SECURITY;
ALTER TABLE mixes       ENABLE ROW LEVEL SECURITY;

-- Public can submit forms
CREATE POLICY "public insert bookings"    ON bookings    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "public insert subscribers" ON subscribers FOR INSERT TO anon WITH CHECK (true);

-- Public can read shows and mixes (the website displays them)
CREATE POLICY "public read shows" ON shows FOR SELECT TO anon USING (true);
CREATE POLICY "public read mixes" ON mixes FOR SELECT TO anon USING (true);

-- ─── Seed data ────────────────────────────────────────────────────────────────

INSERT INTO shows (date, year, venue, city, country, status, ticket_url, sort_order) VALUES
  ('Apr 26', '2026', 'Antisocial',       'Bengaluru', 'IN', 'tickets',  'https://insider.in', 1),
  ('May 03', '2026', 'The Piano Man',    'New Delhi',  'IN', 'tickets',  'https://insider.in', 2),
  ('May 17', '2026', 'Summerhouse Café', 'Bengaluru', 'IN', 'soldout',  NULL,                 3),
  ('Jun 08', '2026', 'Bay 146',          'Mumbai',    'IN', 'tickets',  'https://insider.in', 4),
  ('Jun 22', '2026', 'Soulgrove Fest',   'Goa',       'IN', 'tickets',  'https://insider.in', 5),
  ('Jul 11', '2026', 'Private showcase', 'Bengaluru', 'IN', 'invite',   NULL,                 6);

INSERT INTO mixes (catalog_no, title, release_date, duration, cover_url, tags, sc_url, sort_order) VALUES
  ('005', 'Monsoon Diaries, Vol. II', 'Mar 2026', '62 min', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&auto=format&fit=crop', '{Live,"Deep House"}',    NULL, 1),
  ('004', 'Saffron Skies',            'Jan 2026', '58 min', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=900&auto=format&fit=crop', '{"Studio Mix",Melodic}', NULL, 2),
  ('003', 'Letters to Neha',          'Nov 2025', '71 min', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&auto=format&fit=crop', '{Live,Organic}',         NULL, 3),
  ('002', 'Slowdance',                'Aug 2025', '55 min', 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=900&auto=format&fit=crop', '{"Studio Mix",Ambient}', NULL, 4),
  ('001', 'First Light',              'Apr 2025', '48 min', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900&auto=format&fit=crop', '{Live,"Deep House"}',    NULL, 5);
