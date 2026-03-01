#!/bin/env python3
import json
import os
import html
import subprocess
from datetime import datetime
from xml.etree.ElementTree import Element, SubElement, ElementTree, tostring
from xml.dom.minidom import parseString


def md_to_html(text):
    """Convert a markdown string to an HTML fragment via pandoc."""
    result = subprocess.run(
        ["pandoc", "--from", "markdown", "--to", "html"],
        input=text, capture_output=True, text=True
    )
    return result.stdout.strip()


def load_links(path):
    with open(path, "r") as f:
        return json.load(f)


def generate_html(links):
    # Sort by date descending
    links = sorted(links, key=lambda e: e["date"], reverse=True)

    # Group by month
    grouped = []
    current_key = None
    current_items = []
    for link in links:
        dt = datetime.strptime(link["date"], "%Y-%m-%d")
        key = dt.strftime("%B %Y")
        if key != current_key:
            if current_key is not None:
                grouped.append((current_key, current_items))
            current_key = key
            current_items = []
        current_items.append(link)
    if current_key is not None:
        grouped.append((current_key, current_items))

    parts = []
    parts.append('<h1>Linkblog</h1>')
    parts.append('<p>Links I\'ve found interesting, with occasional commentary. <a href="/links/feed.xml">(atom feed)</a></p>')
    parts.append('')

    for month_label, items in grouped:
        parts.append(f'<h2>{month_label}</h2>')
        parts.append('<ul class="linkblog-list">')
        for item in items:
            parts.append('  <li class="linkblog-entry">')
            parts.append(f'    <span class="linkblog-date">{item["date"]}</span>')
            parts.append(f'    <a href="{html.escape(item["url"])}">{html.escape(item["title"])}</a>')
            commentary = item.get("commentary", "")
            if commentary:
                parts.append(f'    <div class="linkblog-commentary">{md_to_html(commentary)}</div>')
            parts.append('  </li>')
        parts.append('</ul>')
        parts.append('')

    return "\n".join(parts)


def generate_feed(links):
    # Sort by date descending, take most recent 50
    links = sorted(links, key=lambda e: e["date"], reverse=True)[:50]

    ATOM_NS = "http://www.w3.org/2005/Atom"
    feed = Element("feed", xmlns=ATOM_NS)

    SubElement(feed, "id").text = "https://henderson.lol/links/"
    SubElement(feed, "title").text = "henderson's log: linkblog"
    SubElement(feed, "link", rel="self", href="https://henderson.lol/links/feed.xml")
    SubElement(feed, "link", rel="alternate", href="https://henderson.lol/links/")

    if links:
        SubElement(feed, "updated").text = links[0]["date"] + "T00:00:00Z"

    author = SubElement(feed, "author")
    SubElement(author, "name").text = "Henderson Reed Hummel"
    SubElement(author, "email").text = "reed.hummel@gmail.com"

    for item in links:
        entry = SubElement(feed, "entry")
        SubElement(entry, "id").text = item["url"]
        SubElement(entry, "title").text = item["title"]
        SubElement(entry, "link", rel="alternate", href=item["url"])
        SubElement(entry, "updated").text = item["date"] + "T00:00:00Z"

        commentary = item.get("commentary", "")
        if commentary:
            content_html = f'{md_to_html(commentary)}<p><a href="{html.escape(item["url"])}">{html.escape(item["url"])}</a></p>'
        else:
            content_html = f'<p><a href="{html.escape(item["url"])}">{html.escape(item["url"])}</a></p>'

        content = SubElement(entry, "content", type="html")
        content.text = content_html

    raw_xml = tostring(feed, encoding="unicode", xml_declaration=False)
    pretty = parseString('<?xml version="1.0" encoding="utf-8"?>\n' + raw_xml).toprettyxml(indent="  ")
    # minidom adds its own xml declaration, so use that directly
    return pretty


def main():
    print("generate-linkblog.py: Generating linkblog page and feed")

    links = load_links("src/links/links.json")

    with open("header.html", "r") as f:
        header = f.read()
    with open("footer.html", "r") as f:
        footer = f.read()

    os.makedirs("docs/links", exist_ok=True)

    # Generate HTML page
    content = generate_html(links)
    with open("docs/links/index.html", "w") as f:
        f.write(header + content + footer)

    # Generate Atom feed
    feed_xml = generate_feed(links)
    with open("docs/links/feed.xml", "w") as f:
        f.write(feed_xml)


if __name__ == "__main__":
    main()
