#!/bin/env bash

# resize and backup images
./tools/resize-and-backup.sh

# build the site itself
/home/reed/bin/psg build

echo "enter your commit message now: "
read -r commit_msg

git commit -am "$commit_msg"
git push
