#!/bin/env bash
set -euo pipefail

# common stuff for building the site
./tools/heavy-lifting.sh

cd docs || exit
python -m http.server
cd ..
