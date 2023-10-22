#!/bin/env bash

set -euo pipefail

cd docs
tree \
    -C \
    -H '.' \
    --hintro /dev/null \
    --houtro /dev/null \
    --noreport \
    --charset utf-8 \
    --ignore-case \
    -I "index.html" \
    -I "sitemap.html" \
    -I "old-site/" \
    -I "assets/" \
    -I "fonts/" \
    -I "index.html" \
    -I "style.css" \
    -I "unpublished_posts" \
    -o ../_sitemap.html
cd -

cat header.html <(echo "<pre>") _sitemap.html <(echo "</pre>") footer.html > docs/sitemap.html
rm _sitemap.html
