#!/bin/env bash

# resize and backup images
./tools/resize-and-backup.sh

# build the site itself
/home/reed/bin/psg build
./tools/generate-site-map.sh
/home/reed/bin/psg serve
