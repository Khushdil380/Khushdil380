#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 🛠️ AUTOMATION SETUP SCRIPT
class AutomationSetup {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '../..');
    this.scriptPath = path.join(__dirname, 'run-daily-update.bat');
  }

  // 📋 Display setup instructions
  showInstructions() {
    console.log(`
🤖 GitHub Contribution Graph - Daily Automation Setup
======================================================

This setup will help you configure daily automatic updates for your contribution graph.

📁 Files created:
   ✅ daily-updater.js          - Main automation script
   ✅ run-daily-update.bat      - Windows batch script
   ✅ github-api.js             - GitHub API integration

🔧 Setup Options:

1️⃣  MANUAL UPDATES (Immediate):
   • Run: node src/githubcontibution/daily-updater.js
   • Or:  double-click run-daily-update.bat

2️⃣  WINDOWS TASK SCHEDULER (Recommended):
   • Opens Windows Task Scheduler
   • Creates daily task at specified time
   • Runs automatically in background

3️⃣  GITHUB TOKEN (Optional but recommended):
   • Higher API rate limits
   • More reliable data fetching
   • Add token to contribution-graph-generator.js

💡 Commands available:
   node daily-updater.js --help     # Show help
   node daily-updater.js --stats    # Show update statistics  
   node daily-updater.js --force    # Force immediate update
   node daily-updater.js --clean    # Clean old logs

🎯 What would you like to do?
   [1] Run update now
   [2] Setup Windows Task Scheduler  
   [3] Show current status
   [4] Exit
    `);
  }

  // 🔄 Run immediate update
  async runUpdate() {
    console.log('\n🔄 Running immediate update...\n');
    
    return new Promise((resolve, reject) => {
      const updaterPath = path.join(__dirname, 'daily-updater.js');
      exec(`node "${updaterPath}" --force`, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Update failed:', error.message);
          reject(error);
          return;
        }

        console.log(stdout);
        if (stderr) console.warn(stderr);
        
        console.log('\n✅ Update completed! Check assets/contributiongraph/ for results.');
        resolve();
      });
    });
  }

  // 📅 Setup Windows Task Scheduler
  setupTaskScheduler() {
    console.log('\n📅 Setting up Windows Task Scheduler...\n');

    // Create a PowerShell script to set up the scheduled task
    const setupScript = `
# GitHub Contribution Graph - Task Scheduler Setup
$TaskName = "GitHub-Contribution-Graph-Update"
$ScriptPath = "${this.scriptPath.replace(/\\/g, '\\\\')}"
$Description = "Daily update of GitHub contribution graph"

# Check if task already exists
$ExistingTask = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue

if ($ExistingTask) {
    Write-Host "⚠️  Task '$TaskName' already exists. Updating..."
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

# Create new task
$Action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c \\"$ScriptPath\\""
$Trigger = New-ScheduledTaskTrigger -Daily -At "09:00"
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
$Principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType ServiceAccount

Register-ScheduledTask -TaskName $TaskName -Action $Action -Trigger $Trigger -Settings $Settings -Principal $Principal -Description $Description

Write-Host "✅ Task '$TaskName' created successfully!"
Write-Host "🕘 Scheduled to run daily at 9:00 AM"
Write-Host "🔧 You can modify the schedule in Task Scheduler if needed"

# Open Task Scheduler
Start-Process "taskschd.msc"
    `;

    const tempScriptPath = path.join(__dirname, 'temp-setup.ps1');
    
    try {
      fs.writeFileSync(tempScriptPath, setupScript);
      
      exec(`powershell -ExecutionPolicy Bypass -File "${tempScriptPath}"`, (error, stdout, stderr) => {
        // Clean up temp file
        try {
          fs.unlinkSync(tempScriptPath);
        } catch (e) {
          // Ignore cleanup errors
        }

        if (error) {
          console.error('❌ Failed to setup task scheduler:', error.message);
          console.log('\n🔧 Manual setup instructions:');
          console.log('1. Open Task Scheduler (taskschd.msc)');
          console.log('2. Create Basic Task');
          console.log('3. Name: GitHub-Contribution-Graph-Update');
          console.log('4. Trigger: Daily');
          console.log('5. Action: Start a program');
          console.log(`6. Program: ${this.scriptPath}`);
          return;
        }

        console.log(stdout);
        if (stderr) console.warn(stderr);
      });
    } catch (error) {
      console.error('❌ Failed to create setup script:', error.message);
    }
  }

  // 📊 Show current status
  async showStatus() {
    console.log('\n📊 Current Status:\n');

    try {
      // Check if files exist
      const files = [
        'contribution-graph-generator.js',
        'daily-updater.js', 
        'github-api.js',
        'run-daily-update.bat'
      ];

      console.log('📁 Files:');
      files.forEach(file => {
        const exists = fs.existsSync(path.join(__dirname, file));
        console.log(`   ${exists ? '✅' : '❌'} ${file}`);
      });

      // Check last update
      const timestampPath = path.join(this.projectRoot, 'assets/contributiongraph/last-updated.json');
      if (fs.existsSync(timestampPath)) {
        const timestamp = JSON.parse(fs.readFileSync(timestampPath, 'utf8'));
        console.log(`\\n🕒 Last Update: ${new Date(timestamp.lastUpdated).toLocaleString()}`);
        console.log(`🔄 Next Update: ${new Date(timestamp.nextUpdate).toLocaleString()}`);
      } else {
        console.log('\\n🕒 Last Update: Never');
      }

      // Show stats
      const ContributionGraphUpdater = require('./daily-updater');
      const updater = new ContributionGraphUpdater();
      const stats = updater.getStats();
      
      console.log('\\n📈 Statistics:');
      console.log(`   Total updates: ${stats.totalUpdates || 0}`);
      console.log(`   Errors: ${stats.errors || 0}`);
      
    } catch (error) {
      console.error('❌ Failed to get status:', error.message);
    }
  }

  // 🎯 Interactive menu
  async runInteractive() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = (question) => {
      return new Promise((resolve) => {
        rl.question(question, resolve);
      });
    };

    try {
      this.showInstructions();
      
      const choice = await askQuestion('Enter your choice (1-4): ');
      
      switch (choice.trim()) {
        case '1':
          await this.runUpdate();
          break;
        case '2':
          this.setupTaskScheduler();
          break;
        case '3':
          await this.showStatus();
          break;
        case '4':
          console.log('👋 Goodbye!');
          break;
        default:
          console.log('❌ Invalid choice. Please run the script again.');
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
    } finally {
      rl.close();
    }
  }
}

// 🚀 Main execution
async function main() {
  const setup = new AutomationSetup();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    setup.showInstructions();
  } else if (args.includes('--run')) {
    await setup.runUpdate();
  } else if (args.includes('--schedule')) {
    setup.setupTaskScheduler();
  } else if (args.includes('--status')) {
    await setup.showStatus();
  } else {
    await setup.runInteractive();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AutomationSetup;