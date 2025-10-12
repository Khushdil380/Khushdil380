import os
import json
from typing import Dict

TEMPLATE = """
<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}' viewBox='0 0 {w} {h}' style='background:#0b1020'>
  <style>
    .title {{ fill:#e6edf3; font: 600 18px "Segoe UI", Arial, sans-serif; }}
    .label {{ fill:#a9b1d6; font: 12px "Segoe UI", Arial, sans-serif; }}
    .value {{ fill:#e6edf3; font: 14px "Segoe UI", Arial, sans-serif; }}
  </style>
  <text x='{cx}' y='22' text-anchor='middle' class='title'>{platform}</text>
  {rows}
</svg>
"""

ROW = "<text x='20' y='{y}' class='label'>{label}</text><text x='{vx}' y='{y}' class='value' text-anchor='end'>{value}</text>"


def render_platform_card(platform: str, data: Dict, width=360) -> str:
    rows = []
    y = 48
    vx = width - 20
    if platform == "LeetCode":
        rows.append(ROW.format(y=y, vx=vx, label="Total Solved", value=data.get("total", 0))); y += 24
        rows.append(ROW.format(y=y, vx=vx, label="Easy/Med/Hard", value=f"{data.get('easy',0)}/{data.get('medium',0)}/{data.get('hard',0)}")); y += 24
        rows.append(ROW.format(y=y, vx=vx, label="Ranking", value=data.get("ranking", "-"))); y += 24
    elif platform == "GeeksForGeeks":
        rows.append(ROW.format(y=y, vx=vx, label="Problems Solved", value=data.get("total", 0))); y += 24
        rows.append(ROW.format(y=y, vx=vx, label="School/Basic/Medium", value=f"{data.get('easy',0)}/{data.get('medium',0)}/{data.get('hard',0)}")); y += 24
        rows.append(ROW.format(y=y, vx=vx, label="Rank", value=data.get("ranking", "-"))); y += 24
    elif platform == "Codeforces":
        rows.append(ROW.format(y=y, vx=vx, label="Rating (max)", value=f"{data.get('rating','-')} ({data.get('maxRating','-')})")); y += 24
        rows.append(ROW.format(y=y, vx=vx, label="Rank (max)", value=f"{data.get('rank','-')} ({data.get('maxRank','-')})")); y += 24
        rows.append(ROW.format(y=y, vx=vx, label="Latest Submission ID", value=data.get('totalSubmissions','-'))); y += 24
    height = y + 16
    svg = TEMPLATE.format(w=width, h=height, cx=width//2, platform=platform, rows="\n  ".join(rows))
    return svg


def main():
    assets_dir = os.path.join(os.path.dirname(__file__), "..", "..", "assets", "coding-platform")
    with open(os.path.join(assets_dir, "stats.json"), "r", encoding="utf-8") as f:
        stats = json.load(f)

    os.makedirs(assets_dir, exist_ok=True)
    # Render three cards
    with open(os.path.join(assets_dir, "leetcode.svg"), "w", encoding="utf-8") as f:
        f.write(render_platform_card("LeetCode", stats.get("leetcode", {})))
    with open(os.path.join(assets_dir, "gfg.svg"), "w", encoding="utf-8") as f:
        f.write(render_platform_card("GeeksForGeeks", stats.get("gfg", {})))
    with open(os.path.join(assets_dir, "codeforces.svg"), "w", encoding="utf-8") as f:
        f.write(render_platform_card("Codeforces", stats.get("codeforces", {})))


if __name__ == "__main__":
    main()
