#!/bin/env bash

set -euo pipefail

echo "--------------------------------------------"
echo "generate-sitemap.sh: Generating sitemap.html"

cd docs
# flag explanation for below tree command
# -C colorization
# -H is HTML output, with `.` as the root
# -I ignores the following glob
# -o saves to a file.
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
    -I "style.css.map" \
    -I "unpublished_posts" \
    -I "index.js" \
    -I "index.js.map" \
    -I "android-chrome-192x192.png" \
    -I "android-chrome-512x512.png" \
    -I "apple-touch-icon.png" \
    -I "favicon-16x16.png" \
    -I "favicon-32x32.png" \
    -I "favicon.ico" \
    -I "site.webmanifest" \
    -I "*.js" \
    -I "empty-example.html" \
    -I "README.md" \
    -I "README.html" \
    -I "LICENSE.html" \
    -I "LICENSE" \
    -I "CNAME" \
    -o ../_sitemap.html
cd -

cat header.html <(echo "<h1>Sitemap</h1><br>") <(echo "<pre class=\"sitemap\">") _sitemap.html <(echo "</pre>") footer.html > docs/sitemap.html
rm _sitemap.html
