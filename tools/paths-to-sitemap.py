#!/usr/bin/env python3

import sys
from collections import defaultdict
from html import escape

def create_tree(paths):
    def nested_dict():
        return defaultdict(nested_dict)
    
    tree = nested_dict()
    for path in paths:
        parts = path.strip().split('/')
        current = tree
        for part in parts[:-1]:
            current = current[part]
        current[parts[-1]] = path
    return tree

def format_list(tree, indent=0):
    html = []
    for key, value in sorted(tree.items()):
        if isinstance(value, defaultdict):
            if 'index.html' in value:
                link = value['index.html']
                display = key + '/'
            else:
                link = next((v for k, v in value.items() if isinstance(v, str)), '')
                display = key + '/'
            html.append('  ' * indent + f'<li><a href="{escape(link)}">{escape(display)}</a>')
            html.append('  ' * (indent + 1) + '<ul>')
            html.extend(format_list(value, indent + 2))
            html.append('  ' * (indent + 1) + '</ul>')
            html.append('  ' * indent + '</li>')
        elif key != 'index.html' and isinstance(value, str):
            html.append('  ' * indent + f'<li><a href="{escape(value)}">{escape(key)}</a></li>')
    return html

def main():
    paths = sys.stdin.readlines()
    tree = create_tree(paths)
    html_list = format_list(tree)
    print('<ul>')
    print('\n'.join(html_list))
    print('</ul>')

if __name__ == "__main__":
    main()
