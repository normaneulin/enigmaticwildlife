# Content management (Sveltia CMS)

The site has no database. Every piece of content is a file in `content/`, and the
CMS is a browser UI that reads and writes those files through the GitHub API.
Editing in the CMS produces a normal Git commit; Vercel sees the push and
rebuilds. That means content is versioned, reviewable, and revertible, and a
developer editing YAML by hand and an editor using the CMS are doing the same
thing.

Sveltia CMS is a modern, drop-in replacement for Decap CMS (formerly Netlify
CMS). It uses the same config format, so the setup below transfers if we ever
switch back.

```
Editor → /admin (Sveltia) → GitHub API → commit on `staging` → Vercel rebuild
```

## Where things live

| Path | What it is |
| --- | --- |
| `public/admin/index.html` | The CMS entry page. Static on purpose — Sveltia takes over `<body>`, which fights a React root. |
| `public/admin/config.yml` | Collections and fields. **Must stay in sync with `src/lib/content/types.ts`.** |
| `next.config.ts` | Rewrites `/admin` → `/admin/index.html` and sets `X-Robots-Tag: noindex`. |
| `content/` | The content itself. |
| `src/lib/content/index.ts` | Server-side loaders that read `content/` at build time. |

## Editing locally (no auth needed)

`local_backend: true` is set, so the CMS can talk to a local proxy that writes
straight to your working tree — no GitHub, no OAuth, no commits.

```bash
# terminal 1
npx @sveltia/cms-proxy-server

# terminal 2
npm run dev
```

Then open <http://localhost:3000/admin>. Saves land in `content/` as
uncommitted file changes.

## Production setup — one manual step remains

`backend.base_url` in `public/admin/config.yml` is empty. Until it is filled in,
**signing in at the deployed `/admin` will fail.** Everything else is wired.

The reason: GitHub's OAuth flow requires exchanging a code for a token using a
client *secret*, which cannot live in a static page. Netlify does this for you;
Vercel does not. So we need a tiny external authenticator. Sveltia ships one.

### 1. Deploy the auth relay

Sveltia maintains [`sveltia/sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth),
a Cloudflare Worker built for exactly this. It is free at our volume and is the
path Sveltia documents.

1. Fork/clone that repo and deploy it to Cloudflare Workers (its README has a
   one-click deploy button).
2. Note the resulting URL, e.g. `https://enwild-cms-auth.<subdomain>.workers.dev`.

### 2. Create a GitHub OAuth App

In GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App:

- **Application name:** EnWild CMS
- **Homepage URL:** the production site URL
- **Authorization callback URL:** `https://<worker-url>/callback`

Copy the Client ID, then generate a Client Secret.

### 3. Configure the Worker

Set these as Worker environment variables / secrets:

| Name | Value |
| --- | --- |
| `GITHUB_CLIENT_ID` | from step 2 |
| `GITHUB_CLIENT_SECRET` | from step 2 (secret, not a plain variable) |
| `ALLOWED_DOMAINS` | the site's domain, e.g. `enwild.org` — restricts which sites may use this relay |

### 4. Point the CMS at it

In `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: normaneulin/enwild-website
  branch: staging
  base_url: https://enwild-cms-auth.<subdomain>.workers.dev
  auth_endpoint: auth
```

Commit and deploy. `/admin` now offers "Sign in with GitHub".

> **Alternative:** the relay can also run as a Vercel serverless function inside
> this repo, avoiding a second platform. It is more code to own for no
> functional gain, so the Worker is the recommendation.

## Who can edit

Anyone with **write access to the GitHub repository**. There is no separate CMS
user list — GitHub collaborators *are* the editor list. Add editors under repo
Settings → Collaborators.

## Publishing flow

`config.yml` points at the `staging` branch, so CMS edits do not go straight to
production. Promote with a PR from `staging` → `main` when the site is ready.

To let editors publish directly instead, change `branch:` to `main`.

## Rules that keep the content model intact

These are enforced by convention, not by code — worth stating explicitly:

- **The slogan is a locked string.** "Every Species Matters. Every Voice Counts."
  must appear unaltered per the brand guide. It is in `content/settings/site.yaml`
  with a warning on the field.
- **Never write new org descriptions.** Use one of the three approved
  boilerplates (short / medium / long) under Settings → Organization Profile.
- **Every post gets exactly one pillar.** That tag is what makes a post appear on
  the matching pillar page — an untagged or mistagged post silently disappears
  from that view.
- **Files prefixed with `_` are templates** (`content/posts/_example-post.md`,
  `content/people/_example-placeholder.yaml`). The loaders skip them, so they
  never reach the live site. Delete them once real records exist.
- **Posts are only public when `status: published`.** Drafts stay in the repo and
  render nowhere.
- **Changing a field name in `config.yml` requires the same change in
  `src/lib/content/types.ts`** and in whatever component reads it. The CMS writes
  the files the site reads; they are one contract in two places.
