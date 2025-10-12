from datetime import datetime
from calendar import monthrange
from typing import List, Tuple

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
    # SVG size and cell geometry
    width, height = 1280, 480
    cell_r = 8  # circle radius
    cell_gap = 10  # gap between circles
    margin = 50
    return width, height, cell_r, cell_gap, margin
