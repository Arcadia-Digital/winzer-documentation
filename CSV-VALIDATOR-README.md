# Winzer CSV Validator

A web-based tool for validating CSV files before uploading to the Winzer Middleware. This tool helps prevent common data quality issues that cause import failures.

## 🚀 Quick Start

1. **Open the tool**: Navigate to `csv-validator.html` in your web browser
2. **Upload your CSV**: Drag and drop your CSV file or click "Browse Files"
3. **Review results**: Check for critical issues, warnings, and recommendations
4. **Fix issues**: Address any problems found before uploading to the middleware

## ✨ Features

### **Comprehensive Validation**
- **File Format**: Ensures proper CSV structure and column count
- **Data Quality**: Detects SQL injection attempts and malformed data
- **ID Validation**: Checks for scientific notation in ID fields
- **Parent-Child Relationships**: Verifies variant products have valid parents
- **Required Fields**: Ensures all mandatory fields are populated
- **Image URLs**: Validates image links are accessible
- **Data Types**: Checks numeric fields, dates, and other data formats
- **Shopify Compatibility**: Ensures data meets Shopify's requirements

### **User-Friendly Interface**
- **Drag & Drop**: Easy file upload with visual feedback
- **Real-time Validation**: Instant results with progress indicators
- **Color-coded Results**: Clear visual indicators for different issue types
- **Detailed Reports**: Comprehensive issue descriptions with row numbers
- **Export Reports**: Download validation reports for record-keeping

## 🔍 Validation Checks

### **Critical Issues** (Must Fix)
- ❌ **Extra Columns**: More columns than expected
- ❌ **Missing Required Columns**: Required fields not present
- ❌ **Scientific Notation IDs**: IDs in scientific notation (e.g., `1E+14`)
- ❌ **SQL Injection**: Suspicious SQL code in data fields
- ❌ **Missing Required Fields**: Empty required fields (ID, PRIMARY_ITEM_NUMBER, etc.)
- ❌ **Orphaned Variants**: Variants without valid parent products in the same file
- ❌ **Parent Product Missing Options**: Parent products without option names for variants
- ❌ **Missing SKU**: Variants without PRIMARY_ITEM_NUMBER (SKU)

### **Warnings** (Should Review)
- ⚠️ **Empty Columns**: Extra empty columns at end of file
- ⚠️ **Invalid Numeric Values**: Non-numeric data in numeric fields
- ⚠️ **Invalid Boolean Values**: Non-boolean data in boolean fields
- ⚠️ **Invalid Weight Units**: Invalid weight unit values
- ⚠️ **Missing Weight Unit**: Weight specified without unit
- ⚠️ **Missing Weight Value**: Weight unit specified without value
- ⚠️ **Option Value Without Name**: Option values without corresponding option names
- ⚠️ **Invalid Image URLs**: Malformed or inaccessible image links
- ⚠️ **Empty Parent IDs**: Variants with empty parent product IDs
- ⚠️ **Empty Parent Description**: Parent products without descriptions
- ⚠️ **Parent Products Without Variants**: Parent products with no child variants

### **Info** (Good to Know)
- ℹ️ **File Statistics**: Row counts, product types, validation summary

## 📊 Understanding Results

### **Success Indicators**
- ✅ **Green Panel**: All checks passed, file ready for upload
- ✅ **Zero Critical Issues**: No blocking problems found
- ✅ **Valid Statistics**: Proper parent/variant counts

### **Warning Indicators**
- 🟡 **Yellow Panel**: Warnings found, review recommended
- ⚠️ **Warning Count**: Number of non-critical issues
- 📋 **Issue List**: Detailed descriptions of problems

### **Error Indicators**
- 🔴 **Red Panel**: Critical issues found, file needs fixing
- 🚨 **Critical Count**: Number of blocking problems
- ❌ **Must Fix**: Issues that prevent successful import

## 🛠️ Common Issues & Solutions

### **Scientific Notation IDs**
**Problem**: Excel exports large numbers as scientific notation (e.g., `1E+14`)
**Solution**: 
1. Format the ID column as "Text" in Excel before saving
2. Or use the "Format Cells" → "Number" → "0" decimal places
3. Re-export the CSV file

### **Extra Columns**
**Problem**: CSV has more columns than expected
**Solution**:
1. Check for empty columns at the end of your data
2. Remove any extra columns in Excel
3. Ensure only the required 37 columns are present

### **SQL Injection**
**Problem**: Data contains SQL code (e.g., `Update shopify_items set...`)
**Solution**:
1. Remove any SQL statements from data fields
2. Check for accidental copy-paste of database commands
3. Clean the data before exporting

### **Orphaned Variants**
**Problem**: Variants reference parent products that don't exist
**Solution**:
1. Ensure parent products are included in the same CSV file
2. Check that parent product IDs match exactly
3. Verify no typos in parent product IDs

### **Parent Product Missing Options**
**Problem**: Parent products have no option names defined (OPTION1_NAME, OPTION2_NAME, OPTION3_NAME)
**Solution**:
1. Add option names to parent products (e.g., "Container Size", "Application", "Color")
2. These options define what variants can vary on
3. Without options, parent products will fail during creation

### **Parent Product Creation Failures**
**Problem**: Parent products fail to create due to missing required data
**Solution**:
1. Ensure parent products have proper option names
2. Add product descriptions to parent products
3. Verify all required fields are populated
4. Check for data formatting issues

## 📁 File Requirements

### **Supported Formats**
- **File Type**: CSV (Comma Separated Values)
- **Encoding**: UTF-8
- **Size Limit**: 10MB maximum
- **Row Limit**: No hard limit (performance may vary with very large files)

### **Required Columns** (37 total)
```
ID, PARENT_PRODUCT_ID, PRIMARY_ITEM_NUMBER, ALTERNATE_ITEM_NUMBERS,
OPTION1_NAME, OPTION2_NAME, OPTION3_NAME, OPTION1_VALUE, OPTION2_VALUE, OPTION3_VALUE,
PRODUCT_NAME, PRODUCT_DESCRIPTION, SORT_ORDER, IMAGE_URL, ADDITIONAL_IMAGE_URLS,
WEBSITE_CATEGORY, METRIC_VERSION, IMPERIAL_VERSION, UOM, VENDOR_NAME,
WARNING_BADGES, PRODUCT_BADGE, MINIMUM_ORDER_QUANTITTY, FEATURES, DOCUMENTS,
ATTTRIBUTE_NAMES, ATTRIBUTE_VALUES, PACKAGE_DISPLAY, STATUS, ISTAXABLE,
TAXCODE, MINIMUM_ORDER_INCREMENT, LEAD_TIME, LOW_INVENTORY_QUANTITY,
PROMO_MESSAGING, WEIGHT, WEIGHT_UNIT
```

## 🎯 Best Practices

### **Before Validation**
1. **Clean Your Data**: Remove any test data or placeholder content
2. **Check Formatting**: Ensure consistent data formatting
3. **Verify IDs**: Make sure all IDs are in proper format (no scientific notation)
4. **Review Content**: Check for any SQL code or suspicious content

### **After Validation**
1. **Fix Critical Issues**: Address all critical problems before upload
2. **Review Warnings**: Consider fixing warnings for better data quality
3. **Test Small Batch**: Try uploading a small subset first
4. **Keep Reports**: Save validation reports for troubleshooting

### **Data Quality Tips**
- Use consistent formatting for all data fields
- Avoid special characters that might cause parsing issues
- Ensure image URLs are accessible and properly formatted
- Double-check parent-child relationships
- Use proper boolean values (true/false, 1/0, yes/no)

## 🔧 Technical Details

### **Browser Compatibility**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### **File Processing**
- Client-side validation (no data sent to servers)
- Real-time processing with progress indicators
- Memory-efficient for large files
- Supports CSV parsing with quoted fields

### **Security**
- All processing happens in your browser
- No data is sent to external servers
- Files are not stored or transmitted
- Validation reports are generated locally

## 📞 Support

If you encounter issues with the CSV validator:

1. **Check Browser Console**: Open Developer Tools (F12) and look for error messages
2. **Try Different Browser**: Test with Chrome or Firefox if issues persist
3. **Check File Format**: Ensure your CSV file is properly formatted
4. **Contact Support**: Reach out to Arcadia Digital for technical assistance

## 🏷️ Version History

**v1.0.0** (October 2025)
- Initial release
- Comprehensive validation engine
- User-friendly web interface
- Support for all Winzer Middleware requirements

---

*Built by Arcadia Digital for Winzer Middleware CSV validation*
