# Release Notes — Handoff

Date: 2025-10-30
Tag: handoff-20251030

## Changes
- Removed CSV Validator (csv-validator.html/js and README) and all references
- Added `.gitignore`, `.editorconfig`, `.gitattributes`
- Added minimal `.eslintrc.json`, `.prettierrc` (no mass reformatting)
- Added `SECURITY.md`, `CONTRIBUTING.md`
- Added CI workflow for link checks and JS lint (optional)
- Created `HANDOFF.md` and `DATA_GUIDE.md`
- Updated `AI_ONBOARDING_CONTEXT.md` with deprecation and next steps

## Known Issues / Next Work
- Middleware: Variant GraphQL input shape mapping needs fixes
- Middleware: Add batching/backoff for large uploads (DB timeouts)
- Continue documenting new failure patterns from `investigations/*`

## Notes
- No history rewrite performed
- Kept `investigations/*` and codebase zip archives intact
