#!/bin/env python3

import re
import os

directory_path = "./docs/posts/"

try:
    filenames = []  # Create an empty list to store filenames
    for f in os.listdir(directory_path):  # Iterate over the contents of the specified directory
        filenames.append(f)  # Include both files and directories in the list
except FileNotFoundError:
    print("Directory not found.")
    exit(-1)
except Exception as e:
    print(f"An error occurred: {e}")
    exit(-1)

results = []
for each in filenames:
    match = re.match(r'(\d{4}-\d{1,2}-\d{1,2})-(.*).html', each)
    if match:
        date = match.group(1)
        title = match.group(2).replace('-', ' ')
        results.append(f"<a href=\"/posts/{each}\">{date} {title}</a>")

# eventually we'll replace this and use sed to place the result into each blogpost.
print("<div id=\"blog-archive\">")
for each in results:
    print(str(each))
print("</div>")
