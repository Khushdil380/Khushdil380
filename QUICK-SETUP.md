# 🚀 Quick Setup Reference

## 1. Create GitHub Personal Access Token
1. GitHub Profile → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Name: `Contribution Graph Generator`
4. Scopes: ✅ `user` and ✅ `read:user`
5. Copy token: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 2. Add Repository Secret
1. Repository → Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `GITHUB_TOKEN`
4. Value: [Paste your token]
5. Add secret

## 3. Test Setup
1. Actions tab → Update Contribution Graph → Run workflow
2. Check logs for successful execution
3. Verify `assets/contributiongraph/contribution-graph.svg` updated

## 4. Add to README
```markdown
![Contribution Graph](https://raw.githubusercontent.com/Khushdil380/Khushdil380/main/assets/contributiongraph/contribution-graph.svg)
```

## ✅ Success Indicators
- Daily automatic commits
- Real GitHub contribution data in SVG
- No workflow errors

**⏰ Runs daily at 12:00 PM UTC automatically**