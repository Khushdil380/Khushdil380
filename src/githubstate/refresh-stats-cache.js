// Appends/updates a version query parameter (?v=YYYYMMDD) to known stats image URLs
// to encourage GitHub's CDN to fetch fresh images daily.

const fs = require('fs');
const path = require('path');

const targets = [
  'github-readme-stats.vercel.app/api',
  'streak-stats.demolab.com',
  'github-readme-stats.vercel.app/api/top-langs',
  'github-profile-trophy.vercel.app',
  'github-readme-activity-graph.vercel.app/graph'
];

function addOrUpdateV(urlStr, v) {
  try {
    const u = new URL(urlStr);
    u.searchParams.set('v', v);
    return u.toString();
  } catch (_) {
    return urlStr; // leave unchanged if parsing fails
  }
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function refreshReadme(file) {
  const content = fs.readFileSync(file, 'utf8');
  const today = new Date();
  const v = today.toISOString().slice(0,10).replace(/-/g, ''); // YYYYMMDD

  let updated = content;

  // Replace every markdown/image src that matches targets using safe matching
  targets.forEach(host => {
    const rxHost = escapeRegExp(host);
    const regex = new RegExp(`https://[^\s"']*${rxHost}[^\s"']*`, 'g');
    updated = updated.replace(regex, (match) => addOrUpdateV(match, v));
  });

  if (updated !== content) {
    fs.writeFileSync(file, updated);
    console.log('README cache-busting params refreshed.');
    return true;
  }
  console.log('No cache-busting changes needed.');
  return false;
}

function main() {
  const repoRoot = path.resolve(__dirname, '../../');
  const readme = path.join(repoRoot, 'README.md');
  refreshReadme(readme);
}

main();
