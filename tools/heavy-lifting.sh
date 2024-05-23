#!/bin/env bash
set -euo pipefail

# preprocessing that needs to happen before the site generation.
# to avoid breaking `hot-reload-preview.sh` nothing that writes 
# or updates .md, .html, or .js files in /src can happen here.
./tools/resize-and-backup.sh # resize and backup images.

# build the site itself
echo "-----------------------------"
echo "heavy-lifting.sh: Running psg"
/home/reed/bin/psg build

# post-processing based on the built site
./tools/generate-atom-feed.py posts # creates a feed.xml in /src
./tools/generate-blog-index.py
./tools/generate-site-map.sh
./tools/fix-page-titles.py
