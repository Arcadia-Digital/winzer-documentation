# Cursor Setup & Onboarding Guide for Winzer

**Purpose**: Get your team up and running with Cursor for Winzer project development

---

## 🚀 Quick Start

### 1. Install Cursor
- Download from [cursor.sh](https://cursor.sh)
- Install the application
- Create/Login with account

### 2. Clone the Repository
```bash
git clone https://github.com/petebuzzell-ad/winzer-documentation.git
cd winzer-documentation
```

### 3. Configure Cursor Settings
- Open Cursor Settings (Cmd/Ctrl + ,)
- Navigate to "Cursor" → "Rules for AI"
- Copy the contents of `.cursorrules` into the field
- **Important**: The AI will automatically reference `AI_ONBOARDING_CONTEXT.md` for project history
- Apply the rules

### 4. Open Project in Cursor
- File → Open Folder
- Select the `winzer-documentation` directory

---

## 🎯 Essential Cursor Commands

**Primary Commands** (Cmd/Ctrl + K):
- `Cmd/Ctrl + K`: Inline edit current selection
- `Cmd/Ctrl + L`: Chat with AI about codebase
- `Cmd/Ctrl + I`: Composer mode (multi-file edits)

**Keyboard Shortcuts**:
- `@` in chat: Reference specific files/functions
- `#` in chat: Search codebase
- `Cmd/Ctrl + Shift + P`: Command palette

---

## 📋 Your First Task Workflow

**Example**: "Add a new validation check to CSV validator"

1. **Open relevant file**: `csv-validator.js`
2. **Use Cmd/Ctrl + L** to open chat
3. **Ask**: "I need to add a check for [specific issue]. Where should I add it and what would the code look like?"
4. **Review suggestions** and apply if suitable
5. **Use Cmd/Ctrl + K** on specific code blocks to refine
6. **Test changes** and iterate

---

## 🛠️ Common Use Cases

### Adding New Features
```
Context: "Add a new section to the documentation"
Action: Open file, use Cmd/Ctrl + L, describe what you want
Result: AI suggests implementation with code
```

### Understanding Existing Code
```
Context: "How does the CSV validator work?"
Action: Open csv-validator.js, use Cmd/Ctrl + L
Result: AI walks through architecture and logic
```

### Debugging Issues
```
Context: "Why is validation failing for variant X?"
Action: Open investigation files, use Cmd/Ctrl + L
Result: AI analyzes error patterns and suggests fixes
```

### Refactoring Code
```
Context: "Simplify this validation logic"
Action: Select code block, use Cmd/Ctrl + K
Result: AI proposes cleaner implementation
```

---

## 📝 Best Practices

### ✅ DO:
- Be specific in requests ("Add weight unit validation" vs "Fix this file")
- Use `@filename` to reference specific files in chat
- Break large tasks into smaller chunks
- Review AI suggestions before applying
- Test changes thoroughly

### ❌ DON'T:
- Accept all suggestions blindly
- Try to refactor entire codebase at once
- Ignore existing patterns and conventions
- Skip testing after changes

---

## 🔧 Troubleshooting

**Issue**: AI not understanding context
**Solution**: Use `@` to reference specific files, use `#` to search codebase

**Issue**: Suggestions not relevant
**Solution**: Be more specific, provide examples, reference similar code

**Issue**: AI suggesting wrong approach
**Solution**: Explain your constraints, reference existing patterns, be explicit about requirements

---

## 📚 Learning Resources

- **Cursor Docs**: [cursor.sh/docs](https://cursor.sh/docs)
- **Shortcuts**: Cmd/Ctrl + Shift + P → "Keyboard Shortcuts"
- **Cursor Discord**: Community support and tips

---

## 🎓 Next Steps

1. ✅ Complete setup (steps 1-4 above)
2. ✅ Try a simple task (edit a comment)
3. ✅ Attempt first real feature
4. ✅ Review with team

---

**Need Help?**
- Check Cursor documentation
- Review `.cursorrules` for project-specific guidance
- Reach out to technical team for onboarding support

