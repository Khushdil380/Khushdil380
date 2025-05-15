const fs = require("fs");
const path = require("path");

const socials = [
  {
    label: "LinkedIn",
    iconPath: "assets/LinkedIn.png",
    url: "https://www.linkedin.com/in/khushdil-ansari/",
    output: "assets/LinkedIn-social-badge.svg",
    color: "#0077B5",
    color2: "#00CFFF",
    color3: "#222"
  },
  {
    label: "Instagram",
    iconPath: "assets/instagram.jpeg",
    url: "https://www.instagram.com/khushdil_380/",
    output: "assets/Instagram-social-badge.svg",
    color: "#E4405F",
    color2: "#FCAF45",
    color3: "#405DE6"
  },
  {
    label: "Whatsapp",
    iconPath: "assets/whatsapp.png",
    url: "https://wa.link/m74qd4",
    output: "assets/Whatsapp-social-badge.svg",
    color: "#E4405F",
    color2: "#FCAF45",
    color3: "#405DE6"
  },
  {
    label: "Email",
    iconPath: "assets/email.png",
    url: "mailto:khushdilansari345@gmail.com",
    output: "assets/Email-social-badge.svg",
    color: "#E4405F",
    color2: "#FCAF45",
    color3: "#405DE6"
  },
  {
    label: "Github",
    iconPath: "assets/github.png",
    url: "https://github.com/Khushdil380",
    output: "assets/Github-social-badge.svg",
    color: "#E4405F",
    color2: "#FCAF45",
    color3: "#405DE6"
  },
  {
    label: "Medium",
    iconPath: "assets/medium.png",
    url: "https://medium.com/@khushdilansari345",
    output: "assets/Medium-social-badge.svg",
    color: "#242424",
    color2: "rgb(34, 18, 18)",
    color3: "rgb(78, 72, 72)"
  },
  {
    label: "X",
    iconPath: "assets/X.png",
    url: "https://instagram.com/yourprofile",
    output: "assets/X-social-badge.svg",
    color: "#E4405F",
    color2: "#FCAF45",
    color3: "#405DE6"
  },
  {
    label: "Youtube",
    iconPath: "assets/YouTube.png",
    url: "https://instagram.com/yourprofile",
    output: "assets/YouTube-social-badge.svg",
    color: "#FF0033",
    color2: "rgb(179, 68, 90)",
    color3: "rgb(31, 6, 11)"
  },
  {
    label: "Reddit",
    iconPath: "assets/reddit.png",
    url: "https://instagram.com/yourprofile",
    output: "assets/Reddit-social-badge.svg",
    color: "#E4405F",
    color2: "#FCAF45",
    color3: "#405DE6"
  },
];

function toBase64(filePath) {
  const ext = path.extname(filePath).slice(1);
  const base64 = fs.readFileSync(filePath).toString("base64");
  return `data:image/${ext};base64,${base64}`;
}

function generateSVG({ label, iconPath, url, color, color2, color3 }) {
  const base64Icon = toBase64(iconPath);
  const width = 260;
  const height = 60;
  const dividerX = 170;
  const iconSize = 36;
  const iconX = dividerX + ((width - dividerX) - iconSize) / 2;
  const iconY = (height - iconSize) / 2;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="boxGradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${color}">
        <animate attributeName="stop-color" values="${color};${color2};${color3};${color}" dur="6s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" stop-color="${color3}">
        <animate attributeName="stop-color" values="${color3};${color};${color2};${color3}" dur="6s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <filter id="iconGlow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <style>
    .box {
      fill: url(#boxGradient);
      rx: 16;
      stroke: ${color};
      stroke-width: 2;
      filter: drop-shadow(0 0 12px ${color}88);
      animation: boxPulse 4s infinite alternate;
    }
    .divider {
      stroke: #fff8;
      stroke-width: 1.5;
      opacity: 0.5;
    }
    .label {
      fill: #fff;
      font-size: 20px;
      font-family: 'Segoe UI', Verdana, sans-serif;
      font-weight: bold;
      dominant-baseline: middle;
      text-anchor: middle;
      letter-spacing: 1px;
      filter: drop-shadow(0 1px 2px #0008);
      animation: textFade 2s infinite alternate;
    }
    .icon {
      filter: url(#iconGlow) drop-shadow(0 0 10px ${color});
      animation: iconGlow 2.5s infinite alternate;
    }
    @keyframes boxPulse {
      0% { filter: drop-shadow(0 0 12px ${color}88); }
      100% { filter: drop-shadow(0 0 28px ${color}cc); }
    }
    @keyframes iconGlow {
      0% { filter: url(#iconGlow) drop-shadow(0 0 10px ${color}); }
      100% { filter: url(#iconGlow) drop-shadow(0 0 22px ${color}); }
    }
    @keyframes textFade {
      0% { opacity: 1; }
      100% { opacity: 0.85; }
    }
    a:hover .box {
      filter: drop-shadow(0 0 32px ${color});
    }
    a:hover .icon {
      filter: url(#iconGlow) drop-shadow(0 0 32px ${color});
    }
  </style>
  <a href="${url}" target="_blank">
    <rect x="0" y="0" width="${width}" height="${height}" rx="16" class="box"/>
    <line x1="${dividerX}" y1="10" x2="${dividerX}" y2="${height-10}" class="divider"/>
    <text x="${dividerX/2}" y="${height/2}" class="label">${label}</text>
    <image href="${base64Icon}" x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" class="icon"/>
  </a>
</svg>
`;
}

socials.forEach((social) => {
  const svg = generateSVG(social);
  fs.writeFileSync(social.output, svg);
  console.log(`✅ Created: ${social.output}`);
});