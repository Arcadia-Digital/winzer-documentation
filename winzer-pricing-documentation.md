# Winzer Pricing System Documentation

**Complete guide to pricing display logic, rules, and implementation across OneSource, Winzer, and FastServ brands.**

---

## Table of Contents
- [Overview](#overview)
- [Price Priority Order](#price-priority-order)
- [OneSource Pricing](#onesource-pricing)
- [Winzer & FastServ Pricing](#winzer--fastserv-pricing)
- [Price Rounding Rules](#price-rounding-rules)
- [Catalog Assignment Logic](#catalog-assignment-logic)
- [Pricing API](#pricing-api)
- [Frontend Implementation](#frontend-implementation)
- [Troubleshooting](#troubleshooting)
- [Technical Reference](#technical-reference)

---

## Overview

The Winzer platform uses a sophisticated multi-tier pricing system that varies by brand:

- **OneSource**: Bulk pricing with quantity breaks, template pricing in Shopify catalogs
- **Winzer**: B2B pricing with exact 4-decimal precision, contract/last purchase/template pricing
- **FastServ**: B2B pricing with exact 4-decimal precision, contract/last purchase/template pricing

**Critical**: Each brand handles pricing differently. Understanding these rules is essential for troubleshooting pricing issues.

---

## Price Priority Order

### Winzer & FastServ Priority Hierarchy

When multiple pricing types exist for a customer, the system uses this priority order:

1. **Contract Pricing** (Highest Priority)
   - Stored in `contract_pricing` database table
   - Assigned via Shopify Catalogs (`Contract_{COMPANY_ID}`)
   - Always takes precedence over other pricing types
   - Middleware prevents items from appearing in last purchase catalogs if they exist in contract catalogs
   - **Source**: ERP contract agreements

2. **Last Purchase Pricing**
   - Stored in `last_purchase_pricing` database table
   - Assigned via Shopify Catalogs (`Company_{COMPANY_ID}`)
   - Used when no contract pricing exists
   - Based on customer's previous purchase history from ERP
   - **Source**: Historical order data

3. **Template Pricing**
   - Stored in `template_pricing` database table
   - **NOT** assigned via Shopify Catalogs (pulled via API only)
   - Used when no contract or last purchase pricing exists
   - Company must have `cql.template_pricing` metafield set
   - **Template Types**: FRANCHISE, LOW_MRO, INN1, GS01, FASTSERV
   - **Source**: Template pricing agreements (e.g., franchise pricing)

4. **Base Shopify Price** (Fallback)
   - Standard variant price in Shopify
   - Used when no customer-specific pricing exists
   - **Source**: Default product pricing

### OneSource Priority Hierarchy

OneSource uses a simpler pricing model:

1. **Template Pricing** (via Shopify Catalog)
   - Assigned directly to Shopify catalogs
   - Not API-only like Winzer/FastServ
   - Base price for all customers

2. **Bulk Pricing** (Quantity Breaks)
   - Applied on top of template pricing
   - Quantity breaks determine final price
   - Fetched via API: `/apps/pricing-api/bulk-pricing`

---

## OneSource Pricing

### Key Characteristics

- **Bulk Pricing Enabled**: Quantity breaks determine price
- **No Exact Pricing**: Prices rounded to nearest cent (no 4-decimal display)
- **Template Pricing in Catalogs**: Uses template pricing directly in Shopify catalogs (not API-only)
- **Bulk Pricing Table**: Shows quantity breaks on Product Detail Page (PDP)
- **Public Access**: No login required to see pricing

### Price Display Rules

1. **Base Price**: From Shopify catalog (template pricing)
2. **Quantity Breaks**: Applied via bulk pricing API
3. **Display**: Shows base price, bulk pricing table shows all quantity tiers
4. **No Exact Pricing Link**: "See .0000 Pricing" feature not available

### Bulk Pricing Implementation

**API Endpoint:**
```
GET /apps/pricing-api/bulk-pricing?variant_ids={variantIds}
```

**Response Format:**
```json
[
  {
    "variant_id": "123456",
    "quantity_breaks": [
      { "quantity": 1, "price": "10.00" },
      { "quantity": 10, "price": "9.50" },
      { "quantity": 50, "price": "9.00" }
    ]
  }
]
```

**PDP Display:**
- Bulk pricing table appears below product price
- Shows all quantity tiers
- Updates dynamically when variant changes
- Hidden if no bulk pricing available

**Code Location:**
- `code/winzer-main/sites/_shared/assets/global.js` - `updateBulkPricing()` method
- `code/winzer-main/sites/_shared/sections/main-product.liquid` - Bulk pricing table block

---

## Winzer & FastServ Pricing

### Key Characteristics

- **Exact Pricing Enabled**: 4-decimal pricing available via API
- **Force Sign-In**: Must be logged in to see pricing
- **B2B Pricing**: Customer-specific pricing based on company agreements
- **Exact Pricing Link**: "See .0000 Pricing" appears on PDP (non-OneSource stores only)
- **Multiple Pricing Tiers**: Contract, last purchase, template, or base pricing

### Price Display Rules

#### Initial Display (Shopify Catalog Price)

1. **Price Source**: Shopify catalog price (rounded to nearest cent)
   - Contract pricing → Last purchase pricing → Base price
2. **Display Format**: 2 decimal places (e.g., $10.50)
3. **Conditional Display**: 
   - If price >= $1,000,000 or <= $0: Shows "Not available to purchase"
   - Otherwise: Shows rounded price

#### Exact Pricing (4-Decimal Precision)

1. **Trigger**: Customer clicks "See .0000 Pricing" link
2. **API Call**: `/apps/pricing-api/customer-product-pricing?current_company_id={companyId}&product_ids={productId}`
3. **Response**: 4-decimal precision pricing (e.g., "61.6440", "2.0064")
4. **Display Update**: Price updates to show 4 decimal places
5. **Link Removal**: Link disappears after successful fetch

### Price Display Conditions

**Normal Pricing:**
- Shows rounded price (2 decimals) by default
- Shows exact price (4 decimals) after "See .0000 Pricing" click

**Not Available:**
- Price >= $1,000,000 or <= $0
- Shows "Not available to purchase" message
- Exact pricing link hidden

**Template Pricing Fallback:**
- If company has `cql.template_pricing` metafield AND price >= $1,000,000
- Shows "See pricing" instead of "Not available to purchase"
- Allows customers to request pricing for non-catalog items

### Implementation Details

**PDP Code:**
```liquid
{% if pdp_storename != onesource_store_name_string and customer != nil %}
  <div class="no-js-hidden pdp__exact-pricing">
    {% unless sofa_variant.price >= 1000000 or sofa_variant.price <= 0 %}
      {% render 'exact-pricing' %}
    {% endunless %}
  </div>
{% endif %}
```

**Price Validation:**
```liquid
{% if sofa_variant.price >= 1000000 or sofa_variant.price <= 0 %}
  <h5 style="margin:0">{{ 'products.product.not_in_catalog' | t }}</h5>
{% else %}
  {%- render 'price', product: product, use_variant: true, show_badges: false, price_class: 'price--large' -%}
{% endif %}
```

**JavaScript Implementation:**
- `code/winzer-main/sites/_shared/assets/global.js` - `fetchExactPrice()` function
- `code/winzer-main/sites/_shared/assets/four-decimal-pricing.js` - Add to cart integration
- `code/winzer-main/sites/_shared/snippets/exact-pricing.liquid` - Link and tooltip

---

## Price Rounding Rules

### OneSource

**Rounding Method:**
```csharp
Math.Ceiling(price * 100) / 100
```

**Application:**
- Applied during pricing feed import
- All prices rounded to nearest cent
- No 4-decimal precision available

**Example:**
- Input: `10.1234` → Output: `10.13`
- Input: `10.1201` → Output: `10.13`

### Winzer & FastServ

**Shopify Catalog Prices:**
- Rounded to nearest cent: `Math.Ceiling(price * 100) / 100`
- Applied during pricing feed import
- Displayed with 2 decimal places

**Exact Pricing API:**
- Returns 4-decimal precision (e.g., "61.6440", "2.0064")
- Not rounded in API response
- Displayed with 4 decimal places after user clicks "See .0000 Pricing"

**Display Behavior:**
- **Default**: 2 decimals (e.g., $10.50)
- **After Exact Pricing Click**: 4 decimals (e.g., $10.5000)

---

## Catalog Assignment Logic

### Winzer & FastServ Catalog System

The middleware creates and manages Shopify catalogs to assign pricing to companies.

#### Contract Catalogs

**Naming Convention:**
```
Contract_{COMPANY_ID}
```

**Characteristics:**
- Created for each company with contract pricing
- Highest priority in Shopify's catalog system
- Contains variants with contract-specific pricing
- Prevents items from appearing in last purchase catalogs

**Creation Process:**
1. Middleware identifies contract pricing in CSV feed
2. Creates catalog if it doesn't exist
3. Creates associated price list
4. Creates publication for catalog
5. Assigns catalog to company locations

#### Last Purchase Catalogs

**Naming Convention:**
```
Company_{COMPANY_ID}
```

**Characteristics:**
- Created for each company with last purchase pricing
- Lower priority than contract catalogs
- **Important**: Middleware prevents items from being added to last purchase catalog if they already exist in contract catalog (to maintain priority)

**Creation Process:**
1. Middleware identifies last purchase pricing in CSV feed
2. Checks if variant exists in contract catalog
3. If not in contract catalog, adds to last purchase catalog
4. Creates catalog, price list, and publication if needed
5. Assigns catalog to company locations

#### Template Pricing

**Catalog Assignment:**
- **NOT** assigned via Shopify Catalogs
- Stored in database only (`template_pricing` table)
- Retrieved via Pricing API when company has `cql.template_pricing` metafield

**Why Not in Catalogs:**
- Historical decision (WSSBPB-617)
- Template pricing pulled via API for flexibility
- Allows dynamic pricing without catalog updates

### OneSource Catalog System

**Template Pricing:**
- Assigned directly to Shopify catalogs
- Not API-only like Winzer/FastServ
- Simpler catalog structure

---

## Pricing API

### Endpoints

#### Customer Product Pricing

**Endpoint:**
```
GET /apps/pricing-api/customer-product-pricing?current_company_id={companyId}&product_ids={productId}
```

**Purpose:**
- Get exact 4-decimal pricing for B2B customers
- Returns customer-specific pricing based on priority order
- Used by PDP and PLP for exact pricing display

**Parameters:**
- `current_company_id`: Shopify company ID (from `customer.current_company.id`)
- `product_ids`: Comma-separated product IDs

**Response Format:**
```json
[
  {
    "product_id": "123456",
    "variants": [
      {
        "id": "789012",
        "price": "61.6440"
      },
      {
        "id": "789013",
        "price": "2.0064"
      }
    ]
  }
]
```

**Pricing Priority Logic:**
1. Check contract pricing for company
2. If not found, check last purchase pricing
3. If not found, check template pricing (if company has `cql.template_pricing` metafield)
4. If not found, return base Shopify price

#### Bulk Pricing

**Endpoint:**
```
GET /apps/pricing-api/bulk-pricing?variant_ids={variantIds}
```

**Purpose:**
- Get quantity break pricing for variants
- Used by OneSource for bulk pricing table
- Used by SearchSpring PLP for quantity-based pricing

**Parameters:**
- `variant_ids`: Comma-separated variant IDs

**Response Format:**
```json
[
  {
    "variant_id": "123456",
    "quantity_breaks": [
      { "quantity": 1, "price": "10.00" },
      { "quantity": 10, "price": "9.50" },
      { "quantity": 50, "price": "9.00" }
    ]
  }
]
```

### API Implementation

**Backend:**
- Managed by CQL Corp
- Custom pricing integration
- Connects to PostgreSQL database for pricing data
- Integrates with Oracle ERP for real-time pricing

**Database Tables:**
- `contract_pricing` - Contract-specific pricing
- `last_purchase_pricing` - Last purchase pricing
- `template_pricing` - Template pricing
- `bulk_pricing` - Quantity break pricing

---

## Frontend Implementation

### Product Detail Page (PDP)

#### OneSource PDP

**Bulk Pricing Display:**
```liquid
{% if pdp_storename == onesource_store_name_string %}
  <div class="pdp__bulk-pricing accordion js-bulk-pricing-hidden hidden">
    <details id="Details-{{ product.id }}">
      <summary class="pdp__bulk-pricing-toggle-wrap">
        <h2 class="accordion__title pdp__bulk-pricing-toggle">
          {{ block.settings.toggle_txt }}
        </h2>
      </summary>
      <!-- Bulk pricing table -->
    </details>
  </div>
  <p class="pdp__bulk-promo-msg js-bulk-pricing-hidden hidden">
    {{ 'products.product.bulk_pricing.availability_msg' | t }}
  </p>
{% endif %}
```

**JavaScript:**
- `updateBulkPricing()` - Fetches and displays bulk pricing
- `buildBulkPriceTable()` - Renders quantity break table
- Located in `code/winzer-main/sites/_shared/assets/global.js`

#### Winzer & FastServ PDP

**Exact Pricing Link:**
```liquid
{% if pdp_storename != onesource_store_name_string and customer != nil %}
  <div class="no-js-hidden pdp__exact-pricing">
    {% unless sofa_variant.price >= 1000000 or sofa_variant.price <= 0 %}
      {% render 'exact-pricing' %}
    {% endunless %}
  </div>
{% endif %}
```

**Exact Pricing Snippet:**
- `code/winzer-main/sites/_shared/snippets/exact-pricing.liquid`
- Displays "See .0000 Pricing" link with tooltip
- Triggers `fetchExactPrice()` JavaScript function

**Price Display:**
```liquid
{% if sofa_variant.price >= 1000000 or sofa_variant.price <= 0 %}
  <h5 style="margin:0">{{ 'products.product.not_in_catalog' | t }}</h5>
{% else %}
  {%- render 'price', product: product, use_variant: true, show_badges: false, price_class: 'price--large' -%}
  <span class="pdp__price-unit-qty"> / 
    {% if sofa_variant.metafields.cql.package_display != blank %}
      {{ sofa_variant.metafields.cql.package_display }}
    {% else %}
      {{ 'products.product.price_unit_qty_default' | t }}
    {% endif %}
  </span>
{% endif %}
```

### SearchSpring (PLP) Pricing Display

**Price Calculation Priority:**
```javascript
function calculatePrice() {
  return props.findExactPrice() ?? (
    props.b2bPrice ?? (
      currentSiteFeatures.b2b_pricing ? <span class="loading-price"></span> : (
        quantityBreakPrice
      )
    )
  )
}
```

**Priority Order:**
1. Exact price (if fetched via API)
2. B2B price (if available)
3. Bulk pricing quantity break price (OneSource only)
4. Base variant price

**Implementation:**
- `code/winzer-main/searchspring/winzer/src/components/ResultVariantRow/ResultVariantRow.js`
- `VariantRowPriceData` component handles price display
- `fetchB2BPricing()` - Fetches B2B pricing for logged-in customers
- `fetchExactPricing()` - Fetches exact 4-decimal pricing

### Price Snippet

**Location:**
- `code/winzer-main/sites/_shared/snippets/price.liquid`
- `code/winzer-main/dawn/snippets/price.liquid`

**Functionality:**
- Renders product or variant price
- Handles sale pricing (compare_at_price)
- Shows "from" price if price varies
- Displays unit price if available

**Usage:**
```liquid
{% render 'price', product: product, use_variant: true, show_badges: false, price_class: 'price--large' %}
```

---

## Troubleshooting

### Price Not Displaying Correctly

**Checklist:**
1. **Identify Brand**: OneSource vs Winzer/FastServ have different rules
2. **Verify Login**: Winzer/FastServ require customer login
3. **Check Catalog Assignment**: Verify company has correct catalog in Shopify
4. **Database Verification**: Check pricing exists in database tables
   - `contract_pricing` table
   - `last_purchase_pricing` table
   - `template_pricing` table
   - `bulk_pricing` table
5. **Company Metafield**: Check `cql.template_pricing` metafield for template pricing
6. **API Logs**: Review Pricing API logs for exact pricing requests
7. **Browser Console**: Check for JavaScript errors

**Common Issues:**
- Customer not logged in (Winzer/FastServ)
- Company not assigned to catalog
- Pricing not imported from ERP
- API endpoint not accessible
- JavaScript errors preventing price fetch

### "Not Available to Purchase" Showing

**Causes:**
- Price is >= $1,000,000 or <= $0
- Product not in company's catalog
- No pricing data for company/variant combination

**Solutions:**
- Check if company has template pricing metafield (should show "See pricing" instead)
- Verify product exists in company's catalog
- Check pricing feed import logs
- Review database for pricing records

### Exact Pricing Not Working

**Checklist:**
1. **Customer Login**: Verify customer is logged in
2. **Company ID**: Check `customer.current_company.id` is set
3. **API Endpoint**: Verify `/apps/pricing-api/customer-product-pricing` is accessible
4. **Browser Console**: Check for API errors
5. **Network Tab**: Verify API request is being made
6. **Response Format**: Check API response format matches expected structure

**Common Issues:**
- `customer.current_company.id` is null
- API endpoint returns error
- CORS issues preventing API call
- JavaScript errors in `fetchExactPrice()` function

### Bulk Pricing Not Showing (OneSource)

**Checklist:**
1. **Variant ID**: Verify variant has bulk pricing data
2. **API Endpoint**: Check `/apps/pricing-api/bulk-pricing` is accessible
3. **JavaScript**: Verify `updateBulkPricing()` is being called
4. **Database**: Check `bulk_pricing` table for variant records
5. **Quantity Breaks**: Verify quantity breaks exist for variant

**Common Issues:**
- No bulk pricing data for variant
- API endpoint not responding
- JavaScript errors preventing table display
- Variant switching not triggering price update

### Price Priority Issues

**Symptoms:**
- Wrong price showing for customer
- Contract price not overriding last purchase price
- Template pricing not showing when expected

**Solutions:**
1. **Verify Priority Order**: Check database for all pricing types
2. **Catalog Assignment**: Verify correct catalog is assigned to company
3. **Middleware Logic**: Check pricing feed import logs for catalog assignment
4. **API Logic**: Review Pricing API code for priority order
5. **Database Query**: Check which pricing type exists for variant/company

---

## Technical Reference

### Database Schema

#### Contract Pricing Table
```sql
contract_pricing
- contract_pricing_id (PK)
- brand_id (OneSource, Winzer, FastServ)
- contract_id (Company external ID)
- shopify_product_id
- shopify_variant_id
- contract_price (decimal)
- utc_created_at
- utc_updated_at
```

#### Last Purchase Pricing Table
```sql
last_purchase_pricing
- last_purchase_pricing_id (PK)
- brand_id
- shopify_company_id
- shopify_product_id
- shopify_variant_id
- last_purchase_price (decimal)
- utc_created_at
- utc_updated_at
```

#### Template Pricing Table
```sql
template_pricing
- template_pricing_id (PK)
- brand_id
- template_name (FRANCHISE, LOW_MRO, etc.)
- shopify_product_id
- shopify_variant_id
- template_price (decimal)
- utc_created_at
- utc_updated_at
```

#### Bulk Pricing Table
```sql
bulk_pricing
- bulk_pricing_id (PK)
- brand_id
- shopify_variant_id
- quantity
- price (decimal)
- utc_created_at
- utc_updated_at
```

### Code Locations

**Middleware:**
- `code/winzer-middleware/src/Winzer.Impl/PricingFeedService.cs` - Pricing import logic
- `code/winzer-middleware/Winzer.Core/Services/ContractPricingService.cs`
- `code/winzer-middleware/Winzer.Core/Services/LastPurchasePricingService.cs`
- `code/winzer-middleware/Winzer.Core/Services/TemplatePricingService.cs`
- `code/winzer-middleware/Winzer.Core/Services/BulkPricingService.cs`

**Frontend:**
- `code/winzer-main/sites/_shared/sections/main-product.liquid` - PDP pricing display
- `code/winzer-main/sites/_shared/snippets/price.liquid` - Price rendering
- `code/winzer-main/sites/_shared/snippets/exact-pricing.liquid` - Exact pricing link
- `code/winzer-main/sites/_shared/assets/global.js` - Pricing JavaScript
- `code/winzer-main/sites/_shared/assets/four-decimal-pricing.js` - Exact pricing integration
- `code/winzer-main/searchspring/winzer/src/components/ResultVariantRow/ResultVariantRow.js` - PLP pricing

### Pricing Feed Import Process

**OneSource:**
1. CSV file downloaded from SFTP
2. Template pricing extracted
3. Bulk pricing extracted
4. Prices rounded to nearest cent
5. Shopify variant prices updated
6. Bulk pricing stored in database

**Winzer & FastServ:**
1. CSV file downloaded from SFTP
2. Pricing type determined (contract, last purchase, template)
3. Pricing stored in appropriate database table
4. Shopify catalogs created/updated
5. Prices rounded to nearest cent
6. Catalogs assigned to company locations

**Priority Logic:**
- Contract pricing → Last purchase pricing → Template pricing
- Middleware prevents duplicate catalog entries
- Contract catalogs take precedence over last purchase catalogs

---

**Last Updated**: 2025-01-XX  
**Maintained By**: CQL Corp / Arcadia Digital  
**Related Documentation**: 
- `HANDOFF.md` - Quick start guide
- `winzer-documentation.md` - Complete platform documentation
- `winzer-middleware-documentation.md` - Middleware system details

