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

Shared details and English content live in **`data/portfolio.ts`**:

- `profile`: name, position, bio, availability, email, phone, WhatsApp, portrait, social links, and SEO settings.
- `projects`: project cards in display order. Includes Standup.io, Omdehforoosh, Hatef Tejarat, and Khoodro24.
- `experience`: companies, roles, dates, descriptions, and website links.
- `services`: service titles and descriptions.

To add a project, copy an existing project object, give it a unique `id`, set its title, description, website URL, and image, then redeploy. Set `published: false` to hide it. Use `category: "Projects"` or `"Explorations"`. The fallback preview can be `"wellness"`, `"editorial"`, `"dashboard"`, or `"mobile"` when no image is provided.

Put project screenshots in **`public/projects/`** and reference them as `/projects/filename.png` (omit `public` in the URL). Existing screenshots have been copied from the old uploads folder so they ship with the deployment. Put your portrait in `public/` and set `profile.portrait.src`, for example `/portrait.webp`. The on-page photo picker is a temporary local preview, not an upload or saved change.

Update `portfolioUpdatedAt` when changing content. Every content or image change needs a new build/deployment. There is no `/admin` or content API anymore. The old `.data` directory is ignored by Git and untouched as a local backup; the application never reads it.

## Languages

English is served at `/` and Arabic at `/ar`. The flag-and-language dropdown in the top header preserves the current section. Both pages are rendered statically with their own HTML language, direction, translated content, and metadata. Arabic uses a self-hosted Noto Sans Arabic font; the name and project brands keep their original spelling.

Edit interface translations in `data/locales/en.ts` and `data/locales/ar.ts`. Arabic project descriptions, roles, dates, services, and SEO copy live in `data/portfolio-ar.ts`, matched by ID to the shared content. Add an Arabic entry there when adding a project or service; missing translations fall back to the original English entry. Links, images, contact details, ordering, and publication status remain shared, so they only need updating once.

Geist, Geist Mono, and Noto Sans Arabic are bundled in `public/fonts` with their SIL Open Font License. Builds and visitors do not need to contact Google Fonts.

## Vercel deployment

Import this repository into Vercel using the Next.js preset, with `npm run build` as the build command. Use Node.js 24. No database connection or storage configuration is needed. Files in `public/projects/` must be committed with the source.

Remove any old `PORTFOLIO_DATA_DIR` setting: it is no longer used. No filesystem writes occur when visitors open the portfolio.

## Search engine setup — when your domain is ready

Set `profile.siteUrl` in `data/portfolio.ts` to the public origin, or set `PORTFOLIO_ORIGIN` in the deployment environment (takes precedence), then rebuild. Leave this empty until your production URL is chosen, as requested. Until a non-local origin is configured, indexing stays disabled and the sitemap is empty.

SEO includes server-rendered HTML, canonical and English/Arabic alternate links, localized titles and descriptions, Open Graph/X cards, an automatically generated 1200×630 sharing image, Person/ProfilePage/WebSite JSON-LD, `/robots.txt`, and `/sitemap.xml`. Once a domain is set, the sitemap includes both language pages and published images, not hash fragments or external project websites. Customize `profile.seoTitle` and `profile.seoDescription` if needed; otherwise they are derived from your profile.

Optional `GOOGLE_SITE_VERIFICATION` enables Google's HTML-tag verification. After configuring a live domain and redeploying, verify the site in Search Console and submit `/sitemap.xml`. Search engines control indexing and ranking.

## Checks

```powershell
npm run lint
npm run build
npm test
```

The test suite checks the static content, four live-project URLs, bundled screenshots, contact links, SEO output, removed backend routes, and production page rendering without a database.

## Code organization

Vertical scrolling is native on every screen size: no section snapping, scroll-triggered reveals, keyboard interception, or automatic scroll correction on resize. Only the up/down section buttons request a GSAP transition. Section links and navigation dots jump instantly. Wheel, touch, or scrolling keys cancel an active transition, and reduced-motion preferences disable it. Below the `hero` breakpoint, content sections can grow naturally beyond the viewport.

- `app/`: Next.js routes, layout, global design tokens, and metadata endpoints.
- `components/portfolio/sections/`: one component per page section; each owns its interaction state.
- `components/portfolio/`: shared controls, social links, project cards, dialog, and the page composition.
- `components/portfolio/previews/`: fallback project artwork.
- `hooks/`: GSAP section navigation and animation behavior.
- `data/`: your editable content object and section definitions.
- `types/`: shared content types.
- `lib/`: public-content selection and server-only SEO helpers.
- `public/`: portrait and project screenshots.
- `tests/`: production checks.

Icons use named imports from the Ant Design set in `react-icons/ai`. Shared action arrows and the social-icon mapping live in `components/portfolio/ui.tsx`. Decorative icons are hidden from screen readers; their buttons and links keep readable labels.

Use `npm run format` to format source files and `npm run format:check` to check formatting. Keep two-space indentation, double quotes, semicolons, and descriptive component names. Keep section-specific state and handlers alongside their section instead of adding them to the page component.
