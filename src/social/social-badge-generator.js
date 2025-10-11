const fs = require("fs");
const path = require("path");

// Social platforms configuration: name, input icon filename, brand color, and optional glow/CTA
const socialsConfig = [
  { name: "LinkedIn", icon: "LinkedIn.png", color: "#0A66C2", glowColor: "#0A66C2", cta: "Connect" },
  { name: "Email", icon: "email.png", color: "#EA4335", glowColor: "#EA4335", cta: "Email Me" },
  { name: "Instagram", icon: "instagram.jpeg", color: "#E4405F", glowColor: "#E4405F", cta: "Follow" },
  { name: "Medium", icon: "medium.png", color: "#00AB6C", glowColor: "#00AB6C", cta: "Read" },
  { name: "Reddit", icon: "reddit.png", color: "#FF4500", glowColor: "#FF4500", cta: "Join" },
  { name: "WhatsApp", icon: "whatsapp.png", color: "#25D366", glowColor: "#25D366", cta: "Message" },
  { name: "X", icon: "X.png", color: "#000000", glowColor: "#FFFFFF", cta: "Follow" },
  { name: "YouTube", icon: "YouTube.png", color: "#FF0000", glowColor: "#FF0000", cta: "Subscribe" },
];

const repoRoot = path.resolve(__dirname, "../../");
const paths = {
  inputDir: path.join(repoRoot, "assets", "social", "socialinput"),
  outputDir: path.join(repoRoot, "assets", "social", "socialoutput"),
};

const badgeConfig = {
  width: 300,
  height: 80,
  backgroundColor: "#0D1117",
  borderRadius: 12,
  borderWidth: 2,
  textColor: "#F0F6FC",
  fontFamily: "Segoe UI, Arial, sans-serif",
  labelFontSize: 16,
  ctaFontSize: 13,
  iconSize: 42,
  enableGlow: true,
  enablePulse: true,
};

function base64EncodeImage(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const ext = path.extname(imagePath).toLowerCase();
    const mime = ext === ".png" ? "image/png" : "image/jpeg";
    return `data:${mime};base64,${base64Image}`;
  } catch (err) {
    console.warn(`⚠️  Could not load image: ${imagePath}`);
    return null;
  }
}

function escapeXml(text) {
  return String(text).replace(/[<>&'\"]/g, (m) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  })[m]);
}

function generateSocialBadge(platform) {
  const { name, icon, color, glowColor, cta } = platform;
  const cfg = badgeConfig;

  const iconPath = path.join(paths.inputDir, icon);
  const base64Icon = base64EncodeImage(iconPath);
  if (!base64Icon) return null;

  // Layout
  const nameX = 20;
  const nameY = cfg.height / 2 + 6;
  const iconX = (cfg.width - cfg.iconSize) / 2;
  const iconY = (cfg.height - cfg.iconSize) / 2;
  const ctaX = cfg.width - 20;
  const ctaY = cfg.height / 2 + 5;

  const filterIdSafe = name.replace(/[^a-zA-Z0-9]/g, "");

  const defs = cfg.enableGlow
    ? `
    <defs>
      <filter id="icon-breathing-glow-${filterIdSafe}" x="-100%" y="-100%" width="300%" height="300%">
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

      <filter id="border-glow-${filterIdSafe}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="borderBlur"/>
        <feFlood flood-color="${color}" flood-opacity="0.6" result="borderColor"/>
        <feComposite in="borderColor" in2="borderBlur" operator="in" result="borderGlow"/>
        <feMerge>
          <feMergeNode in="borderGlow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      <filter id="text-glow-${filterIdSafe}" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="textBlur"/>
        <feFlood flood-color="${cfg.textColor}" flood-opacity="0.8" result="textGlow"/>
        <feComposite in="textGlow" in2="textBlur" operator="in" result="glowedText"/>
        <feMerge>
          <feMergeNode in="glowedText"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>`
    : "<defs></defs>";

  const borderAnimation = cfg.enablePulse
    ? `<animate attributeName="stroke-opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite"/>
       <animate attributeName="stroke-width" values="2;4;2" dur="4s" repeatCount="indefinite"/>`
    : "";

  const iconAnimation = cfg.enablePulse
    ? `<animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="3s" repeatCount="indefinite"/>
       <animate attributeName="opacity" values="0.85;1;0.85" dur="3s" repeatCount="indefinite"/>`
    : "";

  const accentAnimation = cfg.enablePulse
    ? `<animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>`
    : "";

  const ctaText = platform.cta || "Connect";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${cfg.width}" height="${cfg.height}" viewBox="0 0 ${cfg.width} ${cfg.height}">
  ${defs}

  <!-- Background with animated border in brand color -->
  <rect x="0" y="0" width="${cfg.width}" height="${cfg.height}" rx="${cfg.borderRadius}" ry="${cfg.borderRadius}"
        fill="${cfg.backgroundColor}" stroke="${color}" stroke-width="${cfg.borderWidth}" stroke-opacity="0.3"
        ${cfg.enableGlow ? `filter="url(#border-glow-${filterIdSafe})"` : ""}>
    ${borderAnimation}
  </rect>

  <!-- Platform Name (Left) -->
  <text x="${nameX}" y="${nameY}" style="font-family:${cfg.fontFamily}; font-size:${cfg.labelFontSize}px; font-weight:700; fill:${cfg.textColor};"
        ${cfg.enableGlow ? `filter="url(#text-glow-${filterIdSafe})"` : ""}>
    ${escapeXml(name)}
  </text>

  <!-- Icon (Center) with breathing glow -->
  <g transform="translate(${iconX + cfg.iconSize/2}, ${iconY + cfg.iconSize/2})">
    <image x="${-cfg.iconSize/2}" y="${-cfg.iconSize/2}" width="${cfg.iconSize}" height="${cfg.iconSize}" href="${base64Icon}"
           ${cfg.enableGlow ? `filter="url(#icon-breathing-glow-${filterIdSafe})"` : ""}>
      ${iconAnimation}
    </image>
  </g>

  <!-- CTA (Right) -->
  <text x="${ctaX}" y="${ctaY}" text-anchor="end" style="font-family:${cfg.fontFamily}; font-size:${cfg.ctaFontSize}px; font-weight:600; fill:${color}; opacity:0.9;">
    ${escapeXml(ctaText)}
  </text>

  <!-- Animated accent bar (Left edge) -->
  <rect x="0" y="0" width="4" height="${cfg.height}" rx="2" ry="2" fill="${color}" opacity="0.6">
    ${accentAnimation}
  </rect>
</svg>`;
}

function generateSocialBadges() {
  // Ensure output directory exists
  if (!fs.existsSync(paths.outputDir)) {
    fs.mkdirSync(paths.outputDir, { recursive: true });
  }

  // Only include socials whose icon files exist in the input directory
  const available = socialsConfig.filter((s) => fs.existsSync(path.join(paths.inputDir, s.icon)));

  let count = 0;
  for (const s of available) {
    const svg = generateSocialBadge(s);
    if (!svg) continue;

    const filename = `${s.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-social-badge.svg`;
    const outPath = path.join(paths.outputDir, filename);
    fs.writeFileSync(outPath, svg);
    count++;
  }

  console.log(`✅ Generated ${count} social badges.`);
  console.log(`📁 Output: ${paths.outputDir}`);
  return count;
}

function main() {
  try {
  console.log("🚀 Generating social badges...\n");
  console.log(`🔎 Input: ${paths.inputDir}`);
  console.log(`🧭 CWD:   ${process.cwd()}`);
  console.log(`📄 Script: ${__filename}`);
    const n = generateSocialBadges();
    console.log("\n📊 Summary:");
    console.log(`Configured: ${socialsConfig.length}`);
    console.log(`Generated:  ${n}`);
    console.log(`Badge size: ${badgeConfig.width}x${badgeConfig.height}px`);
  } catch (e) {
    console.error("❌ Error:", e.message);
    process.exitCode = 1;
  }
}

main();
