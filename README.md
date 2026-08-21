# EnWild website

Official site for the **Alliance for the Conservation of Enigmatic Wildlife**.

> Every Species Matters. Every Voice Counts.

Next.js 16 (App Router) + CSS Modules, with Git-based content management via
Sveltia CMS.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. To edit content through the CMS UI, also run
`npx @sveltia/cms-proxy-server` in a second terminal and open
<http://localhost:3000/admin> — see [docs/CMS.md](docs/CMS.md).

## The one idea to understand

Content and layout are separate. Everything the site says lives in `content/` as
YAML or Markdown; every page is a *view* over that data. The previous Canva site
had the three Pillars typed out in three different places, so any edit meant
hunting down every copy. Here a pillar exists once, and the Home summary card,
the pillar detail page, and every post tagged with it all read from that one
record.

**If you find yourself typing the same sentence into a second file, stop** — put
it in `content/` and read it from both places.

## Structure

```
content/                  Single source of truth — edited by hand or via /admin
  org/profile.yaml          About Us copy, boilerplates, per-page intro text
  settings/site.yaml        Slogan, contact, socials, primary CTA
  pillars/                  The 3 pillars (fixed set)
  people/                   Members — one list, filtered by role
  programs/
  resources/                Learning Resource Materials (LRMs)
  posts/                    Blog/Updates, Markdown + frontmatter

src/
  app/                    Routes (App Router)
  components/
    layout/                 SiteHeader, SiteFooter, HeroBanner
    ui/                     Section and other primitives
    content/                Content-shaped components (PostCard, PersonCard, …)
  lib/
    content/                Server-only loaders + the TypeScript content model
    navigation.ts           Static nav config (safe for Client Components)

public/
  admin/                  Sveltia CMS (config.yml + entry page)
  logo/                   Brand logos, including generated white/reverse variants
docs/
  CMS.md                  CMS setup, publishing flow, editorial rules
```

### Conventions

- **`src/lib/content` is server-only.** It uses `node:fs`, so it must never be
  imported from a file with `"use client"`. Client components read
  `src/lib/navigation.ts` instead.
- **Files prefixed with `_` are templates** and are skipped by the loaders, so
  placeholder records never reach the live site.
- **Design tokens live in `src/app/globals.css`.** Never hardcode a hex value in
  a component. Two greens exist deliberately: `--color-primary-dark` (`#053301`,
  the logo green, for text and marks) and `--color-site-theme` (`#054105`, the
  design plan's Deep Forest Green, for large surfaces like the footer).
- **Every page needs a `<HeroBanner>`.** The header is fixed and transparent at
  the top of the page, so it relies on the hero to supply a dark surface and to
  reserve its height. A page without one will have content slide underneath.

## Deployment

Vercel. Pushes to `staging` deploy a preview; `main` is production. CMS edits
commit to `staging` — see [docs/CMS.md](docs/CMS.md).
