# Using ffmpeg for weird video effects
<div class=published-slug>published: 2024-1-4</div>

Painfully won, maybe this `ffmpeg` incantation can help you, dear reader.

## wait, why again are we doing this?

I'm working on a project at the moment that involves applying a variety of digital effects to a webcam video stream. In my preparatory research for the video effect tooling, I discovered that there's actually a fascinatingly large number of audio/video filters for `ffmpeg`. 

This solution appeals to me for a few reasons:

1. small-ish and simple-ish
2. CLI solution (the final result is going to be projected, so it's nice if the effects are being applied by something that isn't displayed on screen.)
3. straightforward to automate (can write a startup script to reset the installation in case of power loss.)

This solution also frightens me because ffmpeg is arcane and obscure (relative to most tools I like to use.)

So, I thought I'd write up what I did and how I learned it! Primarily so that I can use it in the future for my own reference.

## to google!

The google results for "stream ffmpeg webcam video stream" are mostly unsolved requests for help on stack-overflow 🙃

However, there are some useful tidbits here and there.

First, we need to know what our device is called, according to ffmpeg. On Linux, this can be done with `v4l2-ctl --list-devices` (I had to install the `v4l-utils` package on Fedora.)

On my system, the default webcam is /dev/video0. So let's test to see if we can simply record from the webcam to a file:

```
ffmpeg -f v4l2 -i /dev/video0 output.mp4 
```

![](/assets/photos/blogposts/ffmpeg-filters/ffmpeg-article-video.mp4)

I'd call that a success!

## opening the video stream.

The simplest thing here is to use one process to create a video stream, and another to open it. This way our capturing ffmpeg incantation isn't *too* long.


To stream:

```
ffmpeg -f v4l2 -i /dev/video0 \
    -framerate 25 \
    -video_size 1280x720 \
    -f mpegts udp://localhost:1234
```

We can open up the stream with a simple `ffplay -fflags nobuffer udp://localhost:1234`. (`-fflags nobuffer` removes a ~10 second buffer that ffplay adds for some reason.)

## applying weird effects!

now we can review the ffmpeg documentation, specifically [the video filters](https://ffmpeg.org/ffmpeg-filters.html#Video-Filters).

Let's try this out.

```
ffmpeg -f v4l2 -i /dev/video0 \
        -framerate 25 \
        -video_size 1280x720 \
        -vf edgedetect \
        -f mpegts udp://localhost:1234
```

Run `ffplay -fflags nobuffer udp://localhost:1234` again, and let's see what the result is...

Success! We've got edge detection working:

![](/assets/photos/blogposts/ffmpeg-filters/edge-detection-filter.png)

`ffmpeg -filters` gives us a list of all the filters that exist in our installed copy of the utility - any that are marked `V->V` are video-to-video, and we can experiment to see what cool stuff we can find. `waveform` and `elbg` are both interesting - this is gonna be the fun part.

## bonus round: quick-n-dirty script

I want to speed up trying out new filters. It'd be very nice if I could simply type out a filter name, maybe some parameters, and hit `CR` to see the results immediately. This is all to preface the following very bad, no-good, totally incorrect, inflexible, "works-on-my-machine", highly effective script (provided in large part by chatGPT.)

```
#!/bin/bash

# handle termination signals and kill both processes
terminate_processes() {
    echo "Terminating processes..."
    kill -TERM "$pid1" "$pid2" 2>/dev/null
    wait "$pid1" 2>/dev/null
    wait "$pid2" 2>/dev/null
    exit 0
}

# Trap termination signals
trap terminate_processes SIGINT SIGTERM

# Run the ffmpeg command to capture and stream the webcam in a terminal window and store its process ID
alacritty --command ffmpeg -f v4l2 -i /dev/video0 \
        -framerate 25 \
        -video_size 1280x720 \
        -vf "$1"\
        -f mpegts udp://localhost:1234 &
pid1=$!

# Run the ffplay command in a terminal window and store its process ID
alacritty --command ffplay -fflags nobuffer udp://localhost:1234 &
pid2=$!

# Wait for either of the commands to finish
wait -n "$pid1" "$pid2"

# If one process is terminated, kill the other one
terminate_processes
```

It works perfectly for me :)
