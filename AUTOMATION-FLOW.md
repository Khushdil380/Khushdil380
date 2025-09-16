# 🔄 GitHub Actions Automation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SETUP PROCESS                                    │
└─────────────────────────────────────────────────────────────────────────────┘

1️⃣ CREATE GITHUB TOKEN
   GitHub Profile → Settings → Developer Settings → Personal Access Tokens
   ├── Generate new token (classic)
   ├── Name: "Contribution Graph Generator"
   ├── Scopes: ✅ user, ✅ read:user
   └── Copy: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

2️⃣ ADD REPOSITORY SECRET
   Repository → Settings → Secrets and Variables → Actions
   ├── New repository secret
   ├── Name: GITHUB_TOKEN
   ├── Value: [paste token]
   └── Add secret

3️⃣ TEST WORKFLOW
   Actions Tab → Update Contribution Graph → Run workflow
   ├── Monitor execution logs
   ├── Check for successful completion
   └── Verify SVG file generation

┌─────────────────────────────────────────────────────────────────────────────┐
│                       AUTOMATION WORKFLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

🕐 DAILY AT 12:00 PM UTC
   │
   ├── 📥 Checkout repository
   │
   ├── ⚙️ Setup Node.js environment
   │
   ├── 📦 Install dependencies (graphql-request)
   │
   ├── 🔍 Fetch real GitHub contribution data
   │   ├── GraphQL API call with token
   │   ├── Process contribution calendar
   │   └── Calculate statistics
   │
   ├── 🎨 Generate SVG with features:
   │   ├── Monthly color coding (12 colors)
   │   ├── Progressive fill system (4 levels)
   │   ├── Animated snake path
   │   ├── Hover tooltips
   │   └── Smooth animations
   │
   ├── 📝 Check for changes
   │
   └── 💾 Commit & push if updated
       ├── Commit message: "🌱 Update contribution graph [date]"
       └── Push to main branch

┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                                          │
└─────────────────────────────────────────────────────────────────────────────┘

🔗 GitHub API (GraphQL)
   │
   ├── Query: contribution calendar data
   ├── Response: weeks[] with contributionDays[]
   └── Data includes: date, contributionCount, color
   │
   ▼
🏭 SVG Generator
   │
   ├── Map data to visual elements
   ├── Apply monthly colors
   ├── Calculate fill levels
   ├── Generate snake path
   └── Create animations
   │
   ▼
📁 Output: assets/contributiongraph/contribution-graph.svg
   │
   └── 🌐 Embeddable in README

┌─────────────────────────────────────────────────────────────────────────────┐
│                      VISUAL FEATURES                                       │
└─────────────────────────────────────────────────────────────────────────────┘

🎨 MONTHLY COLORS
   Jan: #3B4252  │ Jul: #EBCB8B
   Feb: #5E81AC  │ Aug: #A3BE8C  
   Mar: #81A1C1  │ Sep: #BF616A
   Apr: #88C0D0  │ Oct: #D08770
   May: #B48EAD  │ Nov: #5E81AC
   Jun: #D08770  │ Dec: #4C566A

📈 CONTRIBUTION LEVELS
   0 contributions    → Transparent
   1-2 contributions  → 25% fill (#0d4429)
   3-5 contributions  → 50% fill (#006d32)
   6-9 contributions  → 75% fill (#26a641)
   10+ contributions  → 100% fill (#39d353)

🐍 SNAKE ANIMATION
   ├── Head: #ff3030 (bright red)
   ├── Body: #ff6b6b (segments with varying opacity)
   ├── Path: Follows contribution patterns
   ├── Speed: 2.0x with momentum-based movement
   └── Effects: Breathing, glow, smooth curves

🖱️ INTERACTIVE ELEMENTS
   ├── Hover tooltips: "X contributions on Day, Date"
   ├── Smooth animations: Progressive fill from bottom
   ├── Month labels: Jan, Feb, Mar... (positioned dynamically)
   └── Day labels: Mon, Wed, Fri (to avoid overlap)

┌─────────────────────────────────────────────────────────────────────────────┐
│                       SUCCESS METRICS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

✅ AUTOMATION WORKING
   ├── Daily commits appear automatically
   ├── Commit messages: "🌱 Update contribution graph [date]"
   ├── No workflow failures in Actions tab
   └── SVG file updates with current data

✅ REAL DATA INTEGRATION
   ├── Contribution counts match GitHub profile
   ├── Colors reflect actual activity patterns
   ├── Snake follows high-activity periods
   └── Tooltips show accurate dates/counts

✅ VISUAL QUALITY
   ├── Monthly colors display correctly
   ├── Snake animation runs smoothly
   ├── Hover tooltips appear on mouse over
   └── Progressive fill animations work

┌─────────────────────────────────────────────────────────────────────────────┐
│                       TROUBLESHOOTING                                      │
└─────────────────────────────────────────────────────────────────────────────┘

❌ COMMON ISSUES & SOLUTIONS

🔑 Token Issues
   Problem: "No token provided" or "GraphQL API errors"
   Solution: Regenerate token with read:user scope, update secret

⚙️ Workflow Issues  
   Problem: Workflow not running or failing
   Solution: Enable Actions, check file syntax, verify secret name

📊 Data Issues
   Problem: Shows mock data instead of real data
   Solution: Verify token permissions, check API rate limits

🎨 Visual Issues
   Problem: Colors/animations not working
   Solution: Check SVG file size, verify browser support

📧 DEBUGGING STEPS
   1. Check Actions tab for detailed workflow logs
   2. Test locally: GITHUB_TOKEN=token node src/githubcontibution/contribution-graph-generator.js
   3. Verify token in GitHub Settings → Personal access tokens
   4. Check repository secret configuration
   5. Monitor API rate limit usage
```