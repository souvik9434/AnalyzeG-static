# AnalyzeG Static

## Deployment

- Hosting is Cloudflare Pages, built from Git with `npm run build`; output is `dist/`.
- `public/_headers` and `public/_redirects` are the Cloudflare Pages configuration. Do not add Netlify or Apache hosting files.
- Cloudflare serves clean extensionless URLs (for example `/features` and `/for-reviewers`); `.html` URLs 308-redirect to the clean form. Canonicals, sitemap entries, and internal links must use clean URLs.

## Validation

- Run `npm run build` and `npx tsc --noEmit` before pushing.
- Verify generated canonicals, sitemap coverage, and JSON-LD in `dist/`.
