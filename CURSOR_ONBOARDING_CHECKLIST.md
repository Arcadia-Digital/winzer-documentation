# Cursor Onboarding Checklist for Winzer Team

**Purpose**: Step-by-step checklist to get new team members productive with Cursor

---

## ✅ Pre-Flight Checklist

### Day 1: Setup & Orientation
- [ ] Install Cursor on workstation
- [ ] Clone repository: `git clone https://github.com/petebuzzell-ad/winzer-documentation.git`
- [ ] Configure Cursor Rules (copy `.cursorrules` to Cursor settings)
- [ ] Read `README.md` for project overview
- [ ] Review `CURSOR_SETUP_GUIDE.md`
- [ ] Open project in Cursor
- [ ] Test Cursor basic functions (Cmd+K, Cmd+L)

### Day 1: First Tasks
- [ ] Browse project structure (documentation, code, investigations)
- [ ] Review 2-3 investigation files to understand failure patterns
- [ ] Make a small test edit (change a comment)
- [ ] Use Cmd+L to ask: "What is the Winzer Middleware and what does it do?"

---

## ✅ Day 2: Basic Operations

### Understanding the Codebase
- [ ] Review `DEVELOPER_HANDOFF.md` for architecture
- [ ] Use Cursor to explore: "Show me the flow from CSV upload to Shopify"
- [ ] Review investigation file patterns
- [ ] Identify key files in each component:
  - [ ] Middleware: `ProductFeedService.cs`
  - [ ] Documentation: `index.html`
- [ ] Use Cursor to ask: "What are the common error patterns in the investigation files?"

### Basic Editing
- [ ] Make a simple change to documentation
- [ ] Use Cmd+K for inline editing
- [ ] Use Cmd+I for multi-file edits
- [ ] Test git workflow with Cursor
- [ ] Commit a small change

---

## ✅ Day 3: Real Work

### First Real Task
- [ ] Choose a small task from the backlog
- [ ] Use Cursor prompts to understand context
- [ ] Implement solution with Cursor assistance
- [ ] Test the changes
- [ ] Get code review from team
- [ ] Deploy and validate

### Understanding Common Issues
- [ ] Review all investigation files in chronological order
- [ ] Identify patterns: What works? What fails?
- [ ] Use Cursor to ask: "Why do some CSV files fail and others succeed?"
- [ ] Document your findings

---

## ✅ Week 2: Productivity

### Independent Work
- [ ] Complete tasks without handholding
- [ ] Use investigation files to identify issues
- [ ] Write clear documentation for your work
- [ ] Help other team members with Cursor
- [ ] Contribute to `.cursorrules` improvements

### Advanced Techniques
- [ ] Master using `@filename` in chat
- [ ] Use `#` for codebase search
- [ ] Create custom prompts for your workflow
- [ ] Understand when to use Cmd+K vs Cmd+L
- [ ] Set up workspace-specific settings

---

## ✅ Knowledge Checkpoints

### After Day 1
**Can you:**
- [ ] Open Cursor and navigate the project?
- [ ] Explain what the CSV validator does?
- [ ] Make a simple edit to a file?
- [ ] Use Cursor to get help with code?

### After Day 3
**Can you:**
- [ ] Find relevant files for a given task?
- [ ] Understand error patterns from investigation files?
- [ ] Implement a small feature with Cursor help?
- [ ] Explain the middleware architecture?

### After Week 2
**Can you:**
- [ ] Work independently on assigned tasks?
- [ ] Debug issues using Cursor effectively?
- [ ] Write clear documentation for your work?
- [ ] Help onboard the next team member?

---

## 🎯 Assessment Questions

### Technical Understanding
**You should be able to answer:**
1. What are the main components of the Winzer platform?
2. How does a CSV file flow through the system?
3. What are the common failure patterns we've identified?
4. How does the CSV validator help prevent issues?
5. What is the GraphQL "unknown field" error and why does it happen?

### Cursor Proficiency
**You should be able to:**
1. Use Cmd+K to make inline edits
2. Use Cmd+L to get contextual help
3. Reference files with `@filename`
4. Search codebase with `#`
5. Create effective prompts for your tasks

### Work Quality
**Your work should:**
- Follow existing code patterns
- Include appropriate error handling
- Have clear documentation
- Be tested with real data
- Solve the actual problem

---

## 🚀 Mastery Indicators

**You're ready for independent work when:**

### Technical
- [ ] You can navigate the codebase confidently
- [ ] You understand the common error patterns
- [ ] You know where to look for specific functionality
- [ ] You can debug issues effectively
- [ ] You write code that matches project style

### Cursor Usage
- [ ] You use Cursor efficiently (not just as a chat tool)
- [ ] You know when to use which Cursor feature
- [ ] You can write prompts that get useful results
- [ ] You can refactor code with Cursor help
- [ ] You teach others how to use Cursor

### Problem-Solving
- [ ] You can identify root causes, not just symptoms
- [ ] You think about edge cases
- [ ] You reference investigation files when debugging
- [ ] You test your solutions thoroughly
- [ ] You document your findings

---

## 📚 Resources

### Essential Reading
- `CURSOR_SETUP_GUIDE.md` - How to use Cursor
- `CURSOR_PROMPTS_REFERENCE.md` - Pre-written prompts
- `.cursorrules` - Project-specific AI behavior
- `DEVELOPER_HANDOFF.md` - Architecture overview

### Practice Exercises
1. **Exercise 1**: Add a new validation check to CSV validator
2. **Exercise 2**: Update documentation for a feature
3. **Exercise 3**: Debug a simulated error scenario
4. **Exercise 4**: Create a new troubleshooting guide
5. **Exercise 5**: Optimize a piece of code

---

## 🎓 Next Steps

### After Completing Checklist
1. ✅ Pick up real tasks from the backlog
2. ✅ Collaborate with team on complex features
3. ✅ Mentor the next new team member
4. ✅ Contribute to documentation improvements
5. ✅ Help optimize the development workflow

---

**Remember**: The goal is to be productive, not just to complete the checklist. Take your time to truly understand the platform and tools.

