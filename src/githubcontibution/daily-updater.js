#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 🤖 DAILY AUTOMATION SCRIPT
class ContributionGraphUpdater {
  constructor() {
    this.scriptPath = path.join(__dirname, 'contribution-graph-generator.js');
    this.timestampPath = path.join(__dirname, '../../assets/contributiongraph/last-updated.json');
    this.logPath = path.join(__dirname, '../../assets/contributiongraph/update-log.txt');
  }

  // 📅 Check if update is needed
  needsUpdate() {
    try {
      if (!fs.existsSync(this.timestampPath)) {
        return { needed: true, reason: 'No timestamp file found' };
      }

      const timestamp = JSON.parse(fs.readFileSync(this.timestampPath, 'utf8'));
      const lastUpdated = new Date(timestamp.lastUpdated);
      const now = new Date();
      const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);

      if (hoursSinceUpdate >= 24) {
        return { needed: true, reason: `Last updated ${Math.floor(hoursSinceUpdate)} hours ago` };
      }

      return { needed: false, reason: `Updated ${Math.floor(hoursSinceUpdate)} hours ago` };
    } catch (error) {
      return { needed: true, reason: `Error reading timestamp: ${error.message}` };
    }
  }

  // 📝 Log update activity
  logActivity(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    console.log(logEntry.trim());
    
    try {
      fs.appendFileSync(this.logPath, logEntry);
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  // 🔄 Run the contribution graph generator
  async runGenerator() {
    return new Promise((resolve, reject) => {
      exec(`node "${this.scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Generator failed: ${error.message}`));
          return;
        }

        if (stderr) {
          console.warn('Generator warnings:', stderr);
        }

        resolve(stdout);
      });
    });
  }

  // 🚀 Main update function
  async update(force = false) {
    this.logActivity('🔍 Checking if update is needed...');
    
    const updateCheck = this.needsUpdate();
    
    if (!force && !updateCheck.needed) {
      this.logActivity(`⏭️  Skip: ${updateCheck.reason}`);
      return { updated: false, reason: updateCheck.reason };
    }

    this.logActivity(`🔄 Starting update: ${updateCheck.reason}`);

    try {
      const output = await this.runGenerator();
      this.logActivity('✅ Contribution graph updated successfully');
      this.logActivity('📊 Generator output:');
      output.split('\n').forEach(line => {
        if (line.trim()) this.logActivity(`   ${line.trim()}`);
      });

      return { updated: true, output };
    } catch (error) {
      this.logActivity(`❌ Update failed: ${error.message}`);
      throw error;
    }
  }

  // 📈 Get update statistics
  getStats() {
    try {
      if (!fs.existsSync(this.logPath)) {
        return { totalUpdates: 0, lastUpdate: null, errors: 0 };
      }

      const logContent = fs.readFileSync(this.logPath, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim());
      
      const successfulUpdates = lines.filter(line => 
        line.includes('✅ Contribution graph updated successfully')
      ).length;
      
      const errors = lines.filter(line => 
        line.includes('❌ Update failed')
      ).length;

      const lastUpdateLine = lines.reverse().find(line => 
        line.includes('✅ Contribution graph updated successfully')
      );

      let lastUpdate = null;
      if (lastUpdateLine) {
        const match = lastUpdateLine.match(/\[(.*?)\]/);
        if (match) lastUpdate = new Date(match[1]);
      }

      return {
        totalUpdates: successfulUpdates,
        lastUpdate,
        errors,
        totalLogEntries: lines.length
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  // 🧹 Clean old log entries (keep last 100 entries)
  cleanLogs() {
    try {
      if (!fs.existsSync(this.logPath)) return;

      const logContent = fs.readFileSync(this.logPath, 'utf8');
      const lines = logContent.split('\n').filter(line => line.trim());
      
      if (lines.length > 100) {
        const recentLines = lines.slice(-100);
        fs.writeFileSync(this.logPath, recentLines.join('\n') + '\n');
        this.logActivity(`🧹 Cleaned log file: kept last 100 entries`);
      }
    } catch (error) {
      this.logActivity(`⚠️ Failed to clean logs: ${error.message}`);
    }
  }
}

// 🎯 COMMAND LINE INTERFACE
async function main() {
  const updater = new ContributionGraphUpdater();
  const args = process.argv.slice(2);

  try {
    if (args.includes('--help') || args.includes('-h')) {
      console.log(`
🤖 GitHub Contribution Graph Auto-Updater

Usage:
  node daily-updater.js [options]

Options:
  --force, -f     Force update even if recently updated
  --stats, -s     Show update statistics
  --clean, -c     Clean old log entries
  --help, -h      Show this help message

Examples:
  node daily-updater.js           # Check and update if needed
  node daily-updater.js --force   # Force immediate update
  node daily-updater.js --stats   # Show update statistics
      `);
      return;
    }

    if (args.includes('--stats') || args.includes('-s')) {
      const stats = updater.getStats();
      console.log('\n📈 Update Statistics:');
      console.log(`   Total successful updates: ${stats.totalUpdates || 0}`);
      console.log(`   Total errors: ${stats.errors || 0}`);
      console.log(`   Last update: ${stats.lastUpdate ? stats.lastUpdate.toLocaleString() : 'Never'}`);
      console.log(`   Total log entries: ${stats.totalLogEntries || 0}`);
      return;
    }

    if (args.includes('--clean') || args.includes('-c')) {
      updater.cleanLogs();
      return;
    }

    const force = args.includes('--force') || args.includes('-f');
    const result = await updater.update(force);

    if (result.updated) {
      console.log('\n🎉 Update completed successfully!');
    } else {
      console.log(`\n⏭️  No update needed: ${result.reason}`);
    }

    // Clean logs periodically
    if (Math.random() < 0.1) { // 10% chance
      updater.cleanLogs();
    }

  } catch (error) {
    console.error('\n❌ Update failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = ContributionGraphUpdater;