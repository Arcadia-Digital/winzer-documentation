# AI Agent Onboarding Context for Winzer Project

**Purpose**: Essential context for AI agents to immediately understand the Winzer project, history, and priorities

---

## 🎯 Project Overview

**Winzer eCommerce Platform**: Multi-brand Shopify Plus solution with custom middleware, SearchSpring integration, and multi-region support

**Key Challenge**: Client (non-technical users) uploads product CSVs to middleware which imports them into Shopify. CSV validation issues cause frequent failures.

**Current Priority**: CSV validation and data quality to prevent upload failures.

---

## 🔍 Recent Investigation Context (October 2025)

### Problem Statement
Client experiencing "unknown field" errors when uploading product CSVs to Winzer Middleware. Multiple investigation files in `/investigations/` show recurring failure patterns.

### Key Findings

**Investigation Files Location**: `/investigations/20OCT2025/` through `/investigations/21OCT2025-8/`

**Critical Discoveries**:

1. **GraphQL Field Mapping Issues** (21OCT2025-5, 21OCT2025-7)
   - Parent products with variants failing during variant creation
   - "Unknown field" errors in `ProductVariantsBulkInput` GraphQL mutations
   - Root cause: Field structure mismatch between adapter and GraphQL schema

2. **Orphaned Variants** (21OCT2025-6)
   - Variants referencing parent products not in the same CSV
   - Results in "0 products processed"

3. **Database Timeouts** (21OCT2025-8)
   - Large datasets (16+ variants) causing PostgreSQL timeouts
   - ~4.5 minute timeout during product updates

4. **Success Cases** (21OCT2025-4)
   - Single products without parents: ✅ Works perfectly
   - Clean CSV data with proper structure: ✅ Success

### Data Quality Issues Found

**Common CSV Problems**:
- Scientific notation IDs (`1E+14` instead of `100000000000000`)
- SQL injection attempts in data fields
- Extra empty columns causing parsing issues
- Missing option names on parent products
- Orphaned variants without parents

---

## 🛠️ Solutions Implemented

### CSV Validator Tool (Deprecated)
**Status**: Deprecated and removed from this repository during handoff. Investigation files and documentation remain for historical context.

---

## 📂 Project Structure

### Documentation
- Root level: `*.html` files (rendered documentation)
- Source: `*.md` files (markdown source)
- Main entry: `index.html`

### Code
- `/code/winzer-main/`: Shopify theme, SearchSpring app
- `/code/winzer-middleware/`: C# .NET 6 middlewares

### Investigations
- `/investigations/20OCT2025/`: Initial CSV validation failure tests
- `/investigations/21OCT2025/`: Various test scenarios
- Pattern: CSV file + AWS error log (.txt) in each folder

### Tools
- Internal documentation and investigation datasets (see `investigations/*`)

---

## 🎯 Current Development Priorities

### Immediate
1. **Fix GraphQL field mapping** in variant creation
2. **Improve error handling** for large datasets
3. **Enhance CSV validator** with new failure patterns
4. **Document solutions** for common issues

### Short-term
1. Add dataset size warnings to validator
2. Implement batching for large uploads
3. Improve parent product validation
4. Create troubleshooting guides

### Long-term
1. Reduce technical debt in middleware
2. Improve client UX for data export
3. Build automated testing suite
4. Create video tutorials

---

## 🧠 Key Technical Context

### Middleware Architecture
- **Language**: C# .NET 6
- **Database**: PostgreSQL (Npgsql)
- **API**: GraphQL via Shopify Admin API
- **Deployment**: AWS Lambda, ECS
- **Key Service**: `ProductFeedService.cs` handles CSV imports

### CSV Format
- **37 columns** required
- **Parent products**: Have option names, no variants
- **Variants**: Reference parent via PARENT_PRODUCT_ID
- **Encoding**: UTF-8
- **Max size**: 10MB

### Common Code Patterns
```csharp
// GraphQL adapter pattern
ShopifyGraphQLProductVariantsBulkInputAdapter(product, variant)

// Error handling pattern
if (result.IsSuccessful()) {
    // success path
} else {
    var errors = result.ErrorList();
    throw new Exception($"Error: {errors.First().message}");
}
```

---

## 🚨 Known Issues & Patterns

### "Unknown Field" Errors
**Pattern**: Parent products with variants fail during variant creation
**Location**: `ProductService_CreateProduct.cs:200`
**Status**: Root cause identified, fix pending

### Database Timeouts
**Pattern**: Large datasets (>15 variants) cause timeouts
**Location**: Entity Framework save operations
**Status**: Performance optimization needed

### Orphaned Variants
**Pattern**: Variants without parent products in CSV
**Prevention**: CSV validator catches this
**Status**: ✅ Solved with validation

### Scientific Notation IDs
**Pattern**: Excel converts large numbers to 1E+14 format
**Prevention**: CSV validator catches this
**Status**: ✅ Solved with validation

---

## 📊 Success Metrics

### Before CSV Validator
- **Upload Success Rate**: ~30%
- **Time to Resolve**: 2-3 hours per failure
- **Client Self-Sufficiency**: Low (needed technical support)

### After CSV Validator
- **Upload Success Rate**: Expected 95%+
- **Time to Resolve**: 5-10 minutes (catch issues before upload)
- **Client Self-Sufficiency**: High (can validate independently)

---

## 💡 AI Agent Best Practices

### When Helping with This Project

**DO**:
- ✅ Reference investigation files when debugging
- ✅ Suggest practical, working code (not just guidance)
- ✅ Explain the "why" behind decisions
- ✅ Use existing patterns from the codebase
- ✅ Consider non-technical user experience

**DON'T**:
- ❌ Suggest theoretical solutions without implementation
- ❌ Ignore existing code patterns
- ❌ Overcomplicate simple problems
- ❌ Skip error handling
- ❌ Make assumptions about data quality

### Answer Style
- **Be direct** and pragmatic
- **Provide code**, not just explanations
- **Anticipate needs** - suggest next steps
- **Reference real data** from investigation files
- **Think long-term** - maintainable solutions

---

## 🎓 Learning from History

### Key Lessons from Investigations

1. **Data Quality Matters**: Clean data = fewer bugs
2. **Validation Early**: Catch issues before they reach the system
3. **User-Friendly Tools**: Non-technical users need simple solutions
4. **Performance at Scale**: Large datasets need special handling
5. **Clear Error Messages**: Help users understand what went wrong

### Evolution of Solutions

**V1**: Manual CSV inspection (labor-intensive)
**V2**: CSV validator with basic checks (good start)
**V3**: Enhanced validator with all known issues (current)
**V4**: Automated fixes + batching (future)

---

## 🔗 Critical Files Reference

### Must-Read for Context
  (CSV validator removed in handoff; see investigations and docs instead)
- `ProductFeedService.cs` - Main CSV processing
- Investigation files - Real-world failure data
- `schema.graphql` - GraphQL schema reference

### Key URLs in Project
- GitHub Repo: winzer-documentation
- Main Docs: index.html
- Investigation Examples: investigations/21OCT2025-4/

---

## 🎯 Your Mission as AI Agent

**Help the client**:
- Build reliable solutions that prevent errors
- Create tools non-technical users can operate
- Document everything clearly
- Solve real problems, not theoretical ones

**Key Focus Areas**:
1. CSV data quality and validation
2. Middleware reliability and error handling
3. User-friendly documentation
4. Performance optimization
5. Client self-sufficiency

---

## ⚡ Quick Actions for Common Tasks

### "Help debug a CSV upload failure"
1. Check investigation files for similar patterns
2. Validate CSV structure against documented requirements
3. Review error logs for specifics
4. Suggest targeted fix

### "Add a new validation check"
1. Review existing data handling and documented requirements
2. Follow the pattern
3. Add appropriate error messages
4. Update documentation

### "Understand an error in the logs"
1. Read the full AWS log file
2. Trace back to source code location
3. Check investigation files for context
4. Identify root cause, not just symptom

---

**Remember**: You're helping build a system that non-technical users must operate successfully. Prioritize clarity, reliability, and usability over clever technical solutions.

---

## ✅ What's Next for Client Team

- Focus on middleware GraphQL field mapping fixes for variant creation
- Add batching/backoff to mitigate DB timeouts on large uploads
- Continue codifying failure patterns from `investigations/*` into process docs

