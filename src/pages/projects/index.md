# projects

I keep a running list of random/bad/maybe-interesting?? project ideas: [todo](todo.html)

In my spare time, I like creative coding projects, often with webcam interactions and music creation themes. The code for most of these can be found on [my github.](https://github.com/hendersonreed)

## live projects you can check out right now:

- [cam-seq](cam-seq): this tool lets you assign points on your webcam feed to particular notes and synthesizer patches. Then when the pixels at those points change, a note gets triggered. Current fun ideas using this: point a camera at trainlines, get a song when the train arrives; build a "visual instrument" using motors, papercraft, etc, and point the webcam at it; write a song using pieces of confetti sitting on a turntable that's being watched by the webcam.
- [gene-synth](gene-synth/): this is a page that lets you "breed" synthesizer patches. All the synthesizer patches you click on get added to a pool that gets recombinated into a batch of new synthesizers using a basic genetic algorithm.
- [webcam-theremin](webcam-theremin/): this uses your webcam to simulate the experience of playing a theremin. It's not the same of course, but if you've no theremin, then you do have this! This was implemented using Google Mediapipe for the hand recognition, p5.js for the draw loop and basic structure, and Tone.js for the synthesized sound.
- [hark: a literature visualizer](hark.html).
    - this is a little script that visualizes recurring 4/5/6-word phrases in a given piece of literature. Some public domain text is included as an example.
- [psg: python site generator](https://github.com/hendersonreed/psg)
    - this is the primary tool used to build this site, and I built it specifically to be **the minimum viable site generator**. It has just two dependencies, runs anywhere Python and Pandoc can, and requires no real "installation" - it's just a script. It's designed to do just one thing and do it well, so it fits neatly into the mosaic of little tools I write for my own purposes.
    - There are a few additional scripts tracked alongside the website source itself for things like backing-up-and-resizing images and generating the page sitemap, but `psg` is the biggest part.
- [pyplot: for poking at vintage plotters](/posts/2023-10-23-building-pyplot.html)
    - this is a small utility I wrote for feeding larger HPGL files into vintage plotters with limited buffer size. It was inspired/based on `chunker`, which is part of [Wesley's plotter-tools](https://github.com/wesleyac/plotter-tools)
- p5.js experimenting:
    - [particle-audio-viz](particle-audio-viz/)
        - At the Recurse Center, I occasionally run a creative coding session, in which attendees spend 90 minutes programming on a selected prompt. This project was made by me and [Hannah Robertson](https://hannahilea.com/), and represents the current audio input visually. Allow microphone access and drag your mouse across the canvas while making noises to see it work.
    - [colorworm!!](colorworm.html)
        - This was created as part of an [exquisite corpse](https://en.wikipedia.org/wiki/Exquisite_corpse) with me and my friend [Lucas](https://lucaslija.github.io/)
    - [colordrops](colordrops.html)
        - In building a regular creative practice, I've been trying to churn out more little unfinished pieces. colordrops is one.
        - These little colorful circles seem to induce a playful mood for most people. This one is not as interactive as colorworm, which means it doesn't quite get you into the "zone" the way colorworm does. It also isn't particularly mobile friendly, as it relies on keyboard input.
- [snow-hands](snow-hands/): this is a little project I put together for a holiday event. The idea is to set it up on a projector, and point a webcam at the projector setup, so that the snowflakes can follow your hands in real time. To test it out, just open the page, click the screen, and once you've allowed webcam access just slowly wave your hands within view of the webcam.
