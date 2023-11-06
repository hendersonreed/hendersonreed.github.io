#!/bin/env bash

# resize and backup images
./tools/resize-and-backup.sh

# build the site itself
/home/reed/bin/psg build
./tools/generate-site-map.sh

echo "enter your commit message now: "
read -r commit_msg

git add .
git commit -m "$commit_msg"
git push
