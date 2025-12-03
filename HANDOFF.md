# Winzer eCommerce Platform — Handoff Guide

**Primary entry point for AI agents and developers taking over this platform.**

---

## 🎯 For AI Agents

**Read this first**, then proceed to:
1. `AI_ONBOARDING_CONTEXT.md` - Project history, recent investigations, current priorities, technical context
2. `.cursorrules` - Project-specific AI behavior and coding guidelines
3. `DATA_GUIDE.md` - How to safely use investigation files and sample data

**Quick Context**: Multi-brand Shopify Plus platform with custom .NET middleware. Main challenge: CSV data quality issues causing middleware failures. Use `investigations/*` folders to understand real failure patterns.

---

## 🎯 For Developers

**Start here**, then choose your path:

### Quick Start (10 minutes)
1. Read `CURSOR_QUICK_START.md` if using Cursor
2. Open `index.html` locally (double-click or `python3 -m http.server 8080`)
3. Browse `code/winzer-main/README.md` and `code/winzer-middleware/README.md`

### Full Onboarding (1-2 hours)
1. **Architecture Overview**: `DEVELOPER_HANDOFF.md`
2. **Platform Details**: `winzer-documentation.html` (comprehensive platform guide)
3. **Middleware Details**: `winzer-middleware-documentation.html`
4. **Investigation Patterns**: Browse `investigations/*` and read `DATA_GUIDE.md`

---

## 📚 Document Navigation Guide

### Essential Handoff Documents
- **`HANDOFF.md`** (this file) - Starting point for all new maintainers
- **`RELEASE_NOTES.md`** - What changed during handoff, known issues, next steps
- **`DEVELOPER_HANDOFF.md`** - Architecture overview, platform structure, development setup
- **`DEPLOYMENT.md`** - GitHub Pages deployment guide
- **`winzer-pricing-documentation.md`** - Complete pricing system documentation (display rules, priority order, troubleshooting)

### AI-Specific Documentation
- **`AI_ONBOARDING_CONTEXT.md`** - Project history, investigation summaries, technical context for AI agents
- **`.cursorrules`** - Cursor AI behavior rules (also in Cursor settings)
- **`DATA_GUIDE.md`** - How to use investigation files safely for debugging

### Cursor/AI Tool Setup
- **`CURSOR_QUICK_START.md`** - 10-minute Cursor setup
- **`CURSOR_SETUP_GUIDE.md`** - Detailed Cursor configuration and workflows
- **`CURSOR_ONBOARDING_CHECKLIST.md`** - Structured learning path for new team members
- **`CURSOR_PROMPTS_REFERENCE.md`** - Pre-written prompts for common tasks

### Platform Documentation (HTML)
- **`index.html`** - Documentation hub (open locally or view on GitHub Pages)
- **`winzer-documentation.html`** - Complete platform documentation (storefront, content, products, operations)
- **`winzer-middleware-documentation.html`** - AWS middleware system documentation
- **`winzer-pricing-documentation.html`** - Pricing system documentation (OneSource, Winzer, FastServ)
- **`winzer-product-data-map.html`** - Oracle PIM to Shopify field mapping
- **`winzer-searchspring-documentation.html`** - SearchSpring configuration guide
- **`winzer-shipperhq-documentation.html`** - ShipperHQ shipping rules

### Project Policies
- **`SECURITY.md`** - Security policy and vulnerability reporting
- **`CONTRIBUTING.md`** - Contribution guidelines and branching workflow

---

## 🏗️ Repository Structure

```
winzer-documentation/
├── Documentation
│   ├── index.html                    # Start here - documentation hub
│   ├── winzer-*-documentation.html  # Platform-specific docs
│   └── *.md                          # Markdown source files
├── code/
│   ├── winzer-main/                  # Shopify theme + SearchSpring app
│   │   ├── dawn/                     # Dawn theme customizations
│   │   ├── searchspring/winzer/      # SearchSpring React app
│   │   └── sites/                    # Multi-brand configurations
│   └── winzer-middleware/            # .NET 6 AWS middleware
│       ├── src/                      # Lambda functions, ECS tasks
│       └── Resources/                # Sample CSV files
├── investigations/                   # Real-world error logs and test data
│   └── DDMMMYYYY[-N]/                # Date-organized investigation folders
└── Configuration Files
    ├── .cursorrules                  # Cursor AI behavior rules
    ├── .gitignore                    # Git ignore patterns
    ├── .editorconfig                 # Editor configuration
    └── .eslintrc.json                # JavaScript linting rules
```

---

## 🚀 Quick Start Paths

### Path 1: Using Cursor AI
1. Install Cursor: [cursor.sh](https://cursor.sh)
2. Clone repo: `git clone https://github.com/petebuzzell-ad/winzer-documentation.git`
3. Open in Cursor and add `.cursorrules` to Settings → Rules
4. Follow `CURSOR_QUICK_START.md` for immediate productivity
5. Use `CURSOR_PROMPTS_REFERENCE.md` for common tasks

### Path 2: Traditional Development
1. Clone repository
2. Read `DEVELOPER_HANDOFF.md` for architecture
3. Set up development environment per `code/*/README.md` files
4. Open `index.html` to browse documentation
5. Review `investigations/*` to understand failure patterns

### Path 3: Operations/Incident Response
1. Check `investigations/*` for similar failure patterns
2. Review `DATA_GUIDE.md` for safe data handling
3. Reference `winzer-middleware-documentation.html` for middleware issues
4. Use `RELEASE_NOTES.md` for known issues

---

## 🔧 Local Development

### Preview Documentation Locally
```bash
# From repo root
python3 -m http.server 8080
# Then open http://localhost:8080/ in your browser
```

### Theme Development (`code/winzer-main/`)
```bash
cd code/winzer-main
npm install
# SearchSpring React app
cd searchspring/winzer
npm install
npm run build
```

### Middleware Development (`code/winzer-middleware/`)
```bash
cd code/winzer-middleware
# Requires .NET 6 SDK
dotnet restore
dotnet build
```

---

## 📋 Operational Runbooks

### Deployment
- **Theme**: See `code/winzer-main/scripts/` and README
- **Middleware**: See `code/winzer-middleware/build/` and README
- **GitHub Pages**: See `DEPLOYMENT.md`

### Incident Triage
1. Check `investigations/*` for similar patterns
2. Review AWS CloudWatch logs for middleware errors
3. Verify SearchSpring metafield formats
4. Reference relevant HTML documentation sections

### Data Quality Issues
- Use `DATA_GUIDE.md` for investigation file patterns
- Common issues documented in `.cursorrules` (CSV Data Quality Issues section)
- Real examples in `investigations/*` folders

---

## 🔐 Security & Compliance

- **Security Policy**: See `SECURITY.md`
- **No secrets in repo**: Verified at handoff; use secret managers
- **Contribution Guidelines**: See `CONTRIBUTING.md`

---

## 📝 What Changed in Handoff

See `RELEASE_NOTES.md` for complete details. Summary:
- Removed CSV Validator (deprecated)
- Added repo hygiene configs (`.gitignore`, `.editorconfig`, `.gitattributes`)
- Added linting/formatting configs (ESLint, Prettier)
- Added CI workflow for docs validation
- Created handoff documentation suite

---

## 🎯 Recommended Reading Order

### For New Developers
1. `HANDOFF.md` (this file)
2. `CURSOR_QUICK_START.md` or `DEVELOPER_HANDOFF.md`
3. `winzer-documentation.html` (platform overview)
4. `DATA_GUIDE.md` (understanding investigations)
5. Code READMEs in `code/*/README.md`

### For AI Agents
1. `HANDOFF.md` (this file)
2. `AI_ONBOARDING_CONTEXT.md` (project history and context)
3. `.cursorrules` (behavior guidelines)
4. `DATA_GUIDE.md` (data usage patterns)

### For Operations/Support
1. `HANDOFF.md` (this file)
2. `RELEASE_NOTES.md` (known issues)
3. `DATA_GUIDE.md` (investigation file usage)
4. `winzer-middleware-documentation.html` (middleware details)

---

## 🔗 Key Links

- **Live Documentation**: https://petebuzzell-ad.github.io/winzer-documentation/
- **Repository**: https://github.com/petebuzzell-ad/winzer-documentation
- **Platform Docs**: Open `index.html` locally or view on GitHub Pages

---

## 💰 Pricing Display Logic

**See `winzer-pricing-documentation.md` for complete pricing system documentation.**

**Quick Reference:**
- **OneSource**: Bulk pricing with quantity breaks, template pricing in Shopify catalogs
- **Winzer & FastServ**: B2B pricing with exact 4-decimal precision, contract/last purchase/template pricing priority
- **Price Priority** (Winzer/FastServ): Contract → Last Purchase → Template → Base Shopify Price
- **Key Difference**: OneSource uses catalogs for template pricing; Winzer/FastServ use API for template pricing

For detailed pricing rules, troubleshooting, and implementation details, see the dedicated pricing documentation.

---

## ⚡ Next Steps

**Immediate Priorities** (per `RELEASE_NOTES.md`):
- Fix middleware GraphQL field mapping for variant creation
- Add batching/backoff for large dataset uploads (prevent DB timeouts)
- Continue documenting failure patterns from `investigations/*`

**For New Maintainers**:
- Complete your chosen onboarding path above
- Familiarize yourself with `investigations/*` structure
- Set up local development environment
- Review code READMEs for specific setup instructions

---

**Remember**: This is a handoff and documentation repository. All source code, documentation, and investigation data are preserved for continuity. Start with `HANDOFF.md`, then navigate to the specific documents you need.
