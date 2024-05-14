#!/bin/env python3
import xml.etree.ElementTree as ET


def generate_blog_index(atom_feed_path):
    with open(atom_feed_path, 'r') as file:
        tree = ET.parse(file)
        root = tree.getroot()

    # Extract entries from Atom feed
    entries = root.findall('.//{http://www.w3.org/2005/Atom}entry')
    entries = sorted(entries, key=lambda entry: entry.find('{http://www.w3.org/2005/Atom}updated').text, reverse=True)

    # Generate HTML blog index fragment
    blog_index_html = "<h1>Writing</h1>\n<ul>\n"
    for entry in entries:
        title = entry.find('{http://www.w3.org/2005/Atom}title').text
        link = entry.find('{http://www.w3.org/2005/Atom}id').text
        updated = entry.find('{http://www.w3.org/2005/Atom}updated').text.split("T")[0]
        blog_index_html += f'<li>{updated} | <a href="{link}">{title}</a></li>\n'
    blog_index_html += "</ul>\n"

    return blog_index_html


def save_index_html(blog_index_html):
    # Read header and footer HTML files
    with open("header.html", 'r') as file:
        header_html = file.read()
    with open("footer.html", 'r') as file:
        footer_html = file.read()

    # Combine header, blog index, and footer
    index_html = header_html + blog_index_html + footer_html

    # Save to index.html
    with open("docs/posts/index.html", 'w') as file:
        file.write(index_html)


print("---------------------")
print("Generating Blog Index")
blog_index_html = generate_blog_index("src/feed.xml")
save_index_html(blog_index_html)
print("Index.html file generated successfully.")
