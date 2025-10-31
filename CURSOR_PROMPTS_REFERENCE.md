# Cursor Prompt Reference for Winzer Project

**Purpose**: Pre-written prompts to get started quickly with common tasks

---

## 🚀 Getting Started Prompts

### First Time Setup
```
I'm new to this project. Can you walk me through the architecture and how the different components (middleware, Shopify theme, SearchSpring) work together?
```

### Understanding an Error
```
I'm seeing this error in the AWS logs [paste error]. Can you help me understand what's causing it and how to fix it?
```

### Exploring the Codebase
```
Can you show me where [specific feature] is implemented and explain how it works?
```

---

## 🔧 Development Prompts

### Adding New Validation
```
I need to add a new input validation check for [specific issue] in our data processing. Where should this live and what would the implementation look like?
```

### Fixing a Bug
```
According to investigation file [filename], this CSV file fails with [error message]. Can you identify the root cause and suggest a fix?
```

### Adding Documentation
```
I need to document how [feature] works. Can you help me write clear, non-technical documentation that a business user could understand?
```

### Understanding Middleware Logic
```
Can you trace through the code to show me what happens when a product CSV is uploaded to the middleware? Start from ProductFeedService and show the flow.
```

---

## 🐛 Debugging Prompts

### Analyzing Error Logs
```
Review this error from AWS logs [paste log]. Based on the investigation files in the repository, what's the pattern and what should we check?
```

### Comparing Test Cases
```
Comparing investigations 21OCT2025-4 and 21OCT2025-5, one succeeded and one failed. What's the difference and why did one work?
```

### GraphQL Issues
```
The middleware is getting an 'unknown field' error on variant creation. Based on the schema.graphql file and the ProductVariantsBulkInputAdapter, what field might be causing this?
```

---

## 📝 Documentation Prompts

### Creating User Guides
```
I need to create a guide for [task]. Based on the existing documentation style, can you help me write clear step-by-step instructions with examples?
```

### Writing Technical Docs
```
I need to document the [component] architecture for developers. Can you help me create comprehensive technical documentation that covers the key concepts, data flow, and important code patterns?
```

### Troubleshooting Guide
```
Based on the error patterns in the investigation files, can you help me create a troubleshooting guide for common CSV upload issues?
```

---

## 🎯 Specific Feature Prompts

### Middleware Improvements
```
Looking at the database timeout in investigation 21OCT2025-8, how can we improve the middleware to handle large datasets better?
```

### SearchSpring Integration
```
Can you explain how the SearchSpring React app integrates with the Shopify theme and what key files handle the integration?
```

### Product Updates
```
A client is trying to update products but getting failures. Based on the success/failure patterns in the investigations, what should I check first?
```

---

## 🧪 Testing Prompts

### Creating Test Scenarios
```
Based on the investigation files, what test scenarios should I create to ensure known failure patterns are covered?
```

### Validating Fixes
```
I made changes to fix [issue]. Can you help me create test cases to verify the fix works across different scenarios from the investigation files?
```

---

## 📚 Code Understanding Prompts

### Understanding Data Flow
```
Trace the flow of data from when a CSV is uploaded through to when it appears in Shopify. Show me the key files and functions involved.
```

### Explaining Complex Logic
```
Can you explain how the [component] works? I need to understand [specific aspect] for [reason].
```

### Code Review
```
Review this code [selection] and suggest improvements for readability, performance, and maintainability.
```

---

## 🎓 Learning Prompts

### Architecture Overview
```
Give me a high-level overview of the Winzer platform architecture. What are the main components and how do they communicate?
```

### Technology Stack
```
What technologies and frameworks are used in this project? Can you explain why each was chosen?
```

### Common Patterns
```
What are the common patterns used in this codebase? Show me examples of how similar problems are solved in different parts of the project.
```

---

## 💡 Problem-Solving Prompts

### Root Cause Analysis
```
Multiple investigation files show similar errors. Can you analyze them to identify the common root cause and suggest a systematic fix?
```

### Optimization Opportunities
```
Review the middleware code and identify performance bottlenecks or optimization opportunities for handling large product datasets.
```

### Best Practices
```
Based on the codebase and investigation files, what best practices should I follow when [specific task]?
```

---

## 🔄 Refactoring Prompts

### Improving Code Quality
```
This code [selection] could be improved. Can you refactor it to be more maintainable while preserving functionality?
```

### Simplifying Complex Logic
```
This logic is hard to understand. Can you break it down into smaller, more readable functions?
```

### Following Conventions
```
Does this code follow the existing patterns in the codebase? If not, can you refactor it to be more consistent?
```

---

## 📋 Task-Specific Prompts

### Adding New Fields
```
I need to add a new field to the CSV format. What files need to be updated (CSV record class, validator, documentation, etc.)?
```

### Updating GraphQL Schema
```
Shopify's API has changed. How do I update the GraphQL schema files and what else needs to be modified?
```

### Creating New Tools
```
Following existing patterns in this repo, can you help me create a new tool for [purpose]?
```

---

## 🎯 Quick Actions

### Apply Patterns
```
Show me how [feature] is implemented in other parts of the codebase so I can follow the same pattern.
```

### Find Examples
```
I need to see examples of [pattern] in the codebase. Can you show me where similar implementations exist?
```

### Check Compatibility
```
Will this change break existing functionality? Show me what else might be affected.
```

---

**Tips for Using Prompts:**
- Be specific about what you need
- Reference relevant files with `@filename`
- Provide context from investigation files
- Ask for code, not just guidance
- Request explanations when needed

