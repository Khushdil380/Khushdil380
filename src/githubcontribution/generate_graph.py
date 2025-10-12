import os
import sys
import json
from typing import Dict, List

# Ensure imports work when running as a script from repo root
SCRIPT_DIR = os.path.dirname(__file__)
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from utils import (
    MONTH_NAMES,
    day_color,
    layout_constants,
    days_in_month,
    current_year,
    get_layout_config,
    COLOR_STEPS,
    BASE_COLOR,
)

SVG_HEADER = """<svg xmlns='http://www.w3.org/2000/svg' width='{w}' height='{h}' viewBox='0 0 {w} {h}' style='background:{bg}'>"""
SVG_FOOTER = "</svg>"
TEXT_STYLE = "fill:#e6edf3;font-family:Segoe UI, Arial, sans-serif;"


def render_text(x: int, y: int, text: str, size: int = 16, anchor: str = "start") -> str:
    return f"<text x='{x}' y='{y}' font-size='{size}' text-anchor='{anchor}' style='{TEXT_STYLE}'>{text}</text>"


def render_circle(cx: int, cy: int, r: int, fill: str) -> str:
    return f"<circle cx='{cx}' cy='{cy}' r='{r}' fill='{fill}'/>"


def generate_svg(data: Dict) -> str:
    # Load config with defaults and optional overrides
    cfg = get_layout_config()
    w_default, h_default, r_default, gap_default, m_default = layout_constants()
    bg = cfg["canvas"]["background"]
    w = int(cfg["canvas"].get("width", w_default))
    # Height may be 'auto' (we compute) or explicit
    h = cfg["canvas"].get("height", h_default)
    r = int(cfg["cells"].get("radius", r_default))
    gap = int(cfg["cells"].get("gap", gap_default))

    # Compute layout first so we can size the SVG to content height
    # StartX/Y relative to canvas margins
    start_x = int(cfg["grid"].get("startX", m_default + 70))
    start_y = int(cfg["grid"].get("startY", m_default + 24))
    grid_width = 31 * (2 * r + gap) - gap
    # Dynamic total height: top offset + 12 rows + bottom margin
    total_height = start_y + (len(MONTH_NAMES) - 1) * (2 * r + gap) + r + m_default
    if isinstance(h, str) and h == "auto":
        h = total_height

    parts: List[str] = [SVG_HEADER.format(w=w, h=h, bg=bg)]

    # Apply text style overrides from config
    global TEXT_STYLE
    TEXT_STYLE = f"fill:{cfg['text'].get('color', '#e6edf3')};font-family:{cfg['text'].get('fontFamily', 'Segoe UI, Arial, sans-serif')};"

    # Title
    title_y = int(cfg["title"].get("y", 28))
    title_size = int(cfg["title"].get("fontSize", 24))
    parts.append(render_text(w // 2, title_y, f"{data.get('login','')} GitHub Contribution", title_size, anchor="middle"))

    # Labels: months (left column) and days (top)

    # Top day numbers 1..31
    day_size = int(cfg["dayLabels"].get("fontSize", 11))
    day_off_y = int(cfg["dayLabels"].get("offsetY", -8))
    for d in range(1, 32):
        parts.append(render_text(start_x + (d - 1) * (2 * r + gap), start_y + day_off_y, str(d), day_size, anchor="middle"))

    # Left month names
    month_x = int(cfg["monthLabels"].get("x", 50))
    month_size = int(cfg["monthLabels"].get("fontSize", 12))
    for mi, mname in enumerate(MONTH_NAMES):
        parts.append(render_text(month_x, start_y + mi * (2 * r + gap), mname[:3], month_size))

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
    panel_gap = int(cfg["rightPanel"].get("gapFromGrid", 16))
    right_x = start_x + grid_width + panel_gap  # bring stats closer to grid
    commits_fs = int(cfg["rightPanel"].get("commitsFontSize", 14))
    issues_fs = int(cfg["rightPanel"].get("issuesFontSize", 14))
    threshold = int(cfg["trophy"].get("threshold", 50))
    trophy_offset_x = int(cfg["rightPanel"].get("trophyOffsetX", 44))
    trophy_fs = int(cfg["rightPanel"].get("trophyFontSize", 16))
    for mi, mname in enumerate(MONTH_NAMES):
        month = data["months"].get(mname, {})
        total = month.get("total", 0)
        issues = month.get("issues", 0)
        y = start_y + mi * (2 * r + gap)
        parts.append(render_text(right_x, y, f"{total}", commits_fs, anchor="end"))
        parts.append(render_text(right_x + 18, y, f"{issues}", issues_fs))
        # Trophy emoji if earned (self-contained, no external refs)
        if total >= threshold:
            parts.append(f"<text x='{right_x + trophy_offset_x}' y='{y+5}' font-size='{trophy_fs}'>🏆</text>")

    # Column headers for right-side stats
    # Header labels for right columns (text only to keep SVG standalone)
    header_fs = int(cfg["rightPanel"].get("headerFontSize", 11))
    # Align header labels baseline with day number labels for a cleaner top row
    y_header = start_y + day_off_y
    parts.append(render_text(right_x - 6, y_header, "Commits", header_fs, anchor="end"))
    parts.append(render_text(right_x + 18, y_header, "Issues", header_fs))

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
