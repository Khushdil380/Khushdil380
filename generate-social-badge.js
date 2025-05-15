const fs = require("fs");
const path = require("path");

const socials = [
  {
    label: "LinkedIn",
    iconPath: "assets/LinkedIn.png",
    url: "https://www.linkedin.com/in/khushdil-ansari/",
    output: "assets/LinkedIn-social-badge.svg",
    color: "#0077B5"
  },
  
];

function toBase64(filePath) {
  const ext = path.extname(filePath).slice(1);
  const base64 = fs.readFileSync(filePath).toString("base64");
  return `data:image/${ext};base64,${base64}`;
}

function generateSVG({ label, iconPath, url, color }) {
  const base64Icon = toBase64(iconPath);
  const width = 220;
  const height = 50;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <linearGradient id="socialGradient" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color}" />
      <stop offset="100%" stop-color="#222" />
    </linearGradient>
    <filter id="socialShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${color}" flood-opacity="0.7"/>
    </filter>
  </defs>
  <style>
    .badge-bg {
      fill: url(#socialGradient);
      rx: 25;
      filter: url(#socialShadow);
      transition: filter 0.3s;
    }
    .icon {
      filter: drop-shadow(0 0 6px ${color});
    }
    .label {
      fill: #fff;
      font-size: 16px;
      font-family: 'Segoe UI', Verdana, sans-serif;
      font-weight: bold;
      dominant-baseline: middle;
      text-anchor: start;
      letter-spacing: 1px;
    }
    .badge-bg:hover {
      filter: url(#socialShadow) brightness(1.2);
    }
  </style>
  <a href="${url}" target="_blank">
    <rect x="0" y="0" width="${width}" height="${height}" rx="25" class="badge-bg"/>
    <image href="${base64Icon}" x="18" y="10" width="30" height="30" class="icon"/>
    <text x="60" y="28" class="label">${label}</text>
  </a>
</svg>
`;
}

socials.forEach((social) => {
  const svg = generateSVG(social);
  fs.writeFileSync(social.output, svg);
  console.log(`✅ Created: ${social.output}`);
});