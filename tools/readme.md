# Roadmap

- build a few personal web-components for some elements I'd like to add. For example:
    - quote blocks. I'd like to include the quote text, the author, and potentially a more specific source like the actual textual origin of a quote.
    - embedded tic80 games
    - embedded p5.js sketches
        - actually, could be matter.js and tone.js too.

# Scripts in this directory:

#### fix-page-titles.py

This does a hacky template fix for the page title system, so that the first `h1` in a page gets copied into the page title.

I will almost certainly fix this with Pandoc templating and the YAML front-matter feature it has, once it becomes a problem.

#### generate-site-map.sh

This generates [the sitemap](/sitemap.html). It uses the classic `tree` utility, which means (annoyingly) that my blogposts are sorted in true alphabetical order, not chronological order. I've been considering writing my own copy of tree to solve this :D

#### heavy-lifting.sh

This script gets called by any script that needs to build the entire site. (for previewing, publishing, etc.)

#### hot-reload-preview.sh

Uses `entr` to watch all the source files for the page and rerun psg when a source file has changed.

#### preview.sh

Gets called by `hot-reload-preview.sh`

#### publish.sh

Cleans the build directory, 

#### readme.md

Describes these scripts.

#### resize-and-backup.sh

Resizes images in the src directory to fit in 1920x1920. It copies them into a backup directory that's tracked alongside the rest of the repository.

The resizing is because on pages that have lots of images (like [my foraging page](/pages/foraging.html), huge images was negatively impacting page load times.
