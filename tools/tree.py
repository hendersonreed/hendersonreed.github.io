#!/bin/env python3
import os
import sys


def generate_tree_html(directory, ignore_list, root_dir, indent='', parent_link=False):
    if not os.path.isdir(directory):
        return ''

    files = sorted(os.listdir(directory))
    html = ''
    for i, file in enumerate(files):
        if file in ignore_list:
            continue
        path = os.path.join(directory, file)
        is_last = i == len(files) - 1
        marker = '└── ' if is_last else '├── '
        full_path = os.path.relpath(path, root_dir)
        name = f'<a href="{full_path}" target="_blank">{file}</a>' if os.path.isdir(path) and os.path.exists(os.path.join(path, 'index.html')) else file
        html += f'{indent}{marker}{name}<br>\n'
        if os.path.isdir(path):
            child_indent = indent + ('    ' if is_last else '│   ')
            html += generate_tree_html(path, ignore_list, root_dir, child_indent, parent_link=True)
    return html + '\n'


def generate_html_tree(root_dir, ignore_list):
    html = '<pre>'
    html += generate_tree_html(root_dir, ignore_list, root_dir)
    html += '</pre>'
    return html


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python script.py <directory> [-I <ignore_list>]")
        sys.exit(1)

    root_dir = sys.argv[1]
    ignore_list = []
    if '-I' in sys.argv:
        try:
            index = sys.argv.index('-I')
            ignore_list = sys.argv[index + 1:]
            if not all(os.path.exists(os.path.join(root_dir, file)) for file in ignore_list):
                print("One or more files in the ignore list do not exist.")
                sys.exit(1)
        except IndexError:
            print("Missing ignore list after -I argument.")
            sys.exit(1)
    html_output = generate_html_tree(root_dir, ignore_list)
    with open('tree.html', 'w') as f:
        f.write(html_output)
