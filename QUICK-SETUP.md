# 🚀 GitHub Contribution Graph - Quick Setup

## Setup Steps

### 1. Create GitHub Personal Access Token
- GitHub Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)
- Generate new token (classic) with name: `Contribution Graph Generator`
- Scopes: ✅ `user` and ✅ `read:user`
- Copy token: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Add Repository Secret
- Repository → Settings → Secrets and variables → Actions
- New repository secret: Name `GITHUB_TOKEN`, Value: [Paste your token]
- Add secret

### 3. Test Setup
- Actions tab → Update Contribution Graph → Run workflow
- Check logs for successful execution
- Verify `assets/contributiongraph/contribution-graph.svg` updated

### 4. Add to README
```markdown
![Contribution Graph](https://raw.githubusercontent.com/Khushdil380/Khushdil380/main/assets/contributiongraph/contribution-graph.svg)
```

## Features
- 🔄 Real GitHub Data via GraphQL API
- 🎨 Monthly Color Coding (12 unique colors)
- 📈 Progressive Fill System (4 levels: 25%, 50%, 75%, 100%)
- 🐍 Animated Snake moving through graph
- 🤖 Daily Auto-Updates at 12:00 PM UTC
- 🖱️ Interactive Hover Tooltips

## File Structure
```
src/githubcontibution/
├── contribution-graph-generator.js  # Main generator
└── README.md                       # Documentation

.github/workflows/
└── update-contribution-graph.yml   # GitHub Actions

assets/contributiongraph/
└── contribution-graph.svg          # Generated output
```

## Troubleshooting
- **No token provided**: Add `GITHUB_TOKEN` secret with correct permissions
- **Workflow not running**: Enable Actions in repository settings
- **GraphQL errors**: Regenerate token with `read:user` scope

**⏰ Runs daily at 12:00 PM UTC automatically**