import os
import sys
import json
from typing import Dict, List

# Ensure imports work when running as a script from repo root
SCRIPT_DIR = os.path.dirname(__file__)
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from utils import MONTH_NAMES, day_color, layout_constants, days_in_month, current_year

SVG_HEADER = """<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}' viewBox='0 0 {w} {h}' style='background:#0b1020'>"""
SVG_FOOTER = "</svg>"
TEXT_STYLE = "fill:#e6edf3;font-family:Segoe UI, Arial, sans-serif;"


def render_text(x: int, y: int, text: str, size: int = 16, anchor: str = "start") -> str:
    return f"<text x='{x}' y='{y}' font-size='{size}' text-anchor='{anchor}' style='{TEXT_STYLE}'>{text}</text>"


def render_circle(cx: int, cy: int, r: int, fill: str) -> str:
    return f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='{fill}'/>"


def generate_svg(data: Dict) -> str:
    w, h, r, gap, m = layout_constants()
    parts: List[str] = [SVG_HEADER.format(w=w, h=h)]

    # Title
    parts.append(render_text(w // 2, 32, f"{data.get('login','')} GitHub Contribution", 26, anchor="middle"))

    # Labels: months (left column) and days (top)
    start_x = m + 96   # left space for month names
    start_y = m + 28   # top space for day labels

    # Top day numbers 1..31
    for d in range(1, 32):
        parts.append(render_text(start_x + (d - 1) * (2 * r + gap), start_y - 10, str(d), 12, anchor="middle"))

    # Left month names
    for mi, mname in enumerate(MONTH_NAMES):
        parts.append(render_text(m, start_y + mi * (2 * r + gap), mname[:3], 13))

    # Grid of circles per month/day
    for mi, mname in enumerate(MONTH_NAMES):
        commits = data["months"].get(mname, {}).get("commits", [])
        days = days_in_month(data["year"], mi + 1)
        for di in range(31):
            cx = start_x + di * (2 * r + gap)
            cy = start_y + mi * (2 * r + gap)
            if di < days:
                c = commits[di] if di < len(commits) else 0
                col = day_color(int(c))
            else:
                col = "#1b2238"  # blank area for days not in month
            parts.append(render_circle(cx, cy, r, col))

    # Right side stats aligned to grid width
    grid_width = 31 * (2 * r + gap) - gap
    right_x = start_x + grid_width + 30
    for mi, mname in enumerate(MONTH_NAMES):
        month = data["months"].get(mname, {})
        total = month.get("total", 0)
        issues = month.get("issues", 0)
        y = start_y + mi * (2 * r + gap)
        parts.append(render_text(right_x, y, f"{total}", 14, anchor="end"))
        parts.append(render_text(right_x + 20, y, f"{issues}", 14))
        # Trophy emoji if earned (self-contained, no external refs)
        if total >= 50:
            parts.append(f"<text x='{right_x + 52}' y='{y+5}' font-size='16'>🏆</text>")

    # Column headers for right-side stats
    # Header labels for right columns (text only to keep SVG standalone)
    parts.append(render_text(right_x - 6, start_y - 10, "Commits", 12, anchor="end"))
    parts.append(render_text(right_x + 20, start_y - 10, "Issues", 12))

    parts.append(SVG_FOOTER)
    return "\n".join(parts)


def main():
    year = int(os.environ.get("YEAR", current_year()))
    login = os.environ.get("GH_LOGIN", "Khushdil380")
    json_path = os.environ.get("IN_JSON", os.path.join(os.path.dirname(__file__), "contrib.json"))
    out_svg = os.environ.get("OUT_SVG", os.path.join(os.path.dirname(__file__), "..", "..", "assets", "contributiongraph", "contrib_graph.svg"))

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    data["login"] = login

    svg = generate_svg(data)
    os.makedirs(os.path.dirname(out_svg), exist_ok=True)
    with open(out_svg, "w", encoding="utf-8") as f:
        f.write(svg)


if __name__ == "__main__":
    main()
