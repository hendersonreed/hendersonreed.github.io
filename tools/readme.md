# Roadmap

- build a few personal web-components for some elements I'd like to add. For example:
    - quote blocks. I'd like to include the quote text, the author, and potentially a more specific source like the actual textual origin of a quote.
    - embedded tic80 games
    - embedded p5.js sketches
        - actually, could be matter.js and tone.js too.
# Scripts in this directory:

## assumptions

First, I think it's worthwhile outlining the assumptions most of these scripts make (because I didn't write them to be general purpose - they are closely tied to my personal site structure and workflow.)

They all assume 3 things:
- an input directory named "src" that contains markdown
- an output directory named "docs" which is where all the output HTML is expected to live
- a "header.html"/"footer.html" file pair that can be prepended/appended respectively to an HTML fragment to produce a styled page.
- files in /src/posts have at least one div with class "published-slug" which looks like
    - `<div class="published-slug">published: YYYY-MM-DD</div>`
    - `<div class="published-slug">updated: YYYY-MM-DD</div>`
    - *must* match the above format exactly, so that `generate-atom-feed.py` and `generate-blog-index.py` work properly.

#### fix-page-titles.py

This does a hacky template fix for the page title system, so that the first `h1` in a page gets copied into the page title.

I will almost certainly fix this with Pandoc templating and the YAML front-matter feature it has, once it becomes a problem.

#### generate-site-map.sh

This generates [the sitemap](/sitemap.html). It uses the classic `tree` utility, which means (annoyingly) that my blogposts are sorted in true alphabetical order, not chronological order. I've been considering writing my own copy of tree to solve this :D

#### heavy-lifting.sh

This script gets called by any script that needs to build the entire site. (for previewing, publishing, etc.)

Important! Heed the warning inside it - if anything writes/modifies the src directory before `psg build` is run, then `hot-reload-preview` will stop working/infinitely loop.

#### hot-reload-preview.sh

Uses `entr` to watch all the source files for the page and rerun psg when a source file has changed.

#### preview.sh

Gets called by `hot-reload-preview.sh`

#### publish.sh

Cleans the build directory, calls `heavy-lifting.sh` and commits *everything* to the github repo with the given commit message.

#### readme.md

Describes these scripts.

#### resize-and-backup.sh

Resizes images in the src directory to fit in 1920x1920. It copies them into a backup directory that's tracked alongside the rest of the repository.

The resizing is because on pages that have lots of images (like [my foraging page](/pages/foraging.html), huge images was negatively impacting page load times.

#### generate-atom-feed.py

Generates an atom feed using the `published-slug` divs inside all blogposts.

#### generate-blog-index.py

Generates an HTML index page for everything in /src/posts using the atom feed as a source.
