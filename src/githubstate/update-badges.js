// Updates snapshot badges in README for commits and contributions using GitHub GraphQL API
// Badges expected in README (numbers will be replaced):
// - https://img.shields.io/badge/commits-<num>-blue?style=for-the-badge
// - https://img.shields.io/badge/contributions-<num>-blueviolet?style=for-the-badge

const fs = require('fs');
const path = require('path');

const GITHUB_API = 'https://api.github.com/graphql';

async function fetchStats(token, login) {
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          totalCommitContributions
          contributionCalendar { totalContributions }
        }
      }
    }
  `;

  const res = await fetch(GITHUB_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${token}`,
      'Accept': 'application/vnd.github+json'
    },
    body: JSON.stringify({ query, variables: { login } })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(`GitHub API errors: ${JSON.stringify(json.errors)}`);
  }

  const data = json.data.user.contributionsCollection;
  const commits = data.totalCommitContributions || 0;
  const contributions = (data.contributionCalendar && data.contributionCalendar.totalContributions) || commits;
  return { commits, contributions };
}

function updateReadmeNumbers(readmePath, stats) {
  const original = fs.readFileSync(readmePath, 'utf8');

  const commitRegex = /(img\.shields\.io\/badge\/commits-)(\d+)(-blue\?style=for-the-badge)/g;
  const contribRegex = /(img\.shields\.io\/badge\/contributions-)(\d+)(-blueviolet\?style=for-the-badge)/g;

  let updated = original.replace(commitRegex, `$1${stats.commits}$3`);
  updated = updated.replace(contribRegex, `$1${stats.contributions}$3`);

  const changed = updated !== original;
  if (changed) {
    fs.writeFileSync(readmePath, updated);
  }
  return changed;
}

async function main() {
  try {
    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    const login = process.env.USER_LOGIN || (process.env.GITHUB_REPOSITORY || '').split('/')[0];
    if (!token) throw new Error('GITHUB_TOKEN is required');
    if (!login) throw new Error('USER_LOGIN or GITHUB_REPOSITORY must be set');

    console.log(`Fetching stats for ${login} ...`);
    const stats = await fetchStats(token, login);
    console.log(`Stats → commits: ${stats.commits}, contributions: ${stats.contributions}`);

    const repoRoot = path.resolve(__dirname, '../../');
    const readmePath = path.join(repoRoot, 'README.md');
    const changed = updateReadmeNumbers(readmePath, stats);
    console.log(changed ? 'README updated with fresh badge numbers.' : 'No changes to README needed.');
  } catch (err) {
    console.error('Update failed:', err.message);
    process.exitCode = 1;
  }
}

main();
