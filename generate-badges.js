const fs = require("fs");
const path = require("path");

const badges = [
  {
    label: "HTML",
    iconPath: "assets/html-5.png",
    proficiency: "8/10",
    output: "assets/HTML-badge.svg",
    glowColor: "#ff6600", // Orange for HTML
  },

  {
    label: "Git",
    iconPath: "assets/git.png",
    proficiency: "7/10",
    output: "assets/Git-badge.svg",
    glowColor: "#F15536", 
  },
  {
    label: "Github",
    iconPath: "assets/github.png",
    proficiency: "4/10",
    output: "assets/Github-badge.svg",
    glowColor: "#252120F2", 
  },

  {
    label: "Python",
    iconPath: "assets/python.png",
    proficiency: "7/10",
    output: "assets/Python-badge.svg",
    glowColor: "#FFD63E", 
  },

  {
    label: "React",
    iconPath: "assets/react.png",
    proficiency: "5/10",
    output: "assets/React-badge.svg",
    glowColor: "#66DBFB", 
  },

  {
    label: "React",
    iconPath: "assets/react.png",
    proficiency: "5/10",
    output: "assets/React-badge.svg",
    glowColor: "#66DBFB", 
  },

  {
    label: "SQL",
    iconPath: "assets/sql.png",
    proficiency: "5/10",
    output: "assets/SQL-badge.svg",
    glowColor: "#D136FF", 
  },


  {
    label: "C",
    iconPath: "assets/letter-c.png",
    proficiency: "9/10",
    output: "assets/C-badge.svg",
    glowColor: "#1758e6", 
  },

  {
    label: "C",
    iconPath: "assets/cpp.png",
    proficiency: "9/10",
    output: "assets/CPP-badge.svg",
    glowColor: "#1758e6", 
  },


  {
    label: "CSS",
    iconPath: "assets/css-3.png",
    proficiency: "7/10",
    output: "assets/CSS-badge.svg",
    glowColor: "#2196f3", // Blue for CSS
  },

  {
    label: "JavaScript",
    iconPath: "assets/js.png",
    proficiency: "5/10",
    output: "assets/js-badge.svg",
    glowColor: "#FFFF00", 
  },
];

function toBase64(filePath) {
  const ext = path.extname(filePath).slice(1);
  const base64 = fs.readFileSync(filePath).toString("base64");
  return `data:image/${ext};base64,${base64}`;
}

function generateSVG({ label, iconPath, proficiency, glowColor }) {
  const base64Icon = toBase64(iconPath);
  const width = 260;
  const height = 60;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="boxGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#222"/>
      <stop offset="100%" stop-color="#111"/>
    </linearGradient>
    <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feOffset dx="0" dy="2" />
      <feGaussianBlur stdDeviation="2" result="offset-blur"/>
      <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
      <feFlood flood-color="#000" flood-opacity="0.5" result="color"/>
      <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
      <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
    </filter>
  </defs>
  <style>
    .box {
      fill: url(#boxGradient);
      stroke: ${glowColor};
      stroke-width: 2.5;
      rx: 15;
      filter: url(#innerShadow) drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 24px ${glowColor});
      animation: pulse 4s infinite cubic-bezier(0.4,0,0.2,1);
    }
    .icon-glow {
      filter: drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 16px ${glowColor});
      animation: iconPulse 4s infinite cubic-bezier(0.4,0,0.2,1);
    }
    .label, .score {
      fill: white;
      font-size: 14px;
      font-family: 'Verdana';
      dominant-baseline: middle;
      text-anchor: middle;
    }
    .label { animation: fadeInLeft 2s ease-out; }
    .score { animation: fadeInRight 2s ease-out; }

    @keyframes pulse {
      0%, 100% {
        filter: url(#innerShadow) drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 24px ${glowColor});
      }
      50% {
        filter: url(#innerShadow) drop-shadow(0 0 32px ${glowColor}) drop-shadow(0 0 48px ${glowColor});
      }
    }
    @keyframes iconPulse {
      0%, 100% {
        filter: drop-shadow(0 0 8px ${glowColor}) drop-shadow(0 0 16px ${glowColor});
      }
      50% {
        filter: drop-shadow(0 0 24px ${glowColor}) drop-shadow(0 0 32px ${glowColor});
      }
    }
    @keyframes fadeInLeft {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(10px); }
      to { opacity: 1; transform: translateX(0); }
    }
  </style>

  <rect x="0" y="0" width="${width}" height="${height}" rx="12" class="box"/>
  <text x="45" y="30" class="label">${label}</text>
  <image href="${base64Icon}" x="110" y="13" width="35" height="35" class="icon-glow"/>
  <text x="210" y="30" class="score">${proficiency}</text>
</svg>
`;
}

badges.forEach((badge) => {
  const svg = generateSVG(badge);
  fs.writeFileSync(badge.output, svg);
  console.log(`✅ Created: ${badge.output}`);
});
