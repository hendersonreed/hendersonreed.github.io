# Rescuing my feeds from QuiteRss
<div class="published-slug">published: 2025-01-05</div>

## Disclaimer: this is kinda about LLMs.

In spaces I frequent, the use of large language models for programming seems to be a bit of a contentious issue. I've read a lot of articles from [some](https://www.geoffreylitt.com/2023/03/25/llm-end-user-programming) [great](https://simonwillison.net/2024/Oct/21/claude-artifacts/) [programmers](https://eric-fritz.com/articles/my-ai-junior-dev-still-needs-an-adult-in-the-room/) about how they are using it in their day-to-day work, and how some particular experiences changed their minds.

Today I encountered a problem that seemed like a great fit for demonstrating how I'm using these tools, because I think that sometimes all it takes is a cheap little example.

## Let's set the stage.

I make use of a pretty neat technology called *RSS* which stands for Real Simple Syndication. Pretty futuristic stuff, you can subscribe to the social media feeds of other people *without a server in the mix at all*. No need for any IPFS or federation or whatever, just a simple file format. I think it's probably going to be a big hit.

Anyways, ahistorical anecdote aside, I've been ignoring my RSS feed reader for the last year or so, which appears to have been a mistake as that project is [now unmaintained](https://www.extrema.is/blog/2024/05/30/rss-part-18-quiterss-is-dead). Upon loading it, the Qt widget system behaves very strangely, and it's unclear how easy it will be to export my feeds.

BUT! Thanks to [this github issue](https://github.com/QuiteRSS/quiterss/issues/625) I learned that all my feeds are saved neatly in an SQLite database at `/home/reed/.local/share/QuiteRss/`.

## Exploring the QuiteRSS database

Generally, I highly recommend opening up SQLite databases you have sitting around. There's a palpable excitement to the growing awareness that you have access to the raw form of the data you generated (Firefox, for example, stores all your browsing history and bookmarks in an SQLite DB. Think of the graphs you could draw!)

Here's some (shortened) output from my initial explorations:

```
sh-5.2$ sqlite3 feeds.db
SQLite version 3.45.1 2024-01-30 16:01:20
Enter ".help" for usage hints.
sqlite> .tables
feeds             filterConditions  info              news_ex
feeds_ex          filters           labels            passwords
filterActions     filters_ex        news
sqlite> select * from feeds;
148|Rafał Pastuszak|Rafał Pastuszak|Rafał Pastuszak is an experienced startup consultant specialised in web, mobile, emerging technologies and human-centred design. Click to find out more.|https://sonnet.io/feed.xml|https://sonnet.io|||||||2023-05-29T00:00:00|2023-05-29T00:00:00|||||||||||||AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAAAAD////////////////////////////////////////////////////+/////v////7////+/////v////7////+//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////T09P/p6en///////////////////////////////////////////////////////////////////////////+mpqb/vb29/+Dg4P//////////////////////////////////////////////////////////////////////hoaG/2RkZP/19fX//////+Tk5P/a2tr/+vr6///////////////////////S0tL/39/f/4iIiP9PT0//39/f//z8/P/Hx8f/4ODg/9fX1/+7u7v/AAAA/xcXF/+3t7f////////////Q0ND/9/f3//////9LS0v/AAAA/xYWFv/u7u7/+fn5/9TU1P//////nJyc/wAAAP8AAAD/EhIS//b29v//////zc3N//v7+///////QUFB/wAAAP8/Pz///f39///////Jycn/8/Pz/7+/v/8AAAD/DAwM/7W1tf////////////7+/v/U1NT/0tLS/3t7e/9oaGj/6+vr/////////////////97e3v/Hx8f/n5+f/+jo6P//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC+RA==|13|0|7467||13||0|147|14||||||||||||||||1||||||||||||||0|2024-05-24T00:20:00|2024-05-24T00:20:00||1||0|0|1|0||0|0|0|1|0|0|0|0
...
```

That's too much of a mess to read. Let's try to prune it down to just the essentials. Someone in a Github issue for exporting data from QuiteRSS.sh recommended `select title,xmlUrl from feeds`. `.schema feeds` showed me that I could add `htmlUrl` to the output also.

Here's the (once again shortened) output:
```
sqlite> select title,htmlUrl,xmlUrl from feeds;
schollz|https://schollz.com/|https://schollz.com/index.xml
Szymon Kaliski|https://szymonkaliski.com|https://szymonkaliski.com/feed.xml
||
||
Rafał Pastuszak|https://sonnet.io|https://sonnet.io/feed.xml
...
```

There are some empty lines here - I investigated a bit further and it became clear that QuiteRss was using the feeds table to also hold categories of feeds - don't ask me why.

Anyways, just guarding ourselves from anything that isn't an actual feed should be fine:

```
sqlite> select title,htmlUrl,xmlUrl from feeds where xmlUrl != '';
```

yields just the valid feeds:

```
schollz|https://schollz.com/|https://schollz.com/index.xml
Szymon Kaliski|https://szymonkaliski.com|https://szymonkaliski.com/feed.xml
Rafał Pastuszak|https://sonnet.io|https://sonnet.io/feed.xml
...
```

## Organizing them for import elsewhere

First, I want to get this data out of the sqlite3 console. A quick query to ChatGPT informs me of the `.output` command and shows an example of how to use it. It works first try, giving me a file full of lines like this: `schollz|https://schollz.com/|https://schollz.com/index.xml`.

<div class="sidenote">
### sidenote on search engines:

I think for minor, easily-verifiable details like this, search engines are maybe doomed. Large language models have so many advantages: no clicking around, no *choosing* about which source to go to, no context switching between the SQLite documentation, a StackOverflow post, and some other third party almost-blogspam. Just ask, and ye shall recieve, and it'll be about as accurate as StackOverflow anyways. (Arguments regarding LLM inaccuracy are tricky, because the comparison for most people isn't between a hypothetical expert that's 100% accurate and a 90% accurate LLM - it's between a google search and an LLM query, which are closer than you think, depending on your Googling ability (and the era of Google you're comparing against, since the quality of Google results continues to decline.))
</div>

So, RSS feed readers typically import/export something called OPML.

When I began this project, that was the extent of my knowledge. In the past, writing a script to convert some text to a file format I'm totally unfamiliar with would feel like a burden. I'd probably waste a bunch of time looking to see if anyone else had written it, try to install it, waste my time with Python packaging shenanigans, and then give up.

But now, ask and ye shall receive:

```
Reed => could you explain the OPML file format and how it's formatted?

ChatGPT => Certainly! OPML (Outline Processor Markup Language) is an XML-based file format used for representing outlines, particularly for managing and organizing hierarchical data. It's commonly used for managing lists of RSS feed subscriptions, podcast directories, and bookmarks, but can be applied to any hierarchical structure.
Basic Structure of OPML

An OPML file is composed of a root <opml> element, with child elements that represent outlines or lists of items. Here's an overview of the key components and structure of an OPML fi...
```

It gave me some nice examples of the basic format, which I won't post here, because I'm not interested in actually writing anything that outputs it. I'm interested in getting ChatGPT to write it *for me.* After all, sometimes I just want the software - NOT the experience of writing it.

## Final step:

<div class="sidenote">
So, I have a text file, with a custom format that looks like `title|htmlUrl|xmlUrl`, one entry per line, and the only item guaranteed to not be null is xmlUrl.

I'd like a Python script that loads that file and outputs an OPML file that contains all the feeds and can be imported into other RSS feed readers.
</div>

I handed that above text to the LLM directly as my prompt. It spat out a script with a big function that claimed to do everything - it didn't actually call the function it defined, so I prompted it to re-write it as a script that took a filename on the commandline. Copy, paste into my editor, check it with my LSP, which indicated no issues. So I backed up my little text file and ran the script on it.

<details>
<summary>here's the script</summary>
``` python
import xml.etree.ElementTree as ET
import sys


def convert_to_opml(input_file, output_file):
    # Create the root <opml> element and <head> metadata section
    opml = ET.Element('opml', version="2.0")
    head = ET.SubElement(opml, 'head')
    title = ET.SubElement(head, 'title')
    title.text = "My RSS Feeds"  # You can customize this title
    body = ET.SubElement(opml, 'body')

    # Open the input file and read it line by line
    with open(input_file, 'r') as f:
        for line in f:
            # Strip any leading/trailing whitespace and skip empty lines
            line = line.strip()
            if not line:
                continue

            # Split the line by the delimiter '|'
            parts = line.split('|')

            # Extract the title, htmlUrl, and xmlUrl (xmlUrl is mandatory)
            title = parts[0].strip() if len(parts) > 0 else ''
            html_url = parts[1].strip() if len(parts) > 1 else ''
            xml_url = parts[2].strip() if len(parts) > 2 else ''

            # Create an <outline> element for each feed
            outline = ET.SubElement(body, 'outline', text=title, type="rss", xmlUrl=xml_url)

            if html_url:
                outline.set('htmlUrl', html_url)

    # Create the tree structure and write to the output file
    tree = ET.ElementTree(opml)
    tree.write(output_file, encoding='utf-8', xml_declaration=True)

    print(f"OPML file saved to {output_file}")


def main():
    # Check if the user has provided the input filename
    if len(sys.argv) != 2:
        print("Usage: python convert_to_opml.py <input_file>")
        sys.exit(1)

    # Get the input filename from command line arguments
    input_file = sys.argv[1]

    # Define the output file name (we'll generate the OPML file with a .opml extension)
    output_file = input_file.rsplit('.', 1)[0] + '.opml'

    # Call the conversion function
    convert_to_opml(input_file, output_file)


if __name__ == "__main__":
    main()
```
</details>

It worked, first shot! Well, the script produced a file with a `.opml` extension - its validity is unclear. Opening it in neovim confirmed that it *looked* like valid XML.

`newsboat -i feed-data.ompl` worked a treat, and browsing the feeds proved that it had worked. Job done!

## Some thoughts on this process

I don't know that this is going to change any minds about large language models and their encroachment on the craft of programming - so far most people are pretty set in their views about it. But I do think there's room for more (even reluctant) interest in these tools from people who aren't trying to sell it as a SaaS business (there's already enough of that.)

The reasons I keep using them isn't because the code is particularly great. It's not because I'm lazy (I don't think I'm particularly lazy.) But it lowers the barrier to writing a piece of software, and I think it's difficult to overestimate the impact that might have on us all.

I think Maggie Appleton lays out a really interesting potential future in [her talk on home-cooked software](https://maggieappleton.com/home-cooked-software), and it's certainly influenced how I see these technologies - often empowering and maybe enriching, not purely parasitic or purely hype.
