const fs = require("fs");
const path = require("path");

// 🎨 SKILL CONFIGURATION - Add your skills here
const skillsConfig = [
  {
    name: "HTML",
    icon: "html5.png",
    rating: 9,
    color: "#E34F26",
    glowColor: "#E34F26"
  },
  {
    name: "CSS",
    icon: "css.png", 
    rating: 8,
    color: "#1572B6",
    glowColor: "#1572B6"
  },
  {
    name: "JavaScript",
    icon: "js.png",
    rating: 8,
    color: "#F7DF1E",
    glowColor: "#F7DF1E"
  },
  {
    name: "React",
    icon: "react.png",
    rating: 7,
    color: "#61DAFB",
    glowColor: "#61DAFB"
  },
  {
    name: "Python",
    icon: "python.png",
    rating: 8,
    color: "#3776AB",
    glowColor: "#3776AB"
  },
  {
    name: "Node.js",
    icon: "nodeJs.png",
    rating: 7,
    color: "#339933",
    glowColor: "#339933"
  },
  {
    name: "C",
    icon: "c.png",
    rating: 6,
    color: "#A8B9CC",
    glowColor: "#A8B9CC"
  },
  {
    name: "C++",
    icon: "cpp.png",
    rating: 7,
    color: "#00599C",
    glowColor: "#00599C"
  },
  {
    name: "SQL",
    icon: "sql.png",
    rating: 6,
    color: "#4479A1",
    glowColor: "#4479A1"
  },
  {
    name: "Git",
    icon: "git.png",
    rating: 8,
    color: "#F05032",
    glowColor: "#F05032"
  },
  {
    name: "GitHub",
    icon: "github.png",
    rating: 8,
    color: "#181717",
    glowColor: "#ffffff"
  }
];

// 🎨 BADGE CUSTOMIZATION VARIABLES
const badgeConfig = {
  // 📐 Badge dimensions
  width: 300,
  height: 80,
  
  // 🎨 Colors
  backgroundColor: "#0D1117",
  borderColor: "#30363D",
  textColor: "#F0F6FC",
  ratingColor: "#7C3AED",
  
  // 📝 Text styling
  skillFontSize: 16,
  ratingFontSize: 14,
  fontFamily: "Segoe UI, Arial, sans-serif",
  
  // 📐 Layout
  iconSize: 40,
  iconGlowRadius: 15,
  borderRadius: 12,
  borderWidth: 2,
  
  // 💫 Animation
  enableGlow: true,
  enablePulse: true,
  glowIntensity: 10
};

// 🔧 UTILITY FUNCTIONS
function base64EncodeImage(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const extension = path.extname(imagePath).toLowerCase();
    const mimeType = extension === '.png' ? 'image/png' : 'image/jpeg';
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.warn(`⚠️  Could not load image: ${imagePath}`);
    return null;
  }
}

function escapeXml(text) {
  return text.replace(/[<>&'"]/g, function (match) {
    switch (match) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return match;
    }
  });
}

function generateRatingStars(rating, maxRating = 10) {
  const filledStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - filledStars - (halfStar ? 1 : 0);
  
  let stars = '';
  
  // Filled stars
  for (let i = 0; i < filledStars; i++) {
    stars += '★';
  }
  
  // Half star
  if (halfStar) {
    stars += '☆';
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars += '☆';
  }
  
  return stars.substring(0, 5); // Show only 5 stars max for visual appeal
}

// 🎨 BADGE GENERATOR FUNCTION
function generateSkillBadge(skill) {
  const { name, icon, rating, color, glowColor } = skill;
  const config = badgeConfig;
  
  // Load and encode the icon image
  const iconPath = path.join("assets", "skill", "skillInput", icon);
  const base64Icon = base64EncodeImage(iconPath);
  
  if (!base64Icon) {
    console.warn(`⚠️  Skipping ${name} - icon not found`);
    return null;
  }
  
  // Calculate positions for proper layout: Name (left) → Icon (center) → Rating (right)
  const nameX = 20;
  const nameY = config.height / 2 + 5;
  const iconX = (config.width - config.iconSize) / 2;
  const iconY = (config.height - config.iconSize) / 2;
  const ratingX = config.width - 20;
  const ratingY = config.height / 2;
  
  // Generate rating display
  const ratingText = `${rating}/10`;
  const stars = generateRatingStars(rating, 10);
  
  // Create advanced glow and breathing filters
  const glowFilter = config.enableGlow ? `
    <defs>
      <!-- Icon breathing glow filter -->
      <filter id="icon-breathing-glow-${name.replace(/[^a-zA-Z0-9]/g, '')}" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMorphology operator="dilate" radius="2" result="thickened"/>
        <feGaussianBlur stdDeviation="15" in="thickened" result="bigBlur"/>
        <feFlood flood-color="${glowColor}" result="glowColor"/>
        <feComposite in="glowColor" in2="bigBlur" operator="in" result="coloredGlow"/>
        <feMerge>
          <feMergeNode in="coloredGlow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
        <animate attributeName="stdDeviation" values="8;20;8" dur="3s" repeatCount="indefinite"/>
      </filter>
      
      <!-- Border breathing glow filter -->
      <filter id="border-glow-${name.replace(/[^a-zA-Z0-9]/g, '')}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="borderBlur"/>
        <feFlood flood-color="${color}" flood-opacity="0.6" result="borderColor"/>
        <feComposite in="borderColor" in2="borderBlur" operator="in" result="borderGlow"/>
        <feMerge>
          <feMergeNode in="borderGlow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      
      <!-- Text glow filter -->
      <filter id="text-glow-${name.replace(/[^a-zA-Z0-9]/g, '')}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="textBlur"/>
        <feFlood flood-color="${config.textColor}" flood-opacity="0.8" result="textGlow"/>
        <feComposite in="textGlow" in2="textBlur" operator="in" result="glowedText"/>
        <feMerge>
          <feMergeNode in="glowedText"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>` : '<defs></defs>';
  
  // Create professional animations
  const borderAnimation = config.enablePulse ? `
    <animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite"/>
    <animate attributeName="stroke-width" values="2;4;2" dur="4s" repeatCount="indefinite"/>` : '';
  
  const iconAnimation = config.enablePulse ? `
    <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite"/>` : '';
  
  const accentAnimation = config.enablePulse ? `
    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
    <animate attributeName="width" values="4;6;4" dur="2.5s" repeatCount="indefinite"/>` : '';
  
  // Generate the SVG
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" 
     viewBox="0 0 ${config.width} ${config.height}">
  
  ${glowFilter}
  
  <!-- Animated Background with breathing border -->
  <rect x="0" y="0" width="${config.width}" height="${config.height}" 
        rx="${config.borderRadius}" ry="${config.borderRadius}"
        fill="${config.backgroundColor}" 
        stroke="${color}" 
        stroke-width="2"
        stroke-opacity="0.3"
        ${config.enableGlow ? `filter="url(#border-glow-${name.replace(/[^a-zA-Z0-9]/g, '')})"` : ''}>
    ${borderAnimation}
  </rect>
  
  <!-- Skill Name (Left) -->
  <text x="${nameX}" y="${nameY}" 
        style="font-family: ${config.fontFamily}; font-size: ${config.skillFontSize}px; font-weight: bold; 
               fill: ${config.textColor};"
        ${config.enableGlow ? `filter="url(#text-glow-${name.replace(/[^a-zA-Z0-9]/g, '')})"` : ''}>
    ${escapeXml(name)}
  </text>
  
  <!-- Skill Icon (Center) with breathing glow -->
  <g transform="translate(${iconX + config.iconSize/2}, ${iconY + config.iconSize/2})">
    <image x="${-config.iconSize/2}" y="${-config.iconSize/2}" width="${config.iconSize}" height="${config.iconSize}" 
           href="${base64Icon}"
           ${config.enableGlow ? `filter="url(#icon-breathing-glow-${name.replace(/[^a-zA-Z0-9]/g, '')})"` : ''}>
      ${iconAnimation}
    </image>
  </g>
  
  <!-- Rating Text (Right) -->
  <text x="${ratingX}" y="${ratingY - 8}" text-anchor="end"
        style="font-family: ${config.fontFamily}; font-size: ${config.ratingFontSize}px; font-weight: bold; 
               fill: ${config.ratingColor};">
    ${ratingText}
  </text>
  
  <!-- Star Rating (Right, below rating) -->
  <text x="${ratingX}" y="${ratingY + 12}" text-anchor="end"
        style="font-family: ${config.fontFamily}; font-size: 12px; 
               fill: ${color};">
    ${stars}
  </text>
  
  <!-- Animated color accent bar (Left edge) -->
  <rect x="0" y="0" width="4" height="${config.height}" 
        rx="2" ry="2" fill="${color}" opacity="0.5">
    ${accentAnimation}
  </rect>
  
</svg>`;
}

// 🚀 MAIN GENERATOR FUNCTION
function generateIndividualBadges() {
  const outputDir = "assets/skill/skilloutput";
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  let successCount = 0;
  
  skillsConfig.forEach(skill => {
    const svgContent = generateSkillBadge(skill);
    if (svgContent) {
      const fileName = `${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-badge.svg`;
      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, svgContent);
      successCount++;
    }
  });
  
  console.log(`✅ Generated ${successCount} individual skill badges!`);
  console.log(`📁 Location: ${outputDir}/`);
  return successCount;
}

function generateAllSkillSVGs() {
  try {
    console.log("🚀 Generating skill badges...\n");
    
    const successCount = generateIndividualBadges();
    
    console.log(`\n📊 Summary:`);
    console.log(`📝 Skills configured: ${skillsConfig.length}`);
    console.log(`✅ Successfully generated: ${successCount}`);
    console.log(`🎨 Badge size: ${badgeConfig.width}x${badgeConfig.height}px`);
    console.log(`💫 Effects: ${badgeConfig.enableGlow ? 'Glow ✓' : 'Glow ✗'} | ${badgeConfig.enablePulse ? 'Pulse ✓' : 'Pulse ✗'}`);
    console.log(`📐 Layout: Individual badges for flexible assembly`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the generator
generateAllSkillSVGs();