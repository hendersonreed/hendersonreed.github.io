#!/bin/env bash
set -euo pipefail

# preprocessing that needs to happen before the site generation.
# to avoid breaking `hot-reload-preview.sh` nothing that writes 
# or updates files in /src can happen here.
./tools/resize-and-backup.sh # resize and backup images.

# build the site itself
/home/reed/bin/psg build

# post-processing based on the built site
./tools/generate-blog-index.sh
./tools/generate-site-map.sh
./tools/fix-page-titles.py
./tools/generate-atom-feed.py posts
