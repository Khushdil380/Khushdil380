import os
import json
import requests
from datetime import datetime, timedelta

# Simple fetchers for coding platform stats.
# These functions return small dicts with the fields we render.
# If a platform lacks a stable public API, we try a few endpoints and fall back to zeros to avoid failures.

HEADERS = {"User-Agent": "Mozilla/5.0 (stats-bot)"}


def fetch_leetcode(username: str):
    # LeetCode GraphQL endpoint (public)
    url = "https://leetcode.com/graphql"
    query = {
        "query": """
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            submitStats: submitStatsGlobal {
              acSubmissionNum { difficulty count submissions }
            }
            profile { ranking }
          }
        }
        """,
        "variables": {"username": username},
    }
    r = requests.post(url, json=query, headers=HEADERS, timeout=20)
    r.raise_for_status()
    data = r.json()["data"]["matchedUser"]
    totals = {x["difficulty"].lower(): x for x in data["submitStats"]["acSubmissionNum"]}
    return {
        "platform": "LeetCode",
        "username": data["username"],
        "total": totals.get("all", {}).get("count", 0),
        "easy": totals.get("easy", {}).get("count", 0),
        "medium": totals.get("medium", {}).get("count", 0),
        "hard": totals.get("hard", {}).get("count", 0),
        "ranking": data.get("profile", {}).get("ranking"),
        "updated": datetime.utcnow().isoformat() + "Z",
    }


def fetch_gfg(username: str):
    # Try multiple endpoints; GFG APIs are not fully stable.
    endpoints = [
        f"https://www.geeksforgeeks.org/api/v1/user/{username}/",
        f"https://geeksforgeeks.org/api/v1/user/{username}/",
        f"https://practiceapi.geeksforgeeks.org/api/v1/user_stats/{username}/",
        f"https://www.geeksforgeeks.org/api/v1/user_profile/{username}/",
    ]
    j = None
    for url in endpoints:
        try:
            r = requests.get(url, headers=HEADERS, timeout=20)
            if r.status_code == 200:
                j = r.json()
                break
        except Exception:
            continue
    # Map various possible key layouts to our unified fields
    total = (
        (isinstance(j, dict) and (
            j.get("total_problems_solved")
            or j.get("overall_problems_solved")
            or j.get("problems_solved")
            or j.get("coding_score")
        ))
        or 0
    )
    easy = (
        (isinstance(j, dict) and (
            j.get("easy_problems_solved")
            or j.get("school_problems_solved")
            or (j.get("problem_solved", {}).get("easy")) if isinstance(j.get("problem_solved"), dict) else None
        ))
        or 0
    )
    medium = (
        (isinstance(j, dict) and (
            j.get("medium_problems_solved")
            or j.get("basic_problems_solved")
            or (j.get("problem_solved", {}).get("medium")) if isinstance(j.get("problem_solved"), dict) else None
        ))
        or 0
    )
    hard = (
        (isinstance(j, dict) and (
            j.get("hard_problems_solved")
            or (j.get("problem_solved", {}).get("hard")) if isinstance(j.get("problem_solved"), dict) else None
        ))
        or 0
    )
    ranking = (isinstance(j, dict) and (j.get("rank") or j.get("overall_rank"))) or None
    return {
        "platform": "GeeksForGeeks",
        "username": username,
        "total": int(total or 0),
        "easy": int(easy or 0),
        "medium": int(medium or 0),
        "hard": int(hard or 0),
        "ranking": ranking,
        "updated": datetime.utcnow().isoformat() + "Z",
    }


def fetch_codeforces(handle: str):
    # Codeforces official API
    info = requests.get(
        f"https://codeforces.com/api/user.info?handles={handle}", headers=HEADERS, timeout=20
    ).json()
    if info.get("status") != "OK":
        raise RuntimeError("CF user.info failed")
    user = info["result"][0]

    subs = requests.get(
        f"https://codeforces.com/api/user.status?handle={handle}&from=1&count=1",
        headers=HEADERS,
        timeout=20,
    ).json()
    if subs.get("status") != "OK":
        raise RuntimeError("CF user.status failed")

    return {
        "platform": "Codeforces",
        "username": handle,
        "rating": user.get("rating"),
        "maxRating": user.get("maxRating"),
        "rank": user.get("rank"),
        "maxRank": user.get("maxRank"),
        "totalSubmissions": subs.get("result", [])[0]["id"],
        "updated": datetime.utcnow().isoformat() + "Z",
    }


def _safe_fetch(fetch_fn, platform_name: str, username: str, fields_default: dict):
    try:
        return fetch_fn(username)
    except Exception as e:
        # Return zeros but include platform/username and error info
        out = {"platform": platform_name, "username": username, **fields_default}
        out["error"] = str(e)
        out["updated"] = datetime.utcnow().isoformat() + "Z"
        return out


def main():
    # Set your own handles here (or via env in workflow)
    lc_user = os.environ.get("LC_USER", "Khushdil380")  # https://leetcode.com/u/Khushdil380/
    gfg_user = os.environ.get("GFG_USER", "khushdilazqaz")  # https://www.geeksforgeeks.org/user/khushdilazqaz/
    cf_user = os.environ.get("CF_USER", "Khushdil380")  # https://codeforces.com/profile/Khushdil380

    out_dir = os.path.join(os.path.dirname(__file__), "..", "..", "assets", "coding-platform")
    os.makedirs(out_dir, exist_ok=True)

    stats = {
        "leetcode": _safe_fetch(
            fetch_leetcode,
            "LeetCode",
            lc_user,
            {"total": 0, "easy": 0, "medium": 0, "hard": 0, "ranking": None},
        ),
        "gfg": _safe_fetch(
            fetch_gfg,
            "GeeksForGeeks",
            gfg_user,
            {"total": 0, "easy": 0, "medium": 0, "hard": 0, "ranking": None},
        ),
        "codeforces": _safe_fetch(
            fetch_codeforces,
            "Codeforces",
            cf_user,
            {"rating": None, "maxRating": None, "rank": None, "maxRank": None, "totalSubmissions": None},
        ),
    }

    with open(os.path.join(out_dir, "stats.json"), "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
