#!/bin/env python3
import argparse
import json
import os
from datetime import date

LINKS_PATH = "src/links/links.json"


def main():
    parser = argparse.ArgumentParser(description="Add a link to the linkblog")
    parser.add_argument("--url", help="URL of the link")
    parser.add_argument("--title", help="Title of the link")
    parser.add_argument("--commentary", default="", help="Commentary (default: empty)")
    parser.add_argument("--date", default=date.today().isoformat(), help="Date in YYYY-MM-DD (default: today)")
    args = parser.parse_args()

    if not args.url:
        args.url = input("URL: ").strip()
        args.title = input("Title: ").strip()
        args.commentary = input("Commentary (enter for none): ").strip()
        d = input(f"Date [{date.today().isoformat()}]: ").strip()
        if d:
            args.date = d

    entry = {
        "url": args.url,
        "title": args.title,
        "commentary": args.commentary,
        "date": args.date,
    }

    os.makedirs(os.path.dirname(LINKS_PATH), exist_ok=True)
    if os.path.exists(LINKS_PATH):
        with open(LINKS_PATH) as f:
            links = json.load(f)
    else:
        links = []

    links.append(entry)
    links.sort(key=lambda x: x["date"], reverse=True)

    with open(LINKS_PATH, "w") as f:
        json.dump(links, f, indent=2)
        f.write("\n")

    print(f"Added: {entry['title']} ({entry['url']})")


if __name__ == "__main__":
    main()
