const fs = require("fs");
const path = require("path");

// 🎨 CUSTOMIZATION VARIABLES - Change these to customize your typewriter animation
const config = {
  // ✏️ Your text lines
  lines: [
    "Hello, I'm Khushdil Ansari",
    "Full Stack Developer", 
    "Problem Solver + Tech Enthusiast",
    "Always Learning, Always Growing"
  ],
  
  // ⏱️ Animation speed (in seconds)
  typingSpeed: 0.1,        // Speed of typing each character
  lineDelay: 2,            // Pause at end of each line
  eraseSpeed: 0.05,        // Speed of erasing text
  
  // 🎨 Colors
  textColor: "#62F73A",    // Main text color
  cursorColor: "#62F73A",  // Cursor color
  glowColor: "#62F73A",    // Glow effect color
  
  // 📝 Text style
  fontSize: 28,            // Font size in pixels
  fontFamily: "Fira Code, Consolas, Monaco, monospace",
  
  // 📐 SVG size
  width: 600,              // SVG width
  height: 80,              // SVG height
  
  // 💫 Effects
  enableGlow: true,        // Enable/disable glow effect
  showCursor: true         // Show/hide blinking cursor
};

// 🔧 GENERATOR FUNCTION - Don't modify below this line unless you know what you're doing
function generateTypewriterSVG() {
  // Calculate animation timing
  let totalTime = 0;
  const animationData = [];
  
  config.lines.forEach((line, lineIndex) => {
    const lineData = {
      text: line,
      startTime: totalTime,
      typeEndTime: totalTime + (line.length * config.typingSpeed),
      eraseStartTime: totalTime + (line.length * config.typingSpeed) + config.lineDelay,
      eraseEndTime: totalTime + (line.length * config.typingSpeed) + config.lineDelay + (line.length * config.eraseSpeed)
    };
    animationData.push(lineData);
    totalTime = lineData.eraseEndTime + 1; // 1 second pause between lines
  });
  
  // Add 2 seconds pause before restarting the cycle
  const totalCycleDuration = totalTime + 2;
  
  // Escape XML characters
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
  
  // Generate character animations
  let characterAnimations = '';
  animationData.forEach((lineData, lineIndex) => {
    const { text, startTime, eraseStartTime } = lineData;
    
    text.split('').forEach((char, charIndex) => {
      const charStartTime = startTime + (charIndex * config.typingSpeed);
      const charEraseTime = eraseStartTime + ((text.length - charIndex - 1) * config.eraseSpeed);
      const escapedChar = escapeXml(char);
      const charX = 20 + (charIndex * (config.fontSize * 0.6));
      
      // Create smooth animation sequence for each character
      const showDuration = charEraseTime - charStartTime;
      const cycleDuration = totalCycleDuration;
      
      characterAnimations += `
        <text x="${charX}" y="${config.height / 2 + config.fontSize / 3}" 
              style="font-family: ${config.fontFamily}; font-size: ${config.fontSize}px; font-weight: bold; 
                     fill: ${config.textColor}; opacity: 0;
                     ${config.enableGlow ? `filter: drop-shadow(0 0 8px ${config.glowColor});` : ''}">
          ${escapedChar}
          <animate attributeName="opacity" 
                   values="0;0;1;1;0;0" 
                   dur="${cycleDuration}s"
                   keyTimes="0;${charStartTime/cycleDuration};${(charStartTime + config.typingSpeed)/cycleDuration};${charEraseTime/cycleDuration};${(charEraseTime + config.eraseSpeed)/cycleDuration};1"
                   repeatCount="indefinite"/>
        </text>`;
    });
  });
  
  // Generate cursor animation
  let cursorAnimation = '';
  if (config.showCursor) {
    // Calculate cursor positions throughout the animation cycle
    let cursorKeyframes = [];
    let cursorTimes = [];
    let currentX = 20;
    
    // Start position
    cursorKeyframes.push(currentX);
    cursorTimes.push(0);
    
    animationData.forEach((lineData) => {
      const { text, startTime, eraseStartTime } = lineData;
      
      // Cursor movement during typing
      text.split('').forEach((char, charIndex) => {
        const charStartTime = startTime + (charIndex * config.typingSpeed);
        const nextX = 20 + ((charIndex + 1) * (config.fontSize * 0.6));
        
        cursorKeyframes.push(nextX);
        cursorTimes.push(charStartTime / totalCycleDuration);
      });
      
      // Hold position during line pause
      const finalX = 20 + (text.length * (config.fontSize * 0.6));
      cursorKeyframes.push(finalX);
      cursorTimes.push(eraseStartTime / totalCycleDuration);
      
      // Cursor movement during erasing
      for (let i = text.length - 1; i >= 0; i--) {
        const charEraseTime = eraseStartTime + ((text.length - i - 1) * config.eraseSpeed);
        const nextX = 20 + (i * (config.fontSize * 0.6));
        
        cursorKeyframes.push(nextX);
        cursorTimes.push(charEraseTime / totalCycleDuration);
      }
    });
    
    // Return to start position
    cursorKeyframes.push(20);
    cursorTimes.push(1);
    
    cursorAnimation = `
      <text x="20" y="${config.height / 2 + config.fontSize / 3}" 
            style="font-family: ${config.fontFamily}; font-size: ${config.fontSize}px; font-weight: bold; 
                   fill: ${config.cursorColor};
                   ${config.enableGlow ? `filter: drop-shadow(0 0 8px ${config.cursorColor});` : ''}">
        |
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="translate"
                          values="${cursorKeyframes.map(x => `${x},0`).join(';')}"
                          dur="${totalCycleDuration}s"
                          keyTimes="${cursorTimes.join(';')}"
                          repeatCount="indefinite"/>
      </text>`;
  }
  
  // Generate complete SVG
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${config.width}" height="${config.height}" 
     viewBox="0 0 ${config.width} ${config.height}">
  
  <!-- Animation cycle duration: ${totalCycleDuration.toFixed(1)} seconds -->
  
  ${characterAnimations}
  ${cursorAnimation}
</svg>`;
}

// 🚀 GENERATE AND SAVE SVG
function createTypewriterSVG() {
  try {
    const outputPath = "assets/introduction/typewriter.svg";
    const outputDir = path.dirname(outputPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Generate and save SVG
    const svgContent = generateTypewriterSVG();
    fs.writeFileSync(outputPath, svgContent);
    
    console.log("✅ Typewriter SVG generated successfully!");
    console.log(`📁 Location: ${outputPath}`);
    console.log(`📏 Size: ${config.width}x${config.height}px`);
    console.log(`📝 Lines: ${config.lines.length}`);
    console.log(`🎨 Color: ${config.textColor}`);
    console.log("🔄 Animation: Repeats infinitely");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// Run the generator
createTypewriterSVG();