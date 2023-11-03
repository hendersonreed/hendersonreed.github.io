# Roadmap

- build a few personal web-components for some elements I'd like to add. For example:
    - quote blocks. I'd like to include the quote text, the author, and potentially a more specific source like the actual textual origin of a quote.
    - embedded tic80 games
    - embedded p5.js sketches
        - actually, could be matter.js and tone.js too.

# Scripts in this directory:

- generate-site-map.sh*
    - uses `tree` to generate the sitemap linked at the bottom of each page.
- preview.sh*
    - builds the site, then the sitemap, and launches a python webserver to preview it.
- publish.sh*
    - builds the site, then the sitemap, and then `read`s the commit-message and publishes the built site to github.
- resize-and-backup.sh*
    - resizes every image in the src directory (well all the common formats) to fit in under 1920x1920. The originals are copied into `backup_photos` (not tracked in git because git doesn't handle big binary data like photos well. (this decision may change if I find tracking the originals useful. (they all live in Google Photos anyways, the only difference between the ones in Google Photos and the ones in `backup_photos` are the descriptive file names.)))
