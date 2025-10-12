import os
import json
import requests
from datetime import datetime
from dateutil.relativedelta import relativedelta

GITHUB_API = "https://api.github.com/graphql"

# Fetch commit contributions over a year window
QUERY = """
query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
                weeks { contributionDays { date contributionCount } }
            }
            totalCommitContributions
        }
    }
}
"""

# Get monthly issues created by the user using GraphQL search
# We count issues (not PRs) created within [from..to-1day]
SEARCH_ISSUES = """
query($q: String!) {
    search(query: $q, type: ISSUE) { issueCount }
}
"""


def fetch_year_data(login: str, token: str, year: int):
    from_dt = datetime(year, 1, 1)
    to_dt = datetime(year + 1, 1, 1)
    variables = {
        "login": login,
        "from": from_dt.isoformat() + "Z",
        "to": to_dt.isoformat() + "Z",
    }

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    resp = requests.post(GITHUB_API, json={"query": QUERY, "variables": variables}, headers=headers)
    resp.raise_for_status()
    data = resp.json()
    if "errors" in data:
        raise RuntimeError(f"GraphQL errors: {data['errors']}")

    weeks = data["data"]["user"]["contributionsCollection"]["contributionCalendar"]["weeks"]
    # Flatten days into a dict by date
    daily = {}
    for w in weeks:
        for d in w["contributionDays"]:
            daily[d["date"]] = d["contributionCount"]

    # Compute monthly totals and arrays
    out = {"year": year, "months": {}}
    cur = from_dt
    while cur < to_dt:
        month_name = cur.strftime("%B")
        days = (cur + relativedelta(months=1) - cur).days
        commits = []
        total = 0
        for i in range(days):
            day = cur + relativedelta(days=i)
            key = day.strftime("%Y-%m-%d")
            c = int(daily.get(key, 0))
            commits.append(c)
            total += c
        # Monthly issues count (all issues created by the user within the month, PRs excluded)
        month_from = cur
        month_to = cur + relativedelta(months=1) - relativedelta(days=1)
        q = (
            f"author:{login} is:issue created:{month_from.strftime('%Y-%m-%d')}..{month_to.strftime('%Y-%m-%d')}"
        )
        resp_m = requests.post(GITHUB_API, json={"query": SEARCH_ISSUES, "variables": {"q": q}}, headers=headers)
        resp_m.raise_for_status()
        data_m = resp_m.json()
        if "errors" in data_m:
            raise RuntimeError(f"GraphQL errors: {data_m['errors']}")
        issues_count = int(data_m["data"]["search"]["issueCount"]) if data_m.get("data") else 0

        out["months"][month_name] = {"commits": commits, "issues": int(issues_count), "total": int(total)}
        cur = cur + relativedelta(months=1)

    return out


def main():
    login = os.environ.get("GH_LOGIN", "Khushdil380")
    token = os.environ.get("GH_TOKEN")
    year = int(os.environ.get("YEAR", datetime.now().year))
    out_path = os.environ.get("OUT_JSON", os.path.join(os.path.dirname(__file__), "contrib.json"))

    if not token:
        raise SystemExit("Missing GH_TOKEN env var")

    data = fetch_year_data(login, token, year)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
