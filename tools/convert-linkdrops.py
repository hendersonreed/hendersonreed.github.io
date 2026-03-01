#!/bin/env python3
"""One-time migration script: parse linkdrop blog posts into src/linkblog/links.json.

Run from the repo root:
    ./tools/convert-linkdrops.py
"""

import glob
import json
import os
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
POSTS_GLOB = str(REPO_ROOT / "src" / "posts" / "*linkdrop*.md")
OUTPUT_PATH = REPO_ROOT / "src" / "links" / "links.json"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Matches the published/updated date inside a div
DATE_RE = re.compile(
    r'<div\s+class="published-slug">\s*(?:published|updated):\s*(\d{4}-\d{2}-\d{2})\s*</div>'
)

# Heading link:  ### [Title](url)  or  ## [Title](url)
HEADING_LINK_RE = re.compile(r'^#{2,6}\s+\[(.+?)\]\((.+?)\)\s*$')

# Any heading line
HEADING_RE = re.compile(r'^#{1,6}\s+')

# List-item link:  - [Title](url)  possibly followed by more text
LIST_LINK_RE = re.compile(r'^\s*[-*]\s+\[(.+?)\]\((.+?)\)(.*)')


def extract_date(text: str) -> str:
    """Return the LAST published/updated date found in the file."""
    dates = DATE_RE.findall(text)
    if not dates:
        raise ValueError("No date found")
    return dates[-1]


def strip_markdown_link(md: str) -> str:
    """Convert [text](url) to just text, for display purposes."""
    return re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', md)


def parse_file(filepath: str) -> list[dict]:
    """Parse a single linkdrop markdown file and return a list of link dicts."""
    text = Path(filepath).read_text(encoding="utf-8")
    date = extract_date(text)
    lines = text.splitlines()

    links: list[dict] = []
    i = 0
    while i < len(lines):
        line = lines[i]

        # --- FORMAT A: heading links like ### [Title](url) ---
        m_heading = HEADING_LINK_RE.match(line)
        if m_heading:
            title = m_heading.group(1)
            url = m_heading.group(2)
            # Collect commentary paragraphs until next heading or end
            commentary_parts = []
            i += 1
            while i < len(lines):
                if HEADING_RE.match(lines[i]):
                    break
                commentary_parts.append(lines[i])
                i += 1
            commentary = "\n".join(commentary_parts).strip()
            entry = {"url": url, "title": title, "date": date}
            if commentary:
                entry["commentary"] = commentary
            links.append(entry)
            continue

        # --- FORMATS B/C/D: list-item links ---
        m_list = LIST_LINK_RE.match(line)
        if m_list:
            title = m_list.group(1)
            url = m_list.group(2)
            rest = m_list.group(3).strip()

            # Check if there are additional links on the same line (FORMAT C multi-link)
            # e.g.: - ["You should use /tmp/ more"](url1) and [comments](url2)
            full_line_text = re.sub(r'^\s*[-*]\s+', '', line).strip()
            extra_links = re.findall(r'\[.+?\]\(.+?\)', full_line_text)
            if len(extra_links) > 1:
                # Use first link's URL, whole line as title
                title = strip_markdown_link(full_line_text)

            # Determine commentary from trailing text
            commentary = ""
            if rest:
                # Strip leading connectors like " and [other link](url)" that
                # are part of the multi-link title, not commentary.
                # Commentary typically starts with " - " or similar separator.
                if len(extra_links) > 1:
                    # For multi-link lines, don't treat the rest as commentary
                    # unless there's a clear separator after all links.
                    # Check if there's text after the last link on the line.
                    last_link_end = full_line_text.rfind(')')
                    after_links = full_line_text[last_link_end + 1:].strip() if last_link_end >= 0 else ""
                    if after_links:
                        commentary = after_links.lstrip('- ').strip()
                else:
                    # Single link with trailing text
                    commentary = rest.lstrip('- ').strip()

            entry = {"url": url, "title": title, "date": date}
            if commentary:
                entry["commentary"] = commentary
            links.append(entry)
            i += 1
            continue

        i += 1

    return links


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    files = sorted(glob.glob(POSTS_GLOB))
    if not files:
        print(f"No linkdrop files found matching {POSTS_GLOB}", file=sys.stderr)
        sys.exit(1)

    all_links: list[dict] = []
    for f in files:
        print(f"Parsing {os.path.relpath(f, REPO_ROOT)} ...")
        parsed = parse_file(f)
        print(f"  → {len(parsed)} links")
        all_links.extend(parsed)

    # Merge with existing links.json if it exists (deduplicate by URL)
    existing: list[dict] = []
    if OUTPUT_PATH.exists():
        with open(OUTPUT_PATH, "r", encoding="utf-8") as fh:
            existing = json.load(fh)
        print(f"Loaded {len(existing)} existing links from {OUTPUT_PATH.relative_to(REPO_ROOT)}")

    # Build url -> entry map; existing entries take precedence
    by_url: dict[str, dict] = {}
    for entry in all_links:
        by_url[entry["url"]] = entry
    for entry in existing:
        by_url[entry["url"]] = entry  # existing wins on conflict

    merged = list(by_url.values())

    # Sort by date descending
    merged.sort(key=lambda e: e.get("date", ""), reverse=True)

    # Write output
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(merged, fh, indent=2, ensure_ascii=False)
        fh.write("\n")

    print(f"\nWrote {len(merged)} links to {OUTPUT_PATH.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
