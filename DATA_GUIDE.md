# Data Guide — Investigations and Sample Data

## Purpose
Help you safely use the real-world samples in `investigations/*` to reproduce and fix issues.

## Folder Structure
- `investigations/DDMMMYYYY[-N]/`
  - `*.csv` — input data used in tests
  - `*.txt` — AWS/Shopify error logs
  - Optional notes (`*.md`/`*.docx`)

## How to Use
1. Pick a folder that matches your scenario (e.g., parent/variant failures)
2. Review the `.txt` log to understand the failure signature
3. Use the CSV as input to local tooling or staging
4. Iterate with small changes; record what fixed the issue

## Common Patterns to Check
- Scientific notation IDs (e.g., `1E+14`) — convert to integer strings
- Orphaned variants — ensure parent exists in same batch
- Missing option names on parent — required for variants
- Large datasets — consider batching; watch for DB timeouts
- Field mismatches — GraphQL input shape must match schema

## Safety & Privacy
- No PII should be present; treat sample data as sensitive regardless
- Do not upload investigation CSVs to public services
- Keep usage scoped to internal/staging environments

## Contributing New Cases
- Create a new dated folder under `investigations/`
- Include: failing CSV, error log, and a short `README.md` summarizing root cause
- Prefer minimal repros (smallest dataset that triggers the issue)

## Related Docs
- `AI_ONBOARDING_CONTEXT.md` — recent investigation summaries
- `winzer-middleware-documentation.html` — data flow and GraphQL details
- `winzer-product-data-map.html` — field mapping references
