# Blocking "recommended for you" items on the GitHub feed
<div class="published-slug">published: 2026-05-27</div>

One of the few reasons I remain on GitHub is, yes, the network effect.

I have many friends on GitHub and in the GitHub feed I can see what public repos they are working in, what repositories they are starring, what they're talking about - it's a nice way to keep in touch with them and feel connected about our shared passions in software. But lately, I've noticed that GitHub has also been stuffing "trending repositories" and "recommended for you" items in the feed.

Often these trending repositories are garbage - over-hyped, sometimes scammy. After one too many times clicking on them and wondering why they were in my feed, I resolved to fix the issue:

```
github.com##article#feed-item-0
```

If you have uBlock Origin (which you should have), then you can add that as a custom filter - it turns out all the recommended items have the same `feed-item-0` id on the HTML attribute, presumably because they're not actually part of my feed, but rather injected by some sort of post-processing or dynamic loading.

And so it's easy to filter them all out. Take control of your clients! It is your computer, after all.
