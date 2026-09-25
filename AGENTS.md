# AnalyzeG Static

## Deployment

- Hosting is Cloudflare Pages, built from Git with `npm run build`; output is `dist/`.
- `public/_headers` and `public/_redirects` are the Cloudflare Pages configuration. Do not add Netlify or Apache hosting files.
- Cloudflare serves clean extensionless URLs (for example `/features` and `/for-reviewers`); `.html` URLs 308-redirect to the clean form. Canonicals, sitemap entries, and internal links must use clean URLs.
- Keep legacy redirect targets clean too: `/sample-analyzeg-reviews.csv /trust 301`, not `/trust.html` (that caused a redirect hop and a Search Console "Redirect error").

## Validation

- Run `npm run build` and `npx tsc --noEmit` before pushing.
- Verify generated canonicals, sitemap coverage, and JSON-LD in `dist/`.

## Search Console (BrowserOS Neo, endpoint http://127.0.0.1:9010/mcp)

- Property: `sc-domain:analyzeg.co.in`. Sitemap `https://analyzeg.co.in/sitemap.xml` is submitted and Success with 25 discovered pages.
- "Request indexing" has a hard daily quota. It cut off after 16 URLs on 2026-09-25 with "Quota Exceeded — please try submitting this again tomorrow". Do not retry in a loop; record progress and resume the next day.
- Inspections must run one URL at a time. Three parallel inspections all stall in "Retrieving data from Google Index".
- Google UI automation details that cost real time: `browser.input().fill()`/`.click()` are no-ops on this UI. Set the value through the native input setter plus a bubbled `input` event, dispatch a `keydown` Enter on the element, and click `div[role=button]` with a `div.click()` via `browser.evaluate`. Read state from `document.body.innerText` via evaluate; the accessibility snapshot misses the "Indexing requested" confirmation.
- Inspections that look like failures are often success: the confirmation can appear without the reCAPTCHA challenge, and a reCAPTCHA iframe can also appear after success.

## Indexing progress (2026-09-25)

Requested and confirmed: `/`, `/features`, `/for-reviewers`, `/about`, `/analyzeg-faq`, `/trust`, `/compare/bazaarvoice-alternative`, `/compare/yotpo-alternative`, `/compare/trustpilot-alternative`, `/compare/powerreviews-alternative`, `/compare/reviews-io-alternative`, `/industry/d2c-brands`, `/industry/beauty-skincare`, `/industry/fmcg`, `/solutions/fake-review-detection`, `/solutions/ad-intelligence`.

Still to request: `/solutions/market-research`, `/solutions/consumer-data`, and the seven `/blog/*` posts.
