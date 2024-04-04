# psg: the minimum viable site generator

I use a site generator that is 99 lines of Python to generate this website. It has one dependency, [Pandoc](https://pandoc.org/)

There are other scripts that accessorize it, but the core functionality of building the site is done by [this script](https://github.com/hendersonreed/psg/blob/main/psg.py).

Questions you might have:

1. why write your own, Reed, when there are [so many site generators already?](https://github.com/myles/awesome-static-generators).
1. what is handled by the other scripts? Isn't it cheating to announce you have the minimum viable site generator and then use a bunch of other tools to patch over gaps in your initial design?

I'll try to answer those as best I can.

### why I decided to write my own

I never felt like I could understand any of the design decisions behind other generators, and for me, understanding the *why* behind something is just as important as understanding the *how*.


In addition, other generators often felt wedded to a type of working that didn't jive with my own personal workflows.

I *can* write my own software. That's an incredible thing! It's fun to write software, it's a source of creative expression for me, and it's so fulfilling to use a tool that you made.

On top of that, I feel *far* more comfortable extending psg than say, Jekyll. I know every bit of psg! And if I forget it, I can read the sourcecode in 10 minutes and understand everything again.

The other aspect here is that building psg ultimately was *faster* than learning how to use any of these other tools. I spent probably 2 hours on it to begin with, and by the end I had something usable that I understood from top-to-bottom.

Speed and my own understanding were my requirements, and I'm the only stakeholder!

### what other tools are needed to complement psg?

I've written a [handful of scripts that live alongside the source for this site](https://github.com/hendersonreed/hendersonreed.github.io/tree/master/tools)

`cloc` reports that in total, there are 141 additional lines of code, in bash and Python.

These scripts do things like:

- add unique page titles (this would be fixed with correctly using Pandoc templating.)
- resize images for faster page-loading.
- build a sitemap for navigation.
- publish the site (cleans the build directory, rebuilds it from scratch, asks me for a commit message, and pushes to github.)

## should you use psg?

*For me*, psg is great. But I don't think that means you should use it.

I think for people who like to craft their personal sites, a site generator is a personal tool, and is inextricably bound up with their ways of working. 

If you're like me, there's a low chance anything off the shelf will satisfy your personal preferences. So, build your own! It's an easier task than you might think.
