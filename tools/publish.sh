#!/bin/env bash
set -euo pipefail

# common stuff for building the site
psg clean
./tools/heavy-lifting.sh

if [[ -z "${1}" ]]; then
    echo "enter your commit message now: (ctrl-c to cancel)"
    read -r commit_msg
else 
    commit_msg="$1"
fi

git add .
git commit -am "$commit_msg"
git push
