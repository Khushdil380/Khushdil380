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
    # SVG size and cell geometry (tuned to better fill space)
    width, height = 1280, 420
    cell_r = 9   # slightly larger circles
    cell_gap = 8  # a bit tighter gaps
    margin = 36   # reduced margins
    return width, height, cell_r, cell_gap, margin
