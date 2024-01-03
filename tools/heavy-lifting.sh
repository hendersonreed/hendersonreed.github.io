#!/bin/env bash
set -euo pipefail

# resize and backup images
./tools/resize-and-backup.sh

# build the site itself
/home/reed/bin/psg build
./tools/fix-page-titles.py
./tools/generate-site-map.sh
