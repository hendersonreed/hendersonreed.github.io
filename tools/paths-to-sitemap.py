#!/usr/bin/env python3

import sys
from collections import defaultdict
from html import escape


def create_tree(paths):
    def nested_dict():
        return defaultdict(nested_dict)

    tree = nested_dict()
    for path in paths:
        path = path.strip()
        if not path:
            continue
        parts = path.split('/')
        current = tree
        for part in parts[:-1]:
            current = current[part]
        # The leaf node stores the full path string
        current[parts[-1]] = path
    return tree


def format_list(tree, indent=0):
    html = []
    # Sort keys to keep the sitemap alphabetical
    for key in sorted(tree.keys()):
        value = tree[key]

        # If it's a directory (defaultdict)
        if isinstance(value, defaultdict):
            # Check if this directory has an index.html to link to
            if 'index.html' in value and isinstance(value['index.html'], str):
                link = value['index.html']
            else:
                # Fallback: link to the first available string path found deeper
                link = "#"

            display = key + '/'
            html.append('  ' * indent + f'<li><a href="{escape(link)}">{escape(display)}</a>')

            # RECURSION: Always check if there are sub-items,
            # but filter out 'index.html' so it's not listed twice
            sub_items = {k: v for k, v in value.items() if k != 'index.html'}
            if sub_items:
                html.append('  ' * (indent + 1) + '<ul>')
                html.extend(format_list(sub_items, indent + 2))
                html.append('  ' * (indent + 1) + '</ul>')

            html.append('  ' * indent + '</li>')

        # If it's a file (string) and NOT the index.html (which is handled by the parent dir)
        elif key != 'index.html' and isinstance(value, str):
            html.append('  ' * indent + f'<li><a href="{escape(value)}">{escape(key)}</a></li>')

    return html


def main():
    # Read paths, filtering out empty lines
    paths = [line.strip() for line in sys.stdin if line.strip()]
    if not paths:
        return

    tree = create_tree(paths)
    html_list = format_list(tree)

    print('<ul>')
    print('\n'.join(html_list))
    print('</ul>')


if __name__ == "__main__":
    main()
