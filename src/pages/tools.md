# TL;DR

I live on the command line and in the browser:

* writing (code or prose): neovim, configured with my own fork of [kickstart.nvim](https://github.com/hendersonreed/kickstart.nvim)
* languages: Python, Bash, Javascript. I've toyed around with Rust a little bit. I'm always starting and stopping with some of the various lisps, like Fennel and Racket.
* I'm currently running Fedora Linux on a Dell XPS 13 laptop. The laptop has great Linux support, and Fedora maintains a decent balance between stability and up-to-date-ness. It's due for a battery replacement - I purchased this laptop in 2016 or 2017, and it's down to 60% of its max capacity.
* *testing*: I've been exploring the potential for using LLMs (large language models) to expand my capabilities. Currently I'm just using the free version of OpenAIs *ChatGPT* web interface, but I think there's tremendous opportunity here. It's not magic, but it provides capabilities that are powerful for summarizing, collating, and finding relevant information.


### philosophy:

I'm a huge fan of the *Unix as IDE* perspective. If you're unfamiliar, I really recommend you read [the series that started it all](https://sanctum.geek.nz/arabesque/series/unix-as-ide/). For those of you without the time, I'll summarize it here: essentially, it's a workflow that emphasizes the use of small, modular, configurable tools (like those available on most \*nixes) over the use of one monlithic tool (like your average IDE.) So, when I'm coding, I use many different tools, each of which are tuned and configured for only a few tasks. The advantage here is that I can more easily understand and extend each one.

A prime example of my attitudes in action is [psg](https://github.com/hendersonreed/psg), a static site generator I built. It's 77 lines of vanilla Python, with no dependencies aside from Pandoc, which is available as a package in most Linux distribution's default repositories. It's straightforward to extend, it has very few side-effects or expectations (meaning that it integrates with other tools well), and it's easy to install (you can just `curl` it from GitHub.)


### On building tools

I am a huge proponent of building your own small tools. I find that it keeps your mind sharp for programming, and you can often come up with a tool that satisfies your needs more than available solutions. Plus, you get to program and learn on the way!

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

