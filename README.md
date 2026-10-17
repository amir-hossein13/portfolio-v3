# Amir.H Attarnia — Portfolio

A Next.js portfolio with GSAP section transitions and static, typed content. No database, admin account, uploads API, secrets, or writable filesystem are required. The homepage, sitemap, robots file, and social preview are generated at build time.

## Run locally

```powershell
npm install
npm run dev -- --port 3002
```

For a production preview:

```powershell
npm run build
npm run start -- --port 3002
```

## Edit your information and projects

All published content lives in **`lib/portfolio-data.ts`**:

- `profile`: name, position, bio, availability, email, phone, WhatsApp, portrait, social links, and SEO settings.
- `projects`: project cards in display order. Includes Standup.io, Omdehforoosh, Hatef Tejarat, and Khoodro24.
- `experience`: companies, roles, dates, descriptions, and website links.
- `services`: service titles and descriptions.

To add a project, copy an existing project object, give it a unique `id`, set its title, description, website URL, and image, then redeploy. Set `published: false` to hide it. Use `category: "Projects"` or `"Explorations"`. The fallback preview can be `"wellness"`, `"editorial"`, `"dashboard"`, or `"mobile"` when no image is provided.

Put project screenshots in **`public/projects/`** and reference them as `/projects/filename.png` (omit `public` in the URL). Existing screenshots have been copied from the old uploads folder so they ship with the deployment. Put your portrait in `public/` and set `profile.portrait.src`, for example `/portrait.webp`. The on-page photo picker is a temporary local preview, not an upload or saved change.

Update `portfolioUpdatedAt` when changing content. Every content or image change needs a new build/deployment. There is no `/admin` or content API anymore. The old `.data` directory is ignored by Git and untouched as a local backup; the application never reads it.

## Vercel deployment

Import this repository into Vercel using the Next.js preset, with `npm run build` as the build command. Use Node.js 24. No database connection or storage configuration is needed. Files in `public/projects/` must be committed with the source.

Remove any old `PORTFOLIO_DATA_DIR` setting: it is no longer used. No filesystem writes occur when visitors open the portfolio.

## Search engine setup — when your domain is ready

Set `profile.siteUrl` in `lib/portfolio-data.ts` to the public origin, or set `PORTFOLIO_ORIGIN` in the deployment environment (takes precedence), then rebuild. Leave this empty until your production URL is chosen, as requested. Until a non-local origin is configured, indexing stays disabled and the sitemap is empty.

SEO includes server-rendered HTML, canonical links, titles and descriptions, Open Graph/X cards, an automatically generated 1200×630 sharing image, Person/ProfilePage/WebSite JSON-LD, `/robots.txt`, and `/sitemap.xml`. The sitemap contains the homepage and published images, not hash fragments or external project websites. Customize `profile.seoTitle` and `profile.seoDescription` if needed; otherwise they are derived from your profile.

Optional `GOOGLE_SITE_VERIFICATION` enables Google's HTML-tag verification. After configuring a live domain and redeploying, verify the site in Search Console and submit `/sitemap.xml`. Search engines control indexing and ranking.

## Checks

```powershell
npm run lint
npm run build
npm test
```

The test suite checks the static content, four live-project URLs, bundled screenshots, contact links, SEO output, removed backend routes, and production page rendering without a database.
