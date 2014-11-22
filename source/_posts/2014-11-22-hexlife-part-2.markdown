---
layout: post
title: "Hexlife Part 2"
date: 2014-11-22 11:47
comments: true
categories: 
- Hexlife
tags: [hexagonal grid, game of life, ca, cellular automata]
---

Yesterday while fooling around, I wanted to build a tri-star, but I made a mistake and made this instead:

![Alt text](/images/hexlife/semistill-seed.png)

But to my surprise I did not find a tri-star, instead this grew out of it:

![Alt text](/images/hexlife/Y-semistill.png)

Since I had made changes to tint different generations with different colors, I wanted to test it. Wondering if I had introduced bugs, I went through my git history to make sure everything was fine. After reverting, it turned out I hadn't. It was just a variation I had never tried.

In my [earlier post](/blog/2014/11/21/hexlife/), I said that still lifes could not exist under the rules because cells could not live long enough, but these structures persisted. In other words, they were non-transient cells.

It turns out that most of the cells here had 3 neighbours, and that gave them a long lease on life. Also, all the way along the columns, there were no dead cells that had 2 cell neighbours, meaning that the cells would never die because of their spawn.

However, the ends are kept alive by an interesting "flower" oscillator that resembles the twinkling star oscillator, and this keeps the entire structure alive. Basically, you can make an infinitely long structure, but you must place the oscilators at the ends.

Armed with this knowledge, I set out to create a simpler column.

![Alt text](/images/hexlife/I-semistill.png)

I call this kind of life form a Semi-still life, since a large proportion of it can be unchanging, but must be supported by oscillation.

Perhaps there are more of these under these rules...
