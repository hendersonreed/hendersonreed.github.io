#!/bin/env python3

"""
This script sets the title of each page to the contents of the second h1 that's on the page (the first h1 is in header.html)
"""

import os
import re

print("--------------------------------------------------------------")
print("fix-page-titles.py: Guessing page titles based on H1 elements.")

root_dir = "./docs/"

for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".html") and filename != "index.html" and "old-site" not in dirpath:
            file_path = os.path.join(dirpath, filename)

            with open(file_path, 'r', encoding='utf-8') as file:
                html_content = file.read()

            # this regex should match the contents of any h1 elements
            pattern = r'<h1[^>]*>(.*?)</h1>'
            matches = re.findall(pattern, html_content, re.DOTALL)
            # here we're stripping any inner html elements from the h1 so that it's just plain text.
            h1_contents = [re.sub(r'<.*?>', '', match) for match in matches]

            if len(h1_contents) > 1:
                # we always try to use the second h1 element as the title.
                html_content = re.sub(r'<title>.*?</title>', f'<title>{h1_contents[1]}</title>', html_content)

                # Write the modified content back to the file
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(html_content)
            else:
                print(f"{file_path} has no h1, is this intentional?")
