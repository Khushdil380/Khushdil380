import requests
from datetime import datetime
import os

USERNAME = "Khushdil380"
API_URL = f"https://leetcode-stats-api.herokuapp.com/{USERNAME}"
ASSETS_DIR = "assets"

def fetch_leetcode_data():
    res = requests.get(API_URL)
    if res.status_code == 200:
        return res.json()
    else:
        raise Exception("Failed to fetch LeetCode data.")

def create_svg_badge(label, value, color, filename, animate=True):
    gradient_id = "grad1"
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="220" height="40">
      <defs>
        <linearGradient id="{gradient_id}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="{color}">
            <animate attributeName="stop-color" values="{color};#22223b;{color}" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stop-color="#22223b">
            <animate attributeName="stop-color" values="#22223b;{color};#22223b" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect rx="8" width="220" height="40" fill="url(#{gradient_id})" />
      <text x="50%" y="50%" font-size="16" font-family="Verdana" fill="#fff" opacity="0"
        text-anchor="middle" dominant-baseline="middle">
        {label}: <tspan font-weight="bold">{value}</tspan>
        <animate attributeName="opacity" from="0" to="1" dur="0.8s" fill="freeze" />
      </text>
    </svg>
    '''
    with open(os.path.join(ASSETS_DIR, filename), "w", encoding="utf-8") as f:
        f.write(svg)

def create_recent_submissions_svg(submissions, filename, animate=True, limit=5):
    # SVG for recent submissions with fade-in effect
    lines = []
    for i, sub in enumerate(submissions[:limit]):
        title = sub.get("title", "Unknown")
        lang = sub.get("lang", "N/A")
        timestamp = sub.get("timestamp", 0)
        date_str = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
        y = 25 + i * 20
        delay = 0.3 + i * 0.2
        lines.append(f'''
        <text x="20" y="{y}" font-size="13" font-family="Verdana" fill="#fff" opacity="0">
            {title} ({lang}) on {date_str}
            <animate attributeName="opacity" from="0" to="1" dur="0.7s" begin="{delay}s" fill="freeze" />
        </text>
        ''')
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="420" height="{40 + 20*limit}">
      <rect rx="8" width="420" height="{40 + 20*limit}" fill="#22223b" />
      <text x="20" y="20" font-size="16" font-family="Verdana" fill="#f2e9e4">Recent Submissions</text>
      {''.join(lines)}
    </svg>
    '''
    with open(os.path.join(ASSETS_DIR, filename), "w", encoding="utf-8") as f:
        f.write(svg)

def main():
    if not os.path.exists(ASSETS_DIR):
        os.makedirs(ASSETS_DIR)
    data = fetch_leetcode_data()
    total = data["totalSolved"]
    easy = data["easySolved"]
    medium = data["mediumSolved"]
    hard = data["hardSolved"]
    recent = data.get("recentSubmissions", [])

    # Animated SVG badges
    create_svg_badge("Total Solved", total, "#4CAF50", "total_solved.svg")
    create_svg_badge("Easy", easy, "#8BC34A", "easy.svg")
    create_svg_badge("Medium", medium, "#FFC107", "medium.svg")
    create_svg_badge("Hard", hard, "#F44336", "hard.svg")
    create_recent_submissions_svg(recent, "recent_submissions.svg")

if __name__ == "__main__":
    main()