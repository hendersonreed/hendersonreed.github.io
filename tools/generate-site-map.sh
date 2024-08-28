#!/bin/env bash

set -euo pipefail

echo "--------------------------------------------"
echo "generate-sitemap.sh: Generating sitemap.html"

# this find/grep expression lists all html pages that aren't
# project readme or license pages.
cd docs
find ./posts/ ./pages/ -name "*.html" \
    | grep -iv "license.html" \
    | grep -iv "readme.html" \
    | ../tools/paths-to-sitemap.py \
    > _sitemap.html

cat ../header.html <(echo "<h1>Sitemap</h1><br>") <(echo "<div class=\"sitemap\">") _sitemap.html <(echo "</div>") ../footer.html > sitemap.html
rm _sitemap.html
