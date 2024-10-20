#!/bin/env bash

if [[ -z "${1}" ]]; then
    echo "enter your commit message now: (ctrl-c to cancel)"
    read -r commit_msg
else 
    commit_msg="$1"
fi

set -euo pipefail

# common stuff for building the site
psg clean # deletes the existing docs dir to remove any leftovers.
./tools/heavy-lifting.sh


git add .
git commit -a --message="$commit_msg" --edit
git push
