from datetime import datetime
from calendar import monthrange
from typing import List, Tuple, Dict, Any
from copy import deepcopy

# Color ramp from low to high activity
COLOR_STEPS = ["#9be9a8", "#40c463", "#30a14e", "#216e39"]
BASE_COLOR = "#808080"

MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

def current_year() -> int:
    return datetime.now().year

def days_in_month(year: int, month_index_1_based: int) -> int:
    return monthrange(year, month_index_1_based)[1]

def day_color(commit_count: int) -> str:
    if commit_count <= 0:
        return BASE_COLOR
    # Map density to 4 buckets; tune thresholds as desired
    if commit_count >= 15:
        return COLOR_STEPS[3]
    if commit_count >= 7:
        return COLOR_STEPS[2]
    if commit_count >= 3:
        return COLOR_STEPS[1]
    return COLOR_STEPS[0]

def layout_constants() -> Tuple[int, int, int, int, int]:
    # Backward-compatible constants (used if config not consumed)
    width, height = 1280, 380
    cell_r = 9    # circle radius
    cell_gap = 8  # gap between circles
    margin = 28   # general margin
    return width, height, cell_r, cell_gap, margin

# Default layout configuration (edit here to tweak the graph)
# Sections overview:
# - canvas: overall SVG size and background
# - text:   global text style
# - title:  heading position and size
# - grid:   where the month/day grid starts (moves whole grid)
# - cells:  circle size and spacing
# - monthLabels: left-side month abbreviations position/size
# - dayLabels:   top day numbers position/size
# - rightPanel:  stats columns at the right (spacing and font sizes)
# - colors:  cell colors for 0-activity (base) and 4 activity steps
# - trophy:  monthly commits threshold to show 🏆
DEFAULT_CONFIG: Dict[str, Any] = {
    # Overall SVG
    "canvas": {"width": 1120, "height": "auto", "background": "#0b1020"},
    # Global text defaults
    "text": {"color": "#e6edf3", "fontFamily": "Segoe UI, Arial, sans-serif"},
    # Main title (above the chart)
    "title": {"y": 28, "fontSize": 24},  
    # Grid anchor (moves all circles and labels)
    # Keep 20px between title baseline and day numbers baseline.
    # Formula: startY = title.y + 20 - offsetY  (offsetY is negative)
    # With title.y=28 and offsetY=-20 => startY = 28 + 20 - (-20) = 68
    "grid": {"startX": 120, "startY": 68},
    # Day cells geometry
    "cells": {"radius": 10, "gap": 8},
    # Month labels at left
    "monthLabels": {"x": 50, "fontSize": 12},
    # Day numbers at top
    # 10px gap from day numbers baseline to circle TOP:
    # offsetY = -(radius + 10) => -(10 + 10) = -20
    "dayLabels": {"fontSize": 11, "offsetY": -20},
    # Right-side stats panel
    "rightPanel": {
    # Effective visual gap from grid right circle edge to the commits text
    # (anchored 'end') is approximately: radius + gapFromGrid.
    # For desired ~60px with radius=10 => gapFromGrid = 50
    "gapFromGrid": 50,
        "commitsFontSize": 14,
        "issuesFontSize": 14,
        "headerFontSize": 11,
        "trophyOffsetX": 44,
        "trophyFontSize": 16
    },
    # Colors for cells
    "colors": {
        "base": BASE_COLOR,
        "steps": COLOR_STEPS
    },
    # Trophy logic
    "trophy": {"threshold": 50}
}

def get_layout_config() -> Dict[str, Any]:
    # Return a deep copy so callers can't accidentally mutate defaults
    return deepcopy(DEFAULT_CONFIG)
