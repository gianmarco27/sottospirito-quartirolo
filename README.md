# Sotto Spirito

A statically-hosted multimedia catalogue website for short-form pastoral audio content, built for a local Italian Christian community.

## Tech Stack

- **Framework:** Astro 6.0 (SSG, TypeScript strict)
- **Styling:** Tailwind CSS 4
- **Interactivity:** Alpine.js (~8KB)
- **CMS:** Sveltia CMS (Git-backed, client-side SPA)
- **Search:** Pagefind (static, client-side)
- **Hosting:** Cloudflare Pages (free tier)
- **Media Storage:** Cloudflare R2 (free tier)
- **Analytics:** Cloudflare Web Analytics (cookieless)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Production build (includes Pagefind index)
npm run build

# Preview production build
npm run preview

# Run type checking + linting
npm run check

# Start local CMS proxy (for editing content without pushing to GitHub)
npm run cms
```

## Project Structure

```
src/
├── components/     # UI components + co-located Alpine.js .ts files
├── content/        # Content collections (episodes, pages)
├── layouts/        # Layout shells (base-layout, episode-layout)
├── lib/            # Pure functions (format-date, constants, listen-history)
├── pages/          # File-based routes
├── styles/         # global.css (Tailwind + design tokens)
└── types/          # TypeScript type definitions
public/
├── admin/          # Sveltia CMS (index.html + config.yml)
├── _headers        # Cloudflare Pages headers (CSP, cache)
└── favicon.svg
```

## Deployment

The site auto-deploys to Cloudflare Pages when content is pushed to `main`. Build command:

```bash
astro build && npx pagefind --site dist
```

## Cost

**EUR 0/month** — Cloudflare Pages + R2 + Workers + Analytics, all on free tier.
