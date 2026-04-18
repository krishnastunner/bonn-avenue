# Bonn Avenue — Claude Code Context

## What this is

Production website for **Bonn Avenue** (bonnavenue.com) — a deep house producer & DJ based in Bengaluru, India.
Built by Jas (Propel), maintained and improved from here.

Live URL: **https://bonnavenue.com** (also https://bonn-avenue.vercel.app)
GitHub: **https://github.com/krishnastunner/bonn-avenue** (branch: `master`)

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 18 (no TypeScript, no router) |
| Hosting | Vercel (auto-deploy on push to `master`) |
| Database | Supabase (PostgreSQL) |
| Audio | SoundCloud Widget API + Web Audio API synth fallback |
| Email | Resend API (booking notifications) |
| Fonts | Google Fonts — Cormorant Garamond, JetBrains Mono |

---

## Local development

```bash
# Install (first time or after pulling)
npm install

# Dev server → http://localhost:5173
npm run dev

# Production build check
npm run build
```

Node.js is installed at `C:\Program Files\nodejs\`. If `npm` isn't found in bash, use:
```bash
PATH="/c/Program Files/nodejs:$PATH" npm run dev
```

---

## Deploy

Every `git push origin master` auto-deploys to Vercel (GitHub is connected).

Manual deploy if needed:
```bash
PATH="/c/Users/krish/AppData/Roaming/npm:/c/Program Files/nodejs:$PATH" vercel --prod --yes
```

---

## Environment variables

Stored in `.env` (gitignored) locally and in Vercel → Settings → Environment Variables (Production).

| Variable | Purpose |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL (baked into frontend bundle at build time) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key (baked into frontend bundle) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only, used in `/api` functions) |
| `RESEND_API_KEY` | Resend API key for booking email notifications |
| `BOOKING_NOTIFY_EMAIL` | Email address that receives booking alerts (bonnavenue.musical@gmail.com) |

---

## Project structure

```
bonn-avenue/
├── api/
│   ├── booking.js       ← Vercel serverless: saves booking to DB + sends email via Resend
│   └── subscribe.js     ← Vercel serverless: saves newsletter signup to DB
├── src/
│   ├── App.jsx          ← Root component, composes all sections in order
│   ├── main.jsx         ← React DOM entry point
│   ├── index.css        ← Global resets + .ticker animation + responsive breakpoints
│   ├── theme.js         ← THEMES (warm/dusk/marigold) and FONTS (editorial/classic/bold) objects
│   ├── components/
│   │   ├── Nav.jsx          ← Fixed top nav, transparent → frosted glass on scroll
│   │   ├── Hero.jsx         ← Full-height hero with parallax background + fade-in text
│   │   ├── About.jsx        ← Bio, stats, polaroid photos, influences ticker
│   │   ├── Mixes.jsx        ← Catalog player — fetches from Supabase, Web Audio synth + SC widget
│   │   ├── DJConsole.jsx    ← Interactive DJ booth / mixer UI
│   │   ├── Shows.jsx        ← Tour dates — fetches from Supabase
│   │   ├── Gallery.jsx      ← Photo grid with hover zoom + city ticker
│   │   ├── Booking.jsx      ← Booking inquiry form → POST /api/booking
│   │   ├── Newsletter.jsx   ← Email signup → POST /api/subscribe
│   │   ├── Footer.jsx       ← Simple footer with coordinates
│   │   ├── TweaksPanel.jsx  ← Dev-only UI tweaks panel (not shown in prod)
│   │   └── ui/
│   │       ├── Mono.jsx     ← Monospace text helper component
│   │       ├── Photo.jsx    ← Image with sepia filter + film grain overlay (reads from ThemeContext)
│   │       ├── Pill.jsx     ← Button/link pill component (variant: default | solid)
│   │       └── Reveal.jsx   ← Scroll-triggered fade-up animation (uses IntersectionObserver)
│   ├── context/
│   │   └── ThemeContext.jsx ← Theme provider — sets CSS variables on :root, locked to 'warm' + 'editorial'
│   ├── data/
│   │   ├── photos.js    ← Static Unsplash image URLs (hero, portrait, gallery, mix covers)
│   │   ├── mixes.js     ← Static fallback mix data (not used — Supabase is live source of truth)
│   │   └── shows.js     ← Static fallback shows data (not used — Supabase is live source of truth)
│   ├── hooks/
│   │   ├── useParallax.js  ← Returns [ref, style] for parallax scroll effect
│   │   └── useReveal.js    ← Returns [ref, shown] using IntersectionObserver
│   └── lib/
│       └── supabase.js  ← Supabase client (reads VITE_ env vars)
├── supabase-schema.sql  ← Schema already applied. Run once in Supabase SQL editor if rebuilding.
├── vercel.json          ← SPA rewrite rule (all non-/api/ routes → index.html)
├── vite.config.js
└── .env                 ← Local env vars (gitignored)
```

---

## Design system

**Theme is locked to "Golden Hour"** — do not change the active theme without Bonn's approval.

CSS variables set by ThemeContext on `:root`:

| Variable | Value | Usage |
|---|---|---|
| `--bg` | `#f0e2c4` | Page background (warm cream) |
| `--bg-alt` | `#e8d4b0` | Alternate section background (slightly darker) |
| `--ink` | `#2a1610` | Primary text (near-black brown) |
| `--ink-soft` | `rgba(42,22,16,0.72)` | Secondary text |
| `--ink-faint` | `rgba(42,22,16,0.5)` | Tertiary / label text |
| `--accent` | `#c85a3f` | Red-orange accent (CTAs, active states) |
| `--accent-2` | `#d88440` | Secondary accent (amber) |
| `--cream` | `#f5ead4` | Light cream (hero text, pill backgrounds) |
| `--line` | `rgba(42,22,16,0.25)` | Borders and dividers |
| `--display` | Cormorant Garamond | Headings, large italic type |
| `--body` | Cormorant Garamond | Body copy |
| `--mono` | JetBrains Mono | Labels, tags, metadata |

Photos use `filter: sepia(0.22) saturate(1.12) contrast(1.04)` and a warm gradient overlay.

**Typography scale:** `clamp()` everywhere — no fixed breakpoint font sizes.

**Responsive breakpoints (in index.css):**
- `≤900px` — about/mix/booking grids go single column; hero sidebar hidden
- `≤620px` — nav links hidden; hero bottom bar condenses

---

## Supabase — live data

**Project URL:** https://nygmwhvhcomuvuoabsjk.supabase.co
**Dashboard:** https://supabase.com/dashboard/project/nygmwhvhcomuvuoabsjk

Bonn manages shows and mixes directly in the Supabase Table Editor — no code change needed for content updates.

### Tables

**`shows`** — tour dates displayed on the site
```
id, date (text e.g. "Apr 26"), year (text), venue, city, country,
status ("tickets" | "soldout" | "invite"), ticket_url, sort_order (int), created_at
```

**`mixes`** — catalog displayed in the player
```
id, catalog_no (text e.g. "005"), title, release_date, duration,
cover_url (image URL), tags (text[]), sc_url (SoundCloud URL or null),
spotify_url, youtube_url, sort_order (int), created_at
```

**`bookings`** — read-only, populated by /api/booking
```
id, name, email, event_type, proposed_date, city, note, created_at
```

**`subscribers`** — read-only, populated by /api/subscribe
```
id, email (unique), created_at
```

Row Level Security is enabled. Anon users can INSERT into bookings/subscribers and SELECT from shows/mixes.

---

## Audio system (Mixes section)

Two playback modes depending on whether `sc_url` is set in the mix row:

1. **SoundCloud Widget** (when `sc_url` is set) — hidden iframe embeds the track, SC Widget API controls playback. Progress tracked via `PLAY_PROGRESS` events.

2. **Web Audio synth** (when `sc_url` is null) — fully synthesised preview generated in-browser using Web Audio API. Kicks, hats, claps, bass, chords, and plucks are all generated procedurally from `TRACK_PARAMS` in Mixes.jsx. No external audio file needed.

The waveform visualiser (64 bars) animates from analyser data when synth is playing, or does an idle sine-wave animation otherwise.

---

## API routes (Vercel serverless)

### `POST /api/booking`
Body: `{ name, email, event_type, proposed_date?, city?, note? }`
- Saves to `bookings` table via service role key
- Sends email to `BOOKING_NOTIFY_EMAIL` via Resend
- Returns `{ ok: true }` on success

### `POST /api/subscribe`
Body: `{ email }`
- Saves to `subscribers` table
- Returns `{ ok: true, alreadySubscribed: true }` if duplicate email (no error shown to user)

---

## Key bugs fixed (do not reintroduce)

1. **ThemeContext** — `setThemeKey` and `setFontKey` must be destructured from `useState` even though the theme is locked. The Provider value references both setters. If they're not destructured (e.g. `const [themeKey] = useState(...)`), the app crashes with a ReferenceError on load.

2. **Mixes.jsx hooks order** — All `useEffect` and `useRef` hooks must be called **before** any early return. The component has an early return guard (`if (!mixes.length) return ...`) — all hooks including the animation loop, SC widget setup, and track reset effects must be above this guard. Violating React's Rules of Hooks causes the app to crash when Supabase data loads.

---

## Content Bonn manages himself (no code needed)

Via Supabase Table Editor:
- **Shows** — add/edit/delete gig rows
- **Mixes** — add/edit catalog entries, update `sc_url` when SoundCloud tracks are uploaded

## Content that requires a code change

- Copy in Hero, About, Footer
- Photo URLs in `src/data/photos.js`
- Stats in About section (hardcoded: 05 originals, 02 live mix videos, 6K listeners, started 2023)
- Influences list in About section (Lane 8, Ben Böhmer, Yotto, Anjunadeep, This Never Happened)
- Nav links order
- Any layout, design, or new section

---

## DNS (bonnavenue.com on GoDaddy)

| Type | Name | Value |
|---|---|---|
| A | @ | 76.76.21.21 |
| CNAME | www | (Vercel-assigned value from Settings → Domains) |

---

## Vercel project

Dashboard: https://vercel.com/krishnastunner-5270s-projects/bonn-avenue
- GitHub auto-deploys on push to `master`
- All 5 env vars set under Production scope
- Custom domain: bonnavenue.com + www.bonnavenue.com
