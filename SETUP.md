# Bonn Avenue — Setup Guide for Claude Code

## Context

This is the production codebase for **Bonn Avenue's website** (bornavenue.com).  
It was built by Jas (Propel) and is being handed off to Bonn to own and deploy on his own infrastructure.

**Stack:** Vite + React → Vercel (hosting) + Supabase (database) + SoundCloud Widget API (audio)

The repo is at: https://github.com/jasgrowth/bonn-avenue  
Fork it to your own GitHub account first, then work from your fork.

---

## What Claude Code needs to do — in order

### Step 1 — Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/bonn-avenue.git
cd bonn-avenue
npm install
```

Verify the build works:
```bash
npm run build
```
Expected output: `✓ built in ~5s` with no errors.

---

### Step 2 — Set up Supabase

1. Create a project at https://supabase.com (free tier is fine)
2. Go to **SQL Editor** in the Supabase dashboard
3. Paste and run the entire contents of `supabase-schema.sql` — this creates all tables and seeds the initial data
4. Go to **Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret)

---

### Step 3 — Create environment files

Create a `.env` file in the project root (it's gitignored, never committed):

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=re_your_key
BOOKING_NOTIFY_EMAIL=your@email.com
```

- `RESEND_API_KEY` — sign up free at https://resend.com — this sends an email to Bonn whenever someone submits a booking inquiry
- `BOOKING_NOTIFY_EMAIL` — the email address where booking alerts should land

Run `npm run dev` and open http://localhost:5173 to confirm the site loads.

---

### Step 4 — Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

When prompted:
- **Set up and deploy?** → Y
- **Which scope?** → your personal Vercel account
- **Link to existing project?** → N
- **Project name?** → bonn-avenue (or anything)
- **Directory?** → `./` (press Enter)
- **Override settings?** → N

After deploy you'll get a URL like `bonn-avenue-abc.vercel.app`.

---

### Step 5 — Add environment variables to Vercel

Go to https://vercel.com/dashboard → your project → **Settings → Environment Variables**

Add all 5 variables from Step 3. Set scope to **Production** for all of them.

Then go to **Deployments** → three dots on latest → **Redeploy** to bake them in.

---

### Step 6 — Add SoundCloud track URLs

Open `src/data/mixes.js`. For each mix, add the real SoundCloud track URL:

```js
scUrl: 'https://soundcloud.com/bonnavenue/your-track-slug',
```

When `scUrl` is set, the site uses the real SoundCloud audio. When it's `null`, it uses a synthesised preview.

After editing, commit and push:
```bash
git add src/data/mixes.js
git commit -m "add soundcloud urls"
git push
```

---

### Step 7 — Connect GitHub to Vercel for auto-deploys

In Vercel dashboard → your project → **Settings → Git → Connect Git Repository** → select your fork.

After this, every `git push` automatically deploys to production. No more manual `vercel --prod`.

---

### Step 8 — Custom domain (if using bornavenue.com on GoDaddy)

**In Vercel:**
1. Project → **Settings → Domains** → add `bornavenue.com` → **Add**
2. Also add `www.bornavenue.com` → **Add**
3. Vercel shows you two DNS records to set

**In GoDaddy:**
1. Log in → My Products → find `bornavenue.com` → **DNS**
2. Edit the **A record** with name `@` → value: `76.76.21.21`, TTL: `600`
3. Edit/add a **CNAME** with name `www` → value: `cname.vercel-dns.com`, TTL: `600`
4. Save

DNS propagates in ~5–30 minutes. Vercel shows a green tick when it's verified. HTTPS is automatic.

---

## What Bonn manages going forward (no code needed)

Everything Bonn needs to update lives in Supabase at https://supabase.com.

Log in → your project → **Table Editor**:

| Table | What to do |
|---|---|
| `shows` | Click **Insert row** to add a new gig. Fill in: `date` (e.g. "Jun 15"), `year` ("2026"), `venue`, `city`, `country`, `status` ("tickets" / "soldout" / "invite"), `ticket_url`. Set `sort_order` to control display order (1 = top). |
| `mixes` | Click **Insert row** for a new release. Fill in `catalog_no`, `title`, `release_date`, `duration`, `cover_url` (Unsplash or your own image URL), `tags` (e.g. `{Live,"Deep House"}`), `sc_url` (full SoundCloud track URL). |
| `bookings` | Read-only. Every inquiry submitted through the website appears here. |
| `subscribers` | Read-only. Everyone who signed up to the newsletter. |

Changes to `shows` and `mixes` appear on the live site **immediately** — no deploy needed.

---

## What requires a code change (Jas handles these)

- Design or layout changes
- Adding new sections
- Changing copy in Hero, About, or Footer
- Updating photo URLs in `src/data/photos.js`

Make the change → `git push` → Vercel auto-deploys.

---

## Project structure (quick reference)

```
bonn-avenue/
├── api/
│   ├── booking.js      ← Vercel serverless: saves booking to DB + sends email
│   └── subscribe.js    ← Vercel serverless: saves newsletter signup to DB
├── src/
│   ├── components/     ← One file per section (Hero, Mixes, Shows, etc.)
│   ├── context/        ← Theme (locked to Golden Hour / Editorial)
│   ├── data/           ← Static fallback data (photos.js)
│   ├── hooks/          ← useParallax, useReveal
│   ├── lib/
│   │   └── supabase.js ← Supabase client (reads env vars)
│   └── App.jsx         ← Composes all sections
├── supabase-schema.sql ← Run this once in Supabase SQL editor
├── .env.example        ← Copy to .env and fill in real values
└── vercel.json         ← Vercel routing config
```
