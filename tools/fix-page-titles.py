#!/bin/env python3

"""
iterate through every single html file in `root_dir`. define root_dir at the top of the file as `./docs/`.
for each file, we should
    1. identify a "title" (the contents of the first <h1> element in any file that's not index.html. If it's index.html, then `title = "henderson's log"`)
    2. replace the <title> element with f"<title>henderson's log: {title}</title>"
"""

import os
import re

root_dir = "./docs/"

for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".html") and filename != "index.html" and "old-site" not in dirpath:
            file_path = os.path.join(dirpath, filename)

            with open(file_path, 'r', encoding='utf-8') as file:
                html_content = file.read()

            # Use regex to find the content within the <h1> tag excluding certain cases
            h1_pattern = r'<h1'                       # Opening <h1> tag
            h1_pattern += r'(?![^>]*\bclass=["\']?title center["\']?)'  # Negative lookahead for class="title center"
            h1_pattern += r'.*?>'                      # Rest of the <h1> tag
            h1_pattern += r'(.*?)'                     # Content inside <h1>
            h1_pattern += r'</h1>'                     # Closing </h1> tag

            match = re.search(h1_pattern, html_content, re.DOTALL)
            title = match.group(1).strip() if match else None

            if title is not None:
                # Use regex to replace the <title> element
                html_content = re.sub(r'<title>.*?</title>', f'<title>henderson\'s log: {title}</title>', html_content)

                # Write the modified content back to the file
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(html_content)
            else:
                print(f"{file_path} has no title, is this intentional?")
