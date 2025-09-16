const https = require('https');

// 🌐 GITHUB API INTEGRATION
class GitHubAPI {
  constructor(username, token = null) {
    this.username = username;
    this.token = token; // Optional: Add your GitHub token for higher rate limits
    this.baseURL = 'api.github.com';
  }

  // 📊 Fetch real contribution data from GitHub GraphQL API
  async fetchContributionData(year = new Date().getFullYear()) {
    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  weekday
                }
              }
            }
          }
        }
      }
    `;

    const variables = {
      username: this.username,
      from: `${year}-01-01T00:00:00Z`,
      to: `${year}-12-31T23:59:59Z`
    };

    const postData = JSON.stringify({
      query: query,
      variables: variables
    });

    const options = {
      hostname: this.baseURL,
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'GitHub-Contribution-Generator'
      }
    };

    // Add authorization if token is provided
    if (this.token) {
      options.headers['Authorization'] = `Bearer ${this.token}`;
    }

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            
            if (response.errors) {
              console.log('⚠️  GitHub API Response:', response);
              console.log('📝 Note: Using mock data due to API limitations');
              resolve(this.generateMockData(year));
              return;
            }

            if (response.data && response.data.user) {
              resolve(this.processGitHubData(response.data.user.contributionsCollection));
            } else {
              console.log('📝 Note: No GitHub data available, using mock data');
              resolve(this.generateMockData(year));
            }
          } catch (error) {
            console.log('📝 Note: Using mock data due to parsing error');
            resolve(this.generateMockData(year));
          }
        });
      });

      req.on('error', (error) => {
        console.log('📝 Note: Using mock data due to network error');
        resolve(this.generateMockData(year));
      });

      req.write(postData);
      req.end();
    });
  }

  // 🔄 Process GitHub API response data
  processGitHubData(contributionsCollection) {
    const processedData = [];
    
    contributionsCollection.contributionCalendar.weeks.forEach((week, weekIndex) => {
      const weekData = [];
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date);
        weekData.push({
          date: date,
          count: day.contributionCount,
          level: this.getContributionLevel(day.contributionCount),
          month: date.getMonth(),
          isCurrentYear: date.getFullYear() === new Date().getFullYear(),
          isPastOrToday: date <= new Date()
        });
      });
      processedData.push(weekData);
    });

    return processedData;
  }

  // 🎲 Generate realistic mock data when API is not available
  generateMockData(year = new Date().getFullYear()) {
    console.log('🎲 Generating realistic mock contribution data...');
    
    const contributions = [];
    const startDate = new Date(year, 0, 1);
    
    // Get the first Sunday of the year (or before if Jan 1 is not Sunday)
    let currentDate = new Date(startDate);
    while (currentDate.getDay() !== 0) {
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    // Generate 53 weeks worth of data
    for (let week = 0; week < 53; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const cellDate = new Date(currentDate);
        cellDate.setDate(currentDate.getDate() + (week * 7) + day);
        
        // Only generate contributions for days within the target year and not future dates
        let count = 0;
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        if (cellDate.getFullYear() === year && cellDate <= today) {
          // More realistic contribution patterns
          const dayOfWeek = cellDate.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const isWorkDay = dayOfWeek >= 1 && dayOfWeek <= 5;
          
          const random = Math.random();
          
          // Different patterns for weekdays vs weekends
          if (isWorkDay) {
            if (random > 0.8) count = Math.floor(Math.random() * 20) + 5; // High activity days
            else if (random > 0.5) count = Math.floor(Math.random() * 8) + 1; // Normal activity
            else if (random > 0.3) count = Math.floor(Math.random() * 3) + 1; // Low activity
            // else 0 (no activity)
          } else if (isWeekend) {
            if (random > 0.7) count = Math.floor(Math.random() * 15) + 1; // Some weekend coding
            else if (random > 0.5) count = Math.floor(Math.random() * 5) + 1; // Light weekend work
            // else 0 (weekend rest)
          }
          
          // Add some seasonal variation
          const month = cellDate.getMonth();
          if (month === 11 || month === 0) count = Math.floor(count * 0.7); // Holiday slowdown
          if (month >= 2 && month <= 4) count = Math.floor(count * 1.3); // Spring productivity
        }
        
        weekData.push({
          date: new Date(cellDate),
          count: count,
          level: this.getContributionLevel(count),
          month: cellDate.getMonth(),
          isCurrentYear: cellDate.getFullYear() === year,
          isPastOrToday: cellDate <= today
        });
      }
      contributions.push(weekData);
    }
    
    return contributions;
  }

  // 📊 Calculate contribution level based on count
  getContributionLevel(count) {
    if (count === 0) return 0;
    if (count >= 1 && count <= 5) return 25;
    if (count >= 6 && count <= 8) return 50;
    if (count >= 9 && count <= 10) return 75;
    return 100; // above 10 contributions
  }

  // 📈 Get total contributions for display
  getTotalContributions(contributionData) {
    let total = 0;
    contributionData.forEach(week => {
      week.forEach(day => {
        if (day.isPastOrToday) {
          total += day.count;
        }
      });
    });
    return total;
  }

  // 📅 Get contribution streak information
  getStreakInfo(contributionData) {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Flatten and sort by date
    const allDays = [];
    contributionData.forEach(week => {
      week.forEach(day => {
        if (day.isPastOrToday) {
          allDays.push(day);
        }
      });
    });
    
    allDays.sort((a, b) => a.date - b.date);
    
    // Calculate streaks
    for (let i = allDays.length - 1; i >= 0; i--) {
      if (allDays[i].count > 0) {
        tempStreak++;
        if (i === allDays.length - 1) currentStreak = tempStreak;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
        if (currentStreak === 0) currentStreak = 0;
      }
    }
    
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { currentStreak, longestStreak };
  }
}

module.exports = GitHubAPI;