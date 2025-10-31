# Winzer eCommerce Platform — Handoff Guide

Audience: New maintainers taking over the Winzer multi-brand Shopify+ platform and middleware.

## Start Here
- Read `winzer-documentation.html` for the storefront/theme overview
- Read `winzer-middleware-documentation.html` for AWS/.NET middleware architecture
- Open `index.html` locally to browse all docs (double-click to open in a browser)
- Browse `investigations/` to understand real failure patterns and data

## Source Layout
- `code/winzer-main/` — Shopify Dawn custom theme, SearchSpring React app, brand sites
- `code/winzer-middleware/` — .NET 6 middleware (Lambda/ECS), SQL, resources
- `investigations/` — Real CSVs + logs grouped by date for reference
- `*.html` — Rendered docs; `*.md` — source docs

## Local Preview
- Quick local preview for HTML docs:
  - macOS/Linux: `python3 -m http.server 8080` then open `http://localhost:8080/`
  - Windows: `py -m http.server 8080`

## Development (High-Level)
- Theme: see `code/winzer-main/README.md` and SearchSpring `searchspring/winzer/`
- Middleware: open `Winzer.ShopifyMiddleware.sln`; build with .NET 6 SDK
- Data: use `Resources/*.csv` and `investigations/*` for realistic tests

## Operational Runbooks
- Shopify theme deploy: see `code/winzer-main/scripts/` and `README.md`
- Middleware deploy: see `code/winzer-middleware/build/` and `README.md`
- Incident triage: start with `investigations/*` patterns; check CloudWatch for middleware
- SearchSpring issues: verify metafield formats and SearchSpring config (see docs)

## Security & Secrets
- No secrets should be in this repo. See `SECURITY.md` for verification scope and how to report.

## What Changed in Handoff
- Removed CSV Validator (deprecated) and its links
- Added repo hygiene: `.gitignore`, `.editorconfig`, `.gitattributes`
- Added minimal project policies and CI checks for docs (optional)

## Next Steps (Suggested)
- Prioritize middleware GraphQL field mapping fixes and batching for large datasets
- Continue using `investigations/*` to codify guardrails and user-facing guidance

## Support Ownership
- Primary owner: Winzer team
- Historical context: `AI_ONBOARDING_CONTEXT.md`, `DEVELOPER_HANDOFF.md`, `DEPLOYMENT.md`
