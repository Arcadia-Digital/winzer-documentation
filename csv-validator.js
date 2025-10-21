/**
 * Winzer CSV Validator
 * Validates CSV files for Winzer Middleware compatibility
 * Built by Arcadia Digital
 */

class CSVValidator {
    constructor() {
        this.expectedColumns = [
            'ID', 'PARENT_PRODUCT_ID', 'PRIMARY_ITEM_NUMBER', 'ALTERNATE_ITEM_NUMBERS',
            'OPTION1_NAME', 'OPTION2_NAME', 'OPTION3_NAME', 'OPTION1_VALUE', 'OPTION2_VALUE', 'OPTION3_VALUE',
            'PRODUCT_NAME', 'PRODUCT_DESCRIPTION', 'SORT_ORDER', 'IMAGE_URL', 'ADDITIONAL_IMAGE_URLS',
            'WEBSITE_CATEGORY', 'METRIC_VERSION', 'IMPERIAL_VERSION', 'UOM', 'VENDOR_NAME',
            'WARNING_BADGES', 'PRODUCT_BADGE', 'MINIMUM_ORDER_QUANTITTY', 'FEATURES', 'DOCUMENTS',
            'ATTTRIBUTE_NAMES', 'ATTRIBUTE_VALUES', 'PACKAGE_DISPLAY', 'STATUS', 'ISTAXABLE',
            'TAXCODE', 'MINIMUM_ORDER_INCREMENT', 'LEAD_TIME', 'LOW_INVENTORY_QUANTITY',
            'PROMO_MESSAGING', 'WEIGHT', 'WEIGHT_UNIT'
        ];
        
        this.issues = [];
        this.stats = {
            totalRows: 0,
            parentProducts: 0,
            variants: 0,
            criticalIssues: 0,
            warnings: 0,
            info: 0
        };
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        // Drag and drop events
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    async handleFile(file) {
        if (!file.name.toLowerCase().endsWith('.csv')) {
            this.showError('Please select a CSV file.');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            this.showError('File size must be less than 10MB.');
            return;
        }

        this.showProgress();
        this.showFileInfo(file);

        try {
            const csvData = await this.parseCSV(file);
            await this.validateCSV(csvData);
            this.showResults();
        } catch (error) {
            this.showError('Error processing file: ' + error.message);
        }
    }

    async parseCSV(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const lines = text.split('\n').filter(line => line.trim());
                    
                    if (lines.length < 2) {
                        reject(new Error('CSV file must have at least a header and one data row.'));
                        return;
                    }

                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                    const rows = lines.slice(1).map(line => {
                        const values = this.parseCSVLine(line);
                        const row = {};
                        headers.forEach((header, index) => {
                            row[header] = values[index] || '';
                        });
                        return row;
                    });

                    resolve({ headers, rows });
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Error reading file.'));
            reader.readAsText(file);
        });
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    async validateCSV(data) {
        this.issues = [];
        this.stats = {
            totalRows: data.rows.length,
            parentProducts: 0,
            variants: 0,
            criticalIssues: 0,
            warnings: 0,
            info: 0
        };

        // Validate headers
        this.validateHeaders(data.headers);

        // Count product types
        data.rows.forEach(row => {
            if (row.PARENT_PRODUCT_ID === '' || !row.PARENT_PRODUCT_ID) {
                this.stats.parentProducts++;
            } else {
                this.stats.variants++;
            }
        });

        // Validate each row
        for (let i = 0; i < data.rows.length; i++) {
            await this.validateRow(data.rows[i], i + 2); // +2 for header and 1-based indexing
        }

        // Validate relationships
        this.validateRelationships(data.rows);

        // Update stats
        this.issues.forEach(issue => {
            if (issue.severity === 'critical') this.stats.criticalIssues++;
            else if (issue.severity === 'warning') this.stats.warnings++;
            else this.stats.info++;
        });
    }

    validateHeaders(headers) {
        // Check for extra columns
        if (headers.length > this.expectedColumns.length) {
            this.addIssue('critical', 'Extra Columns Detected', 
                `Found ${headers.length} columns, expected ${this.expectedColumns.length}. Extra columns: ${headers.slice(this.expectedColumns.length).join(', ')}`);
        }

        // Check for missing columns
        const missingColumns = this.expectedColumns.filter(col => !headers.includes(col));
        if (missingColumns.length > 0) {
            this.addIssue('critical', 'Missing Required Columns', 
                `Missing columns: ${missingColumns.join(', ')}`);
        }

        // Check for empty columns at the end
        const emptyColumns = headers.filter((col, index) => col === '' && index >= this.expectedColumns.length);
        if (emptyColumns.length > 0) {
            this.addIssue('warning', 'Empty Columns', 
                `Found ${emptyColumns.length} empty columns at the end of the file.`);
        }
    }

    async validateRow(row, rowNumber) {
        // Check for scientific notation in ID
        if (row.ID && this.isScientificNotation(row.ID)) {
            this.addIssue('critical', 'Scientific Notation ID', 
                `Row ${rowNumber}: ID "${row.ID}" is in scientific notation. This will cause processing failures.`, rowNumber);
        }

        // Check for SQL injection attempts
        if (this.containsSQLInjection(row)) {
            this.addIssue('critical', 'SQL Injection Detected', 
                `Row ${rowNumber}: Contains suspicious SQL code that could be a security risk.`, rowNumber);
        }

        // Validate required fields
        this.validateRequiredFields(row, rowNumber);

        // Validate data types
        this.validateDataTypes(row, rowNumber);

        // Validate image URLs
        await this.validateImageURLs(row, rowNumber);

        // Check for empty parent product ID in variants
        if (row.PARENT_PRODUCT_ID && row.PARENT_PRODUCT_ID.trim() === '') {
            this.addIssue('warning', 'Empty Parent ID', 
                `Row ${rowNumber}: Variant has empty parent product ID.`, rowNumber);
        }

        // Check for parent products with missing required variant data
        if (!row.PARENT_PRODUCT_ID || row.PARENT_PRODUCT_ID.trim() === '') {
            this.validateParentProduct(row, rowNumber);
        } else {
            // This is a variant - check for GraphQL field issues
            this.validateVariantFields(row, rowNumber);
        }
    }

    validateRequiredFields(row, rowNumber) {
        const requiredFields = ['ID', 'PRIMARY_ITEM_NUMBER', 'PRODUCT_NAME', 'STATUS'];
        
        requiredFields.forEach(field => {
            if (!row[field] || row[field].trim() === '') {
                this.addIssue('critical', 'Missing Required Field', 
                    `Row ${rowNumber}: Missing required field "${field}".`, rowNumber);
            }
        });
    }

    validateDataTypes(row, rowNumber) {
        // Validate numeric fields
        const numericFields = ['SORT_ORDER', 'WEIGHT'];
        numericFields.forEach(field => {
            if (row[field] && row[field].trim() !== '') {
                const value = parseFloat(row[field]);
                if (isNaN(value)) {
                    this.addIssue('warning', 'Invalid Numeric Value', 
                        `Row ${rowNumber}: Field "${field}" should be numeric, found "${row[field]}".`, rowNumber);
                }
            }
        });

        // Validate boolean fields
        const booleanFields = ['ISTAXABLE'];
        booleanFields.forEach(field => {
            if (row[field] && row[field].trim() !== '') {
                const value = row[field].toLowerCase();
                if (!['true', 'false', '1', '0', 'yes', 'no'].includes(value)) {
                    this.addIssue('warning', 'Invalid Boolean Value', 
                        `Row ${rowNumber}: Field "${field}" should be true/false, found "${row[field]}".`, rowNumber);
                }
            }
        });

        // Validate weight unit format
        if (row.WEIGHT_UNIT && row.WEIGHT_UNIT.trim() !== '') {
            const validUnits = ['LB', 'LBS', 'OZ', 'KG', 'G', 'POUNDS', 'OUNCES', 'KILOGRAMS', 'GRAMS'];
            const unit = row.WEIGHT_UNIT.toUpperCase();
            if (!validUnits.includes(unit)) {
                this.addIssue('warning', 'Invalid Weight Unit', 
                    `Row ${rowNumber}: Weight unit "${row.WEIGHT_UNIT}" is not valid. Use: ${validUnits.join(', ')}.`, rowNumber);
            }
        }
    }

    async validateImageURLs(row, rowNumber) {
        const imageFields = ['IMAGE_URL', 'ADDITIONAL_IMAGE_URLS'];
        
        for (const field of imageFields) {
            if (row[field] && row[field].trim() !== '') {
                const urls = row[field].split(',').map(url => url.trim()).filter(url => url);
                
                for (const url of urls) {
                    if (!this.isValidURL(url)) {
                        this.addIssue('warning', 'Invalid Image URL', 
                            `Row ${rowNumber}: Invalid URL in "${field}": "${url}".`, rowNumber);
                    }
                }
            }
        }
    }

    validateParentProduct(row, rowNumber) {
        // Parent products must have option names defined for variants
        const optionFields = ['OPTION1_NAME', 'OPTION2_NAME', 'OPTION3_NAME'];
        const hasOptions = optionFields.some(field => row[field] && row[field].trim() !== '');
        
        if (!hasOptions) {
            this.addIssue('critical', 'Parent Product Missing Options', 
                `Row ${rowNumber}: Parent product "${row.ID}" has no option names defined. Parent products need OPTION1_NAME, OPTION2_NAME, or OPTION3_NAME for variants to work.`, rowNumber);
        }

        // Check for empty product description in parent products
        if (!row.PRODUCT_DESCRIPTION || row.PRODUCT_DESCRIPTION.trim() === '') {
            this.addIssue('warning', 'Empty Parent Description', 
                `Row ${rowNumber}: Parent product "${row.ID}" has no description. This may cause issues during creation.`, rowNumber);
        }
    }

    validateVariantFields(row, rowNumber) {
        // Check for required variant fields that cause GraphQL errors
        if (!row.PRIMARY_ITEM_NUMBER || row.PRIMARY_ITEM_NUMBER.trim() === '') {
            this.addIssue('critical', 'Missing SKU', 
                `Row ${rowNumber}: Variant is missing PRIMARY_ITEM_NUMBER (SKU). This is required for variant creation.`, rowNumber);
        }

        // Check for weight data consistency
        const hasWeight = row.WEIGHT && row.WEIGHT.trim() !== '';
        const hasWeightUnit = row.WEIGHT_UNIT && row.WEIGHT_UNIT.trim() !== '';
        
        if (hasWeight && !hasWeightUnit) {
            this.addIssue('warning', 'Missing Weight Unit', 
                `Row ${rowNumber}: Weight is specified but no weight unit provided.`, rowNumber);
        }
        
        if (!hasWeight && hasWeightUnit) {
            this.addIssue('warning', 'Missing Weight Value', 
                `Row ${rowNumber}: Weight unit is specified but no weight value provided.`, rowNumber);
        }

        // Check for option values that don't match parent options
        const hasOption1 = row.OPTION1_VALUE && row.OPTION1_VALUE.trim() !== '';
        const hasOption2 = row.OPTION2_VALUE && row.OPTION2_VALUE.trim() !== '';
        const hasOption3 = row.OPTION3_VALUE && row.OPTION3_VALUE.trim() !== '';
        
        if (hasOption1 && (!row.OPTION1_NAME || row.OPTION1_NAME.trim() === '')) {
            this.addIssue('warning', 'Option Value Without Name', 
                `Row ${rowNumber}: Has OPTION1_VALUE but no OPTION1_NAME. This may cause variant creation issues.`, rowNumber);
        }
        
        if (hasOption2 && (!row.OPTION2_NAME || row.OPTION2_NAME.trim() === '')) {
            this.addIssue('warning', 'Option Value Without Name', 
                `Row ${rowNumber}: Has OPTION2_VALUE but no OPTION2_NAME. This may cause variant creation issues.`, rowNumber);
        }
        
        if (hasOption3 && (!row.OPTION3_NAME || row.OPTION3_NAME.trim() === '')) {
            this.addIssue('warning', 'Option Value Without Name', 
                `Row ${rowNumber}: Has OPTION3_VALUE but no OPTION3_NAME. This may cause variant creation issues.`, rowNumber);
        }
    }

    validateRelationships(rows) {
        const parentIds = new Set();
        const variantParentIds = new Set();

        // Collect parent IDs and variant parent IDs
        rows.forEach(row => {
            if (!row.PARENT_PRODUCT_ID || row.PARENT_PRODUCT_ID.trim() === '') {
                parentIds.add(row.ID);
            } else {
                variantParentIds.add(row.PARENT_PRODUCT_ID);
            }
        });

        // Check for orphaned variants
        const orphanedVariants = [...variantParentIds].filter(parentId => !parentIds.has(parentId));
        if (orphanedVariants.length > 0) {
            this.addIssue('critical', 'Orphaned Variants', 
                `Found ${orphanedVariants.length} variants with parent IDs that don't exist: ${orphanedVariants.join(', ')}`);
        }

        // Check for parent products with no variants
        const parentIdsWithVariants = new Set();
        rows.forEach(row => {
            if (row.PARENT_PRODUCT_ID && row.PARENT_PRODUCT_ID.trim() !== '') {
                parentIdsWithVariants.add(row.PARENT_PRODUCT_ID);
            }
        });

        const parentProductsWithoutVariants = [...parentIds].filter(parentId => !parentIdsWithVariants.has(parentId));
        if (parentProductsWithoutVariants.length > 0) {
            this.addIssue('warning', 'Parent Products Without Variants', 
                `Found ${parentProductsWithoutVariants.length} parent products with no variants: ${parentProductsWithoutVariants.join(', ')}`);
        }
    }

    isScientificNotation(value) {
        return /^[0-9]+\.?[0-9]*[eE][+-]?[0-9]+$/.test(value);
    }

    containsSQLInjection(row) {
        const suspiciousPatterns = [
            /update\s+.*\s+set/i,
            /delete\s+from/i,
            /insert\s+into/i,
            /drop\s+table/i,
            /alter\s+table/i,
            /create\s+table/i
        ];

        for (const [key, value] of Object.entries(row)) {
            if (typeof value === 'string') {
                for (const pattern of suspiciousPatterns) {
                    if (pattern.test(value)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    addIssue(severity, title, message, rowNumber = null) {
        this.issues.push({
            severity,
            title,
            message,
            rowNumber
        });
    }

    showProgress() {
        document.getElementById('progressBar').style.display = 'block';
        document.getElementById('resultsPanel').style.display = 'none';
        
        // Simulate progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            document.getElementById('progressFill').style.width = progress + '%';
        }, 100);
    }

    showFileInfo(file) {
        const fileInfo = document.getElementById('fileInfo');
        const fileDetails = document.getElementById('fileDetails');
        
        fileDetails.innerHTML = `
            <p><strong>File Name:</strong> ${file.name}</p>
            <p><strong>File Size:</strong> ${(file.size / 1024).toFixed(1)} KB</p>
            <p><strong>Last Modified:</strong> ${new Date(file.lastModified).toLocaleString()}</p>
        `;
        
        fileInfo.style.display = 'block';
    }

    showResults() {
        document.getElementById('progressBar').style.display = 'none';
        
        const resultsPanel = document.getElementById('resultsPanel');
        const resultsTitle = document.getElementById('resultsTitle');
        const statsGrid = document.getElementById('statsGrid');
        const issuesList = document.getElementById('issuesList');
        const actionButtons = document.getElementById('actionButtons');

        // Determine overall status
        let statusClass = 'results-success';
        let statusText = 'All checks passed!';
        
        if (this.stats.criticalIssues > 0) {
            statusClass = 'results-error';
            statusText = 'Critical issues found - file needs fixing';
        } else if (this.stats.warnings > 0) {
            statusClass = 'results-warning';
            statusText = 'Warnings found - review recommended';
        }

        resultsPanel.className = `results-panel ${statusClass}`;
        resultsTitle.textContent = statusText;

        // Show stats
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${this.stats.totalRows}</div>
                <div>Total Rows</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${this.stats.parentProducts}</div>
                <div>Parent Products</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${this.stats.variants}</div>
                <div>Variants</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${this.stats.criticalIssues}</div>
                <div>Critical Issues</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${this.stats.warnings}</div>
                <div>Warnings</div>
            </div>
        `;

        // Show issues
        if (this.issues.length === 0) {
            issuesList.innerHTML = '<p>✅ No issues found! Your CSV file is ready for upload.</p>';
        } else {
            const issuesHTML = this.issues.map(issue => `
                <div class="issue-item issue-${issue.severity}">
                    <span class="issue-icon">
                        ${issue.severity === 'critical' ? '🚨' : issue.severity === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <div>
                        <strong>${issue.title}</strong>
                        ${issue.rowNumber ? ` (Row ${issue.rowNumber})` : ''}
                        <br>
                        <small>${issue.message}</small>
                    </div>
                </div>
            `).join('');
            
            issuesList.innerHTML = `<ul class="issue-list">${issuesHTML}</ul>`;
        }

        // Show action buttons
        actionButtons.innerHTML = `
            <button class="btn btn-primary" onclick="validator.validateAnother()">Validate Another File</button>
            <button class="btn btn-secondary" onclick="validator.downloadReport()">Download Report</button>
            ${this.stats.criticalIssues === 0 ? '<button class="btn btn-success" onclick="validator.showSuccessMessage()">Ready for Upload!</button>' : ''}
        `;

        resultsPanel.style.display = 'block';
    }

    showError(message) {
        document.getElementById('progressBar').style.display = 'none';
        
        const resultsPanel = document.getElementById('resultsPanel');
        resultsPanel.className = 'results-panel results-error';
        resultsPanel.innerHTML = `
            <h3>❌ Error</h3>
            <p>${message}</p>
            <div class="action-buttons">
                <button class="btn btn-primary" onclick="validator.validateAnother()">Try Again</button>
            </div>
        `;
        resultsPanel.style.display = 'block';
    }

    validateAnother() {
        // Reset the form
        document.getElementById('fileInput').value = '';
        document.getElementById('fileInfo').style.display = 'none';
        document.getElementById('progressBar').style.display = 'none';
        document.getElementById('resultsPanel').style.display = 'none';
        document.getElementById('dropZone').classList.remove('dragover');
    }

    downloadReport() {
        const report = this.generateReport();
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'csv-validation-report.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    generateReport() {
        const timestamp = new Date().toLocaleString();
        let report = `Winzer CSV Validation Report\n`;
        report += `Generated: ${timestamp}\n`;
        report += `================================\n\n`;
        
        report += `STATISTICS:\n`;
        report += `Total Rows: ${this.stats.totalRows}\n`;
        report += `Parent Products: ${this.stats.parentProducts}\n`;
        report += `Variants: ${this.stats.variants}\n`;
        report += `Critical Issues: ${this.stats.criticalIssues}\n`;
        report += `Warnings: ${this.stats.warnings}\n`;
        report += `Info: ${this.stats.info}\n\n`;
        
        if (this.issues.length > 0) {
            report += `ISSUES FOUND:\n`;
            report += `=============\n\n`;
            
            this.issues.forEach((issue, index) => {
                report += `${index + 1}. [${issue.severity.toUpperCase()}] ${issue.title}\n`;
                if (issue.rowNumber) {
                    report += `   Row: ${issue.rowNumber}\n`;
                }
                report += `   ${issue.message}\n\n`;
            });
        } else {
            report += `✅ No issues found! Your CSV file is ready for upload.\n`;
        }
        
        return report;
    }

    showSuccessMessage() {
        alert('🎉 Great! Your CSV file passed all validation checks and is ready for upload to the Winzer Middleware.');
    }
}

// Initialize the validator when the page loads
let validator;
document.addEventListener('DOMContentLoaded', () => {
    validator = new CSVValidator();
});
