# 🔧 Step-by-Step Setup Guide: GitHub Actions Automation

This guide will walk you through setting up the GitHub Actions automation for your contribution graph generator.

## 📋 Prerequisites

- ✅ A GitHub account
- ✅ The Khushdil380 repository with the contribution graph generator code
- ✅ Administrative access to your repository

---

## 🔑 Step 1: Create GitHub Personal Access Token

### 1.1 Navigate to GitHub Settings
1. Click on your **profile picture** in the top-right corner of GitHub
2. Select **"Settings"** from the dropdown menu
3. Scroll down in the left sidebar and click **"Developer settings"**
4. Click **"Personal access tokens"**
5. Select **"Tokens (classic)"**

### 1.2 Generate New Token
1. Click the **"Generate new token"** button
2. Select **"Generate new token (classic)"**
3. GitHub may ask for your password - enter it

### 1.3 Configure Token Settings
1. **Note/Description**: Enter `"Contribution Graph Generator"`
2. **Expiration**: Choose your preferred expiration (recommended: 90 days or 1 year)
3. **Select scopes**: Check the following permissions:
   - ✅ **`user`** - Grants read access to profile information
   - ✅ **`read:user`** - Read access to user profile data
   - ✅ **`user:email`** - Access to user email addresses (optional but recommended)

### 1.4 Generate and Copy Token
1. Scroll down and click **"Generate token"**
2. **⚠️ IMPORTANT**: Copy the token immediately and store it securely
3. **Note**: This token will only be shown once - save it now!

**Example token format**: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## 🏗️ Step 2: Add Token to Repository Secrets

### 2.1 Navigate to Repository Settings
1. Go to your **Khushdil380** repository
2. Click the **"Settings"** tab (near the top of the repository page)
3. In the left sidebar, scroll down to **"Security"** section
4. Click **"Secrets and variables"**
5. Select **"Actions"**

### 2.2 Create New Secret
1. Click the **"New repository secret"** button
2. Fill in the secret details:
   - **Name**: `GITHUB_TOKEN`
   - **Secret**: Paste your Personal Access Token from Step 1
3. Click **"Add secret"**

### 2.3 Verify Secret Creation
- You should see `GITHUB_TOKEN` listed in your repository secrets
- The value will be hidden (shows as `***`)

---

## 🚀 Step 3: Enable GitHub Actions (if not already enabled)

### 3.1 Check Actions Status
1. In your repository, click the **"Actions"** tab
2. If you see "Get started with GitHub Actions", Actions are not enabled
3. If you see workflows or "There are no workflow runs yet", Actions are enabled

### 3.2 Enable Actions (if needed)
1. If Actions are disabled, you'll see a green **"I understand my workflows, go ahead and enable them"** button
2. Click this button to enable Actions for your repository

---

## ⚙️ Step 4: Verify Workflow File

### 4.1 Check Workflow File Exists
1. In your repository, navigate to `.github/workflows/`
2. Verify `update-contribution-graph.yml` exists
3. The file should contain the automation workflow

### 4.2 Workflow Configuration
The workflow file should include:
```yaml
name: Update Contribution Graph
on:
  schedule:
    - cron: '0 12 * * *'  # Daily at 12:00 PM UTC
  workflow_dispatch:       # Manual trigger
```

---

## 🧪 Step 5: Test the Setup

### 5.1 Manual Trigger Test
1. Go to **Actions** tab in your repository
2. Click **"Update Contribution Graph"** workflow
3. Click **"Run workflow"** button (top right)
4. Select **"main"** branch
5. Click **"Run workflow"**

### 5.2 Monitor Execution
1. A new workflow run will appear
2. Click on the run to see details
3. Watch the steps execute:
   - ✅ Checkout repository
   - ✅ Setup Node.js
   - ✅ Install dependencies
   - ✅ Generate contribution graph
   - ✅ Check for changes
   - ✅ Commit and push (if changes detected)

### 5.3 Verify Results
1. Check if `assets/contributiongraph/contribution-graph.svg` was updated
2. Look for a new commit with message: "🌱 Update contribution graph [date]"
3. View the SVG file to ensure it contains real contribution data

---

## 📊 Step 6: View Your Contribution Graph

### 6.1 Direct File Access
- Navigate to `assets/contributiongraph/contribution-graph.svg` in your repository
- Click on the file to view the rendered SVG

### 6.2 Raw URL for Embedding
Use this URL in your README:
```
https://raw.githubusercontent.com/Khushdil380/Khushdil380/main/assets/contributiongraph/contribution-graph.svg
```

### 6.3 Add to README
Add this to your profile README.md:
```markdown
## 📈 GitHub Contribution Graph
![Contribution Graph](https://raw.githubusercontent.com/Khushdil380/Khushdil380/main/assets/contributiongraph/contribution-graph.svg)
```

---

## 🔍 Step 7: Troubleshooting

### 7.1 Common Issues and Solutions

#### ❌ **"Error: GraphQL API errors"**
**Cause**: Invalid or expired token
**Solution**: 
1. Generate a new Personal Access Token
2. Update the `GITHUB_TOKEN` secret with the new token

#### ❌ **"No token provided warning"**
**Cause**: Secret not properly configured
**Solution**:
1. Verify secret name is exactly `GITHUB_TOKEN`
2. Check token was pasted correctly (no extra spaces)

#### ❌ **"Workflow not running"**
**Cause**: Actions disabled or workflow file issues
**Solution**:
1. Enable Actions in repository settings
2. Check workflow file syntax
3. Verify file is in `.github/workflows/` directory

#### ❌ **"Permission denied"**
**Cause**: Token lacks required permissions
**Solution**:
1. Regenerate token with `read:user` scope
2. Update repository secret

### 7.2 Debug Information
View workflow logs:
1. Go to **Actions** tab
2. Click on latest workflow run
3. Expand each step to see detailed logs
4. Look for error messages and stack traces

---

## 📅 Step 8: Scheduled Automation

### 8.1 Automatic Schedule
- The workflow runs **daily at 12:00 PM UTC**
- No manual intervention required
- Automatically commits changes when contribution data updates

### 8.2 Time Zone Considerations
- UTC 12:00 PM = 5:30 PM IST (India)
- Adjust cron schedule if needed in workflow file:
```yaml
schedule:
  - cron: '0 18 * * *'  # 6:00 PM UTC = 11:30 PM IST
```

### 8.3 Manual Triggers
You can always run the workflow manually:
1. Go to **Actions** → **Update Contribution Graph**
2. Click **"Run workflow"**
3. Select branch and run

---

## ✅ Step 9: Verification Checklist

Before considering setup complete, verify:

- [ ] Personal Access Token created with correct permissions
- [ ] `GITHUB_TOKEN` secret added to repository
- [ ] GitHub Actions enabled for repository
- [ ] Workflow file exists at `.github/workflows/update-contribution-graph.yml`
- [ ] Manual workflow run completes successfully
- [ ] SVG file generated with real contribution data
- [ ] Automatic commits working (check after 24 hours)

---

## 🎯 Success Indicators

You'll know everything is working when:

1. **✅ Daily Commits**: New commits appear daily with contribution graph updates
2. **✅ Real Data**: SVG shows your actual GitHub contribution patterns
3. **✅ Visual Features**: Monthly colors, snake animation, and tooltips work
4. **✅ No Errors**: Workflow runs complete without failures

---

## 📞 Support

If you encounter issues:

1. **Check workflow logs** in Actions tab for specific error messages
2. **Verify token permissions** - regenerate if needed
3. **Test locally** with the same token:
   ```bash
   GITHUB_TOKEN=your_token node src/githubcontibution/contribution-graph-generator.js
   ```

---

**🎉 Congratulations!** Your automated GitHub contribution graph is now set up and will update daily with real data!