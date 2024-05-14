#!/bin/env python3
import os
import shutil
import datetime
import xml.etree.ElementTree as ET


def convert_md_to_html(md_path):
    return md_path[:-3] + '.html'


def generate_atom_feed(dir_paths):
    feed = ET.Element('feed')
    feed.set('xmlns', 'http://www.w3.org/2005/Atom')

    # Set feed metadata
    id_element = ET.SubElement(feed, 'id')
    id_element.text = 'https://henderson.lol'
    title_element = ET.SubElement(feed, 'title')
    title_element.text = "Henderson's Log"
    updated_element = ET.SubElement(feed, 'updated')
    updated_element.text = datetime.datetime.utcnow().isoformat() + 'Z'

    author_element = ET.SubElement(feed, 'author')
    name_element = ET.SubElement(author_element, 'name')
    name_element.text = 'Henderson Reed Hummel'
    email_element = ET.SubElement(author_element, 'email')
    email_element.text = 'reed.hummel@gmail.com'

    link_element = ET.SubElement(feed, 'link')
    link_element.set('href', 'https://henderson.lol/feed.xml')
    link_element.set('rel', 'self')

    # Add entries for Markdown files
    for dir_path in dir_paths:
        for root, dirs, files in os.walk(dir_path):
            for file in files:
                if file.endswith('.md'):
                    entry = ET.SubElement(feed, 'entry')
                    entry_id = ET.SubElement(entry, 'id')
                    entry_id.text = 'https://henderson.lol/' + convert_md_to_html(os.path.join(root, file))
                    title = ET.SubElement(entry, 'title')
                    title.text = os.path.splitext(file)[0]
                    updated = ET.SubElement(entry, 'updated')
                    updated.text = datetime.datetime.fromtimestamp(os.path.getmtime(os.path.join(root, file))).isoformat()
                    link = ET.SubElement(entry, 'link')
                    link.set('href', entry_id.text)
                    link.set('rel', 'alternate')
                    link.set('type', 'text/html')

                    # Add newlines for readability
                    entry.tail = '\n\t'
    # Add newlines for readability
    feed[-1].tail = '\n'

    tree = ET.ElementTree(feed)
    tree.write('feed.xml', encoding='utf-8', xml_declaration=True)


if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("Usage: generate-atom-feed.py <directory1> [<directory2> ...]")
        sys.exit(1)
    os.chdir('src')
    print(f"Generating atom feed for entries in {sys.argv[1:]}...")
    directories = sys.argv[1:]
    generate_atom_feed(directories)
    os.chdir('..')
    shutil.copy('src/feed.xml', 'docs/feed.xml')
