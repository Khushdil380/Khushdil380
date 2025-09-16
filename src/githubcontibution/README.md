# 🌱 GitHub Contribution Graph Generator

**Real-time animated SVG contribution graph with GitHub Actions automation**

## ✨ Features

- 🔄 **Real GitHub Data** - Fetches actual contribution data using GitHub GraphQL API
- 🎨 **Monthly Color Coding** - 12 unique colors representing different months
- 📈 **Progressive Fill System** - 4 contribution levels (25%, 50%, 75%, 100%)
- 🐍 **Animated Snake** - Realistic snake animation moving through the graph
- 🖱️ **Interactive Tooltips** - Hover to see contribution count and date
- 🤖 **Daily Auto-Updates** - GitHub Actions automatically updates every day at 12:00 PM UTC
- 💫 **Smooth Animations** - CSS animations for progressive cell filling
- 📱 **Responsive Design** - Works on all screen sizes

## 🚀 Quick Start

### Local Usage

```bash
# Install dependencies
npm install

# Generate with mock data (no token required)
node src/githubcontibution/contribution-graph-generator.js

# Generate with real data (requires GitHub token)
GITHUB_TOKEN=your_token_here node src/githubcontibution/contribution-graph-generator.js
```

### GitHub Actions Setup

1. **Add Repository Secret**:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Create a new secret named `GITHUB_TOKEN`
   - Use your GitHub Personal Access Token with `read:user` scope

2. **Enable GitHub Actions**:
   - The workflow file is already created at `.github/workflows/update-contribution-graph.yml`
   - It will run automatically daily at 12:00 PM UTC
   - You can also trigger it manually from the Actions tab

3. **Manual Trigger**:
   - Go to Actions tab → "Update Contribution Graph" → "Run workflow"

## 📊 Output

The generator creates `assets/contributiongraph/contribution-graph.svg` with:

### Visual Elements
- **Base Grid**: Monthly colored squares representing the calendar year
- **Contribution Fill**: Green fill intensity based on contribution count
- **Snake Animation**: Animated snake path moving through high-activity areas
- **Month Labels**: Abbreviated month names (Jan, Feb, Mar...)
- **Day Labels**: Weekday indicators (Mon, Wed, Fri)
- **Legend**: Contribution level indicators

### Contribution Levels
- **0 contributions**: Transparent (monthly color shows through)
- **1-2 contributions**: 25% fill (`#0d4429`)
- **3-5 contributions**: 50% fill (`#006d32`)
- **6-9 contributions**: 75% fill (`#26a641`)
- **10+ contributions**: 100% fill (`#39d353`)

## 🎨 Customization

Edit the `config` object in `contribution-graph-generator.js`:

```javascript
const config = {
  username: "Khushdil380",        // Your GitHub username
  cellSize: 15,                   // Size of each day square
  cellGap: 3,                     // Gap between squares
  monthColors: {                  // Monthly background colors
    0: "#3B4252",   // January
    1: "#5E81AC",   // February
    // ... customize all 12 months
  },
  contributionFills: {            // Contribution intensity colors
    0: "transparent",
    25: "#0d4429",
    50: "#006d32", 
    75: "#26a641",
    100: "#39d353"
  },
  snake: {                        // Snake animation settings
    color: "#ff6b6b",
    headColor: "#ff3030",
    bodySegments: 6,
    speed: 2.0
  }
};
```

## 🔧 GitHub Actions Workflow

The automation workflow:

1. **Triggers**: 
   - Daily at 12:00 PM UTC
   - Manual dispatch
   - Code changes to contribution graph files

2. **Process**:
   - Checks out repository
   - Sets up Node.js environment
   - Installs dependencies
   - Generates SVG with real GitHub data
   - Commits and pushes changes (if any)

3. **Environment Variables**:
   - `GITHUB_TOKEN`: Required for accessing GitHub API
   - `GITHUB_ACTIONS=true`: Indicates GitHub Actions environment

## 📈 Embedding in README

Add to your GitHub profile README:

```markdown
# GitHub Contribution Graph
![Contribution Graph](https://raw.githubusercontent.com/Khushdil380/Khushdil380/main/assets/contributiongraph/contribution-graph.svg)
```

## 🛠️ Technical Details

### Dependencies
- `graphql-request`: GitHub GraphQL API client
- Node.js built-in modules: `fs`, `path`

### API Usage
- **Endpoint**: `https://api.github.com/graphql`
- **Query**: Fetches contribution calendar for current year
- **Rate Limiting**: Respects GitHub API rate limits
- **Fallback**: Uses mock data when token is unavailable

### File Structure
```
src/githubcontibution/
├── contribution-graph-generator.js  # Main generator script
├── README.md                       # This documentation
└── (generated files)

assets/contributiongraph/
├── contribution-graph.svg          # Generated SVG output
└── (backup files)

.github/workflows/
└── update-contribution-graph.yml   # GitHub Actions workflow
```

## 🔍 Troubleshooting

### Common Issues

1. **No token provided warning**:
   - Add `GITHUB_TOKEN` environment variable
   - Generator will use mock data without token

2. **GraphQL API errors**:
   - Verify token has correct permissions (`read:user`)
   - Check if token is expired
   - Ensure rate limits aren't exceeded

3. **Workflow not running**:
   - Check if Actions are enabled in repository settings
   - Verify `GITHUB_TOKEN` secret is properly configured
   - Check workflow file syntax

### Debug Mode

Run with debug information:
```bash
# View workflow logs in GitHub Actions tab
# Local debugging with token
GITHUB_TOKEN=your_token node src/githubcontibution/contribution-graph-generator.js
```

## 📝 License

This project is part of the Khushdil380 README generators collection.

---

**🌟 Generated with ❤️ using real GitHub contribution data**