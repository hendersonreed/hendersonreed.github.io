#!/bin/env bash
set -euo pipefail

# common stuff for building the site
psg clean
./tools/heavy-lifting.sh

echo "enter your commit message now: (ctrl-c to cancel)"
read -r commit_msg

git add .
git commit -am "$commit_msg"
git push
