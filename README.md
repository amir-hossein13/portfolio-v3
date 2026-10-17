# Amir.H Attarnia — Portfolio

Next.js portfolio with a private content editor, SQLite persistence, and image uploads. Requires **Node.js 24 or newer**; SQLite uses Node's built-in `node:sqlite` module.

## Run locally

```powershell
npm install
npm run build
npm run start -- --port 3002
```

For development, use `npm run dev -- --port 3002` instead.

- Public portfolio: `http://localhost:3002/`
- Content editor: `http://localhost:3002/admin`

## First admin sign-in

1. Open `/admin`.
2. Open `.data/setup-key.txt` locally and copy the generated key into the setup form.
3. Choose your own password (at least 12 characters) and confirm it.
4. Save the password in your password manager. Subsequent visits only need that password.

There is no default account or default password. The setup key is generated per installation and stops working once the account exists. The key, database, uploads, and credentials are excluded from Git.

## Update your content

The editor includes:

- **Profile:** name, position, bio, availability, email, phone, WhatsApp, portrait, social links, and search/sharing settings.
- **Projects:** covers, descriptions, disciplines, categories, website links, ordering, and draft/published status.
- **Experience:** companies, roles, dates, descriptions, company websites, ordering, and draft/published status.
- **Services:** titles, descriptions, fallback artwork, and ordering.

Click **Save changes** to persist edits. Published items appear immediately on the next public page load; drafts remain private. Empty social links stay hidden. Uploaded images are stored on the server, not as temporary browser previews. Changing an image in the editor requires saving the content to make it public.

Your initial profile and Webino role are prefilled with the supplied dates, `Oct 2025 – Jan 2026`. Your bio and projects are intentionally empty until you add them.

## Storage and hosting

Data is stored in `.data/portfolio.sqlite`; images are stored in `.data/uploads/`. This is a persistent Node server application. Deploy it to a host with a **writable persistent volume** and Node 24+. Ephemeral/serverless filesystems, including a default Vercel deployment, will not preserve SQLite or uploads. For those platforms, replace this storage adapter with a hosted database and object storage first.

Optional environment variables:

| Variable | Purpose |
| --- | --- |
| `PORTFOLIO_DATA_DIR` | Absolute path to the persistent storage folder; defaults to `.data` in the project directory. |
| `PORTFOLIO_ORIGIN` | Canonical origin, such as `https://your-domain.com`, for same-origin write validation and secure cookies behind a reverse proxy. |
| `GOOGLE_SITE_VERIFICATION` | Optional Google Search Console verification token. |

Use HTTPS on a public deployment. When `PORTFOLIO_ORIGIN` uses HTTPS, admin cookies use the Secure flag. Mutating endpoints also enforce same-origin requests, authenticated sessions, input limits, and server-side validation. Passwords use salted scrypt hashes; sessions are stored as token hashes and expire after seven days. Incorrect sign-in attempts are rate limited.

## Search engine setup

In **Admin → Profile → Search & sharing**, set the live website URL and optionally customize the search title and description. `PORTFOLIO_ORIGIN`, when set, overrides the editor's domain and should match the public HTTPS origin. Until a non-local domain is configured, the homepage is `noindex`, robots disallows crawling, and the sitemap contains no URLs; no fake production domain is emitted.

The homepage uses server-rendered content, Next.js metadata, a canonical URL, Open Graph and X cards, an automatically generated 1200×630 sharing image, and Person/ProfilePage/WebSite JSON-LD. `/sitemap.xml` uses the saved content modification date and published images. `/robots.txt` advertises the sitemap while excluding admin and data endpoints. Admin pages and API endpoints also send noindex headers. Draft content never enters public structured data or the sitemap. Sections share one URL, so the sitemap correctly lists the homepage rather than hash fragments or nonexistent pages.

After deploying, verify the live URL, `/robots.txt`, `/sitemap.xml`, and sharing preview. Add the domain in Google Search Console and submit `/sitemap.xml`. Set `GOOGLE_SITE_VERIFICATION` if using HTML-tag verification. This implements technical SEO; search engines decide indexing and ranking. Add genuine project descriptions, useful image descriptions, and your own bio through the editor for stronger content.

## Backups

The editor's **Download content backup** exports the saved profile and content as JSON. It does not include image bytes. For a complete backup, stop the server, copy the entire `.data` folder (or your configured data folder), and restart. Restore that folder on the same Node runtime before starting the app. Do not commit it to the repository.

## Checks

```powershell
npm run lint
npm run build
npm run test:backend
```

The backend integration test starts a production server with a separate temporary database. It checks authorization, one-time setup, hashed credentials, draft isolation, validation, stale-edit protection, image uploads, publication, ordering, persistence after restart, session revocation/expiry, and login rate limiting. It never changes your real portfolio data.
