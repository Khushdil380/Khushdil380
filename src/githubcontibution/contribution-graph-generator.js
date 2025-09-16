import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  username: "Khushdil380",
  githubToken: process.env.GITHUB_TOKEN || null,
  
  cellSize: 15,
  cellGap: 3,
  weeksInYear: 53,
  daysInWeek: 7,
  
  monthColors: {
    0: "#3B4252", 1: "#5E81AC", 2: "#81A1C1", 3: "#88C0D0",
    4: "#B48EAD", 5: "#D08770", 6: "#EBCB8B", 7: "#A3BE8C",
    8: "#BF616A", 9: "#D08770", 10: "#5E81AC", 11: "#4C566A"
  },
  
  contributionFills: {
    0: "transparent", 25: "#0d4429", 50: "#006d32", 
    75: "#26a641", 100: "#39d353"
  },
  
  snake: {
    color: "#ff6b6b",
    headColor: "#ff3030",
    bodySegments: 6,
    speed: 2.0,
    glowEffect: true,
    smoothMovement: true
  }
};

// Utility functions
function getDayName(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

function formatDate(date) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// GitHub API Integration
async function fetchRealContributions() {
  // Check if we're in GitHub Actions environment
  const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  const token = process.env.GITHUB_TOKEN;
  
  if (!token && isGitHubActions) {
    console.error('❌ GITHUB_TOKEN is required for GitHub Actions');
    process.exit(1);
  }
  
  if (!token) {
    console.log('⚠️ No GitHub token provided, using mock data...');
    return generateMockData();
  }

  const { request, gql } = await import('graphql-request');
  
  const ENDPOINT = "https://api.github.com/graphql";
  
  const query = gql`
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                color
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    console.log('🔄 Fetching real GitHub contribution data...');
    const data = await request(
      ENDPOINT,
      query,
      { username: config.username },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    
    const weeks = data.user.contributionsCollection.contributionCalendar.weeks;
    const totalContributions = data.user.contributionsCollection.contributionCalendar.totalContributions;
    
    console.log(`📊 Total contributions: ${totalContributions}`);
    console.log(`� Fetched ${weeks.length} weeks of contribution data`);
    
    return weeks;
  } catch (error) {
    console.error('❌ Error fetching GitHub data:', error.message);
    
    if (isGitHubActions) {
      console.error('💀 GitHub Actions requires valid token, exiting...');
      process.exit(1);
    } else {
      console.log('� Falling back to mock data...');
      return generateMockData();
    }
  }
}

// 🎲 GENERATE MOCK DATA (for local testing)
function generateMockData() {
  console.log('🎲 Generating mock contribution data...');
  
  const weeks = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear(), 0, 1); // Start of current year
  
  // Generate 53 weeks of data
  for (let week = 0; week < 53; week++) {
    const contributionDays = [];
    
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (week * 7) + day);
      
      // Don't generate future dates
      const today = new Date();
      if (currentDate > today) {
        break;
      }
      
      const contributionCount = Math.random() < 0.7 ? 
        Math.floor(Math.random() * 15) : 0; // 70% chance of contributions
      
      contributionDays.push({
        date: currentDate.toISOString().split('T')[0],
        contributionCount: contributionCount,
        color: contributionCount > 0 ? "#39d353" : "#161b22"
      });
    }
    
    if (contributionDays.length > 0) {
      weeks.push({ contributionDays });
    }
  }
  
  console.log(`🎲 Generated ${weeks.length} weeks of mock data`);
  return weeks;
}

// 🐍 REALISTIC SNAKE PATH GENERATOR
function generateRealisticSnakePath() {
  const path = [];
  
  // Start from a corner or edge for more natural movement
  let currentWeek = 0;
  let currentDay = Math.floor(config.daysInWeek / 2);
  
  // Direction state for momentum-based movement
  let direction = { w: 1, d: 0 }; // Start moving right
  let momentum = 0;
  
  const visited = new Set();
  const maxSteps = Math.min(config.weeksInYear * config.daysInWeek * 0.4, 150);
  
  for (let step = 0; step < maxSteps; step++) {
    const cellKey = `${currentWeek}-${currentDay}`;
    
    // Add current position to path
    path.push({
      week: currentWeek,
      day: currentDay,
      x: currentWeek * (config.cellSize + config.cellGap),
      y: currentDay * (config.cellSize + config.cellGap),
      timestamp: step
    });
    visited.add(cellKey);
    
    // Calculate next move with realistic snake behavior
    let possibleMoves = [];
    
    // Prefer continuing in current direction (momentum)
    if (momentum > 0) {
      const nextWeek = currentWeek + direction.w;
      const nextDay = currentDay + direction.d;
      if (nextWeek >= 0 && nextWeek < config.weeksInYear && 
          nextDay >= 0 && nextDay < config.daysInWeek &&
          !visited.has(`${nextWeek}-${nextDay}`)) {
        possibleMoves.push({ w: direction.w, d: direction.d, weight: 3 });
      }
    }
    
    // Add other possible moves
    const moves = [
      { w: 1, d: 0, weight: 2 },   // Right
      { w: -1, d: 0, weight: 1 },  // Left (less preferred)
      { w: 0, d: 1, weight: 2 },   // Down
      { w: 0, d: -1, weight: 2 },  // Up
      { w: 1, d: 1, weight: 1 },   // Diagonal down-right
      { w: -1, d: -1, weight: 1 }, // Diagonal up-left
      { w: 1, d: -1, weight: 1 },  // Diagonal up-right
      { w: -1, d: 1, weight: 1 }   // Diagonal down-left
    ];
    
    moves.forEach(move => {
      const nextWeek = currentWeek + move.w;
      const nextDay = currentDay + move.d;
      if (nextWeek >= 0 && nextWeek < config.weeksInYear && 
          nextDay >= 0 && nextDay < config.daysInWeek &&
          !visited.has(`${nextWeek}-${nextDay}`)) {
        possibleMoves.push(move);
      }
    });
    
    if (possibleMoves.length === 0) break; // No more moves available
    
    // Weighted random selection
    const totalWeight = possibleMoves.reduce((sum, move) => sum + move.weight, 0);
    let randomWeight = Math.random() * totalWeight;
    let selectedMove = possibleMoves[0];
    
    for (const move of possibleMoves) {
      randomWeight -= move.weight;
      if (randomWeight <= 0) {
        selectedMove = move;
        break;
      }
    }
    
    // Update position and direction
    currentWeek += selectedMove.w;
    currentDay += selectedMove.d;
    
    // Update momentum and direction
    if (selectedMove.w === direction.w && selectedMove.d === direction.d) {
      momentum = Math.min(momentum + 1, 5); // Increase momentum
    } else {
      direction = { w: selectedMove.w, d: selectedMove.d };
      momentum = 1; // Reset momentum with new direction
    }
    
    // Random momentum decay
    if (Math.random() < 0.1) {
      momentum = Math.max(0, momentum - 1);
    }
  }
  
  return path;
}

// 🎨 SVG GENERATION
async function generateContributionGraph() {
  const weeks = await fetchRealContributions();
  const snakePath = generateRealisticSnakePath();
  
  const width = config.weeksInYear * (config.cellSize + config.cellGap);
  const height = config.daysInWeek * (config.cellSize + config.cellGap);
  const totalWidth = width + 100; // Extra space for labels
  const totalHeight = height + 80; // Reduced bottom margin
  
  // Build contribution data map from GitHub weeks format
  const contributionMap = new Map();
  weeks.forEach(week => {
    week.contributionDays.forEach(day => {
      contributionMap.set(day.date, day.contributionCount);
    });
  });
  
  // Generate contribution cells
  let contributionCells = '';
  let weekIndex = 0;
  
  for (let week of weeks) {
    for (let dayIndex = 0; dayIndex < week.contributionDays.length; dayIndex++) {
      const day = week.contributionDays[dayIndex];
      const x = weekIndex * (config.cellSize + config.cellGap);
      const y = dayIndex * (config.cellSize + config.cellGap);
      
      const date = new Date(day.date);
      const month = date.getMonth();
      const baseColor = config.monthColors[month];
      
      // Determine fill level based on contribution count
      let fillLevel = 0;
      if (day.contributionCount >= 10) fillLevel = 100;
      else if (day.contributionCount >= 6) fillLevel = 75;
      else if (day.contributionCount >= 3) fillLevel = 50;
      else if (day.contributionCount >= 1) fillLevel = 25;
      
      const fillColor = config.contributionFills[fillLevel];
      const dateStr = formatDate(date); // Pass the Date object
      const dayName = getDayName(date);

      contributionCells += `
        <g class="contribution-cell">
          <!-- Base cell (monthly color) -->
          <rect x="${x}" y="${y}" width="${config.cellSize}" height="${config.cellSize}" 
                fill="${baseColor}" rx="2" ry="2" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
          
          <!-- Contribution fill with progressive animation -->
          ${fillLevel > 0 ? `
            <rect x="${x + 1}" y="${y + config.cellSize - 1}" width="${config.cellSize - 2}" height="1" 
                  fill="${fillColor}" rx="1" ry="1">
              <animate attributeName="height" 
                       values="0;${(config.cellSize - 2) * (fillLevel / 100)}" 
                       dur="0.5s" begin="${weekIndex * 0.02}s"/>
              <animate attributeName="y" 
                       values="${y + config.cellSize - 1};${y + config.cellSize - (config.cellSize - 2) * (fillLevel / 100)}" 
                       dur="0.5s" begin="${weekIndex * 0.02}s"/>
            </rect>` : ''}
            
          <!-- Invisible hover area -->
          <rect x="${x}" y="${y}" width="${config.cellSize}" height="${config.cellSize}" 
                fill="transparent" stroke="none">
            <title>${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''} on ${dayName}, ${dateStr}</title>
          </rect>
        </g>`;
    }
    weekIndex++;
  }
  
  // Generate realistic snake animation
  let snakeAnimation = '';
  if (snakePath.length > 0) {
    // Create smooth curved path using spline interpolation
    const smoothPath = createSmoothPath(snakePath);
    const totalLength = calculatePathLength(smoothPath);
    const animationDuration = totalLength * config.snake.speed * 0.01; // More realistic speed
    
    // Snake head with dynamic size and glow
    snakeAnimation += `
      <circle r="4" fill="${config.snake.headColor}" opacity="0.95">
        <animateMotion dur="${animationDuration}s" repeatCount="indefinite" rotate="auto">
          <mpath href="#snakePath"/>
        </animateMotion>
        <!-- Breathing effect -->
        <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
        <!-- Pulse glow -->
        <animate attributeName="opacity" values="0.95;0.7;0.95" dur="1.5s" repeatCount="indefinite"/>
      </circle>`;
    
    // Snake body segments with varying delays and sizes
    const bodySegments = Math.min(config.snake.bodySegments, 8);
    for (let i = 1; i <= bodySegments; i++) {
      const delay = i * 0.4; // Increased spacing between segments
      const size = Math.max(2, 4 - i * 0.3);
      const opacity = Math.max(0.3, 0.9 - i * 0.08);
      
      snakeAnimation += `
        <circle r="${size}" fill="${config.snake.color}" opacity="${opacity}">
          <animateMotion dur="${animationDuration}s" repeatCount="indefinite" begin="${delay}s">
            <mpath href="#snakePath"/>
          </animateMotion>
          <!-- Subtle size variation -->
          <animate attributeName="r" values="${size};${size * 0.8};${size}" dur="${3 + i * 0.5}s" repeatCount="indefinite"/>
        </circle>`;
    }
    
    // Create smooth SVG path
    snakeAnimation = `
      <defs>
        <path id="snakePath" d="${smoothPath}" fill="none" stroke="none"/>
        <!-- Add glow filter for snake -->
        <filter id="snakeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#snakeGlow)">
        ${snakeAnimation}
      </g>`;
  }

// Helper function to create smooth curved path
function createSmoothPath(points) {
  if (points.length < 2) return '';
  
  let path = `M ${points[0].x + config.cellSize/2} ${points[0].y + config.cellSize/2}`;
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    const currX = curr.x + config.cellSize/2;
    const currY = curr.y + config.cellSize/2;
    
    if (i === 1) {
      // First segment - simple line
      path += ` L ${currX} ${currY}`;
    } else if (i === points.length - 1) {
      // Last segment - simple line
      path += ` L ${currX} ${currY}`;
    } else {
      // Middle segments - use smooth curves
      const nextX = next.x + config.cellSize/2;
      const nextY = next.y + config.cellSize/2;
      
      // Calculate control points for smooth curve
      const cp1x = currX - (currX - prev.x - config.cellSize/2) * 0.3;
      const cp1y = currY - (currY - prev.y - config.cellSize/2) * 0.3;
      const cp2x = currX + (nextX - currX) * 0.3;
      const cp2y = currY + (nextY - currY) * 0.3;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currX} ${currY}`;
    }
  }
  
  return path;
}

// Helper function to calculate approximate path length
function calculatePathLength(path) {
  // Simple approximation based on character count
  return path.length * 0.1;
  }
  
  // Month labels with accurate positioning
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let monthLabels = '';
  
  // Track first occurrence of each month to position labels
  const monthPositions = {};
  weekIndex = 0;
  for (let week of weeks) {
    for (let day of week.contributionDays) {
      const date = new Date(day.date);
      const month = date.getMonth();
      if (!monthPositions[month]) {
        monthPositions[month] = weekIndex;
      }
    }
    weekIndex++;
  }
  
  Object.entries(monthPositions).forEach(([month, weekIndex]) => {
    const x = weekIndex * (config.cellSize + config.cellGap);
    monthLabels += `
      <text x="${x}" y="${height + 20}" fill="#8b949e" 
            font-family="Segoe UI, Arial, sans-serif" font-size="12" text-anchor="start">
        ${monthNames[parseInt(month)]}
      </text>`;
  });
  
  // Day labels - show Mon, Wed, Fri to avoid overlap
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const displayDays = [1, 3, 5]; // Monday, Wednesday, Friday indices
  let dayLabels = '';
  displayDays.forEach((dayIndex) => {
    const y = dayIndex * (config.cellSize + config.cellGap) + config.cellSize / 2;
    dayLabels += `
      <text x="${width + 10}" y="${y + 4}" fill="#8b949e" 
            font-family="Segoe UI, Arial, sans-serif" font-size="10" text-anchor="start">
        ${dayNames[dayIndex]}
      </text>`;
  });
  
  // Legend with contribution level squares only
  const legend = `
    <g transform="translate(${width + 10}, ${height - 40})">
      ${Object.entries(config.contributionFills).map(([ level, color], index) => {
        if (level === '0') return '';
        return `<rect x="${(index - 1) * 15}" y="-8" width="10" height="10" fill="${color}" rx="2"/>`;
      }).join('')}
    </g>`;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" 
     viewBox="0 0 ${totalWidth} ${totalHeight}" style="background: #0d1117;">
  
  <title>GitHub Contribution Graph - ${config.username}</title>
  
  <!-- Contribution Graph -->
  <g transform="translate(40, 20)">
    ${contributionCells}
    
    <!-- Month Labels -->
    ${monthLabels}
    
    <!-- Day Labels -->
    ${dayLabels}
    
    <!-- Legend -->
    ${legend}
    
    <!-- Snake Animation -->
    ${snakeAnimation}
  </g>
  
  <!-- Title -->
  <text x="${totalWidth / 2}" y="15" fill="#f0f6fc" 
        font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle">
    ${config.username}'s Contribution Graph
  </text>
  
</svg>`;
}

// 🚀 MAIN FUNCTION
async function createContributionGraph() {
  try {
    // Get project root directory (3 levels up from this file)
    const projectRoot = path.resolve(__dirname, '../../..');
    const outputDir = path.join(projectRoot, "assets/contributiongraph");
    const outputPath = path.join(outputDir, "contribution-graph.svg");
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate and save SVG
    const svgContent = await generateContributionGraph();
    fs.writeFileSync(outputPath, svgContent);
    
    console.log("✅ GitHub contribution graph generated successfully!");
    console.log(`📁 Location: ${outputPath}`);
    console.log(`📊 Features:`);
    console.log(`   🎨 Monthly color coding (12 different colors)`);
    console.log(`   📈 Progressive fill system (25%, 50%, 75%, 100%)`);
    console.log(`   🐍 Animated snake moving through graph`);
    console.log(`   📅 Accurate calendar year mapping (${new Date().getFullYear()})`);
    console.log(`   💫 Smooth fill animations`);
    console.log(`   🖱️  Hover tooltips with contribution count and date`);
    console.log(`   � Optimized layout with reduced padding`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the generator
createContributionGraph();