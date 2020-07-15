# TL;DR

I live on the command line:

* writing (code or prose): vim + Pandoc
* languages: Python, Bash, C. I've been really enjoying Haskell, and I've toyed around with Rust a little bit.
* I'm currently running Fedora Linux on a Dell XPS 13 laptop. The laptop has great Linux support, and Fedora maintains a decent balance between stability and up-to-date-ness.

### Coding

I do nearly all my work in neovim. I appreciate that it's extremely quick, it's extensible, and distraction-free.

I use only a few plugins, installed with the [vim-plug](https://github.com/junegunn/vim-plug) plugin manager:

* [ALE](https://github.com/dense-analysis/ale)
* [paredit.vim](https://github.com/vim-scripts/paredit.vim) (still getting used to this one.)
* [rainbow](https://github.com/luochen1990/rainbow)

Aside from Vim, I have used the JetBrains IDEs like IntelliJ and Pycharm. They are powerful and effective tools, but I personally have never felt as comfortable in them as I have in Vim. Modal editing is a powerful paradigm, and none of the Vim plugins quite match the functionality of ordinary Vim.

### Misc

I am a huge proponent of building your own small tools. I find that it keeps your mind sharp for programming, and you can often come up with a tool that satisfies your needs more than available solutions. Plus, you get to program and learn on the way!

For example, I built the site generator this site was built with, [Hatchet](https://gitlab.com/hendersonreed/Hatchet)

I find that `Bash` is especially powerful for creating these simple tools. Other languages provide all kinds of benefits (types, safety, debugging tools, etc) but so far I haven't come across anything that is as quick and effective for quickly scripting behavior.

For example, see the notetaking system I use:

~~~ bash
mdless() {
      pandoc -s -f markdown -t man $1.md | groff -T utf8 -man | less
	}
umedit() {
	vim "$UMDIR"/$1.md;
}
um() { mdless "$UMDIR"/"$1"; }
umls() { ls "$UMDIR" | \
    grep ".*\.md" | \
	grep -v "[0-9]*-[0-9]*-0-9]*" | \
	cut -d "." -f 1 }
# completion functions for um
_um() { compadd $(umls) }
compdef _um um
compdef _um umedit
~~~

