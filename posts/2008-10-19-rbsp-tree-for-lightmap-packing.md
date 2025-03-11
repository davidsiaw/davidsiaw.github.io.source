---
layout: post
title: RBSP Tree for Lightmap packing
categories:
- Graphics
- Programming
tags:
- algorithm
- bsp
- data
- demo
- lightmap
- packing
- rbsptree
- structure
- tree
status: publish
type: post
published: true
meta:
  _edit_last: '2'
comments: true
---
For fun, and for the purpose of making a batch texture that can store characters for fonts, I have created a little tree based off <a href="https://www.blackpawn.com/texts/lightmaps/default.html">this tutorial by BlackPawn</a>. Basically, the idea here is to partition the original rectangle in such a way to get the maximum area out of the texture to hold the subtextures.

The pseudocode provided in BlackPawn's site is based off a simple concept. Basically, you partition an empty rectangle to store an image, and the other resulting empty rectangles are candidates for future partitioning. I call this structure a Rectangular Binary Space Partitioning Tree.

<!--more-->

An RBSP tree works similar to a BSP, except it only splits two ways, horizontally or vertically. Hence the name. Here is how an RBSP tree is used to describe a rectangle for the purposes of lightmap packing.

{% img /images/blogimages/lightmap/boxsplit.png %}

In the image above, when an image wants to be put on a supertexture, the supertexture has to be split twice to create a box that is exactly the right size for the image. Notice that there is a major split and a minor split.

{% img /images/blogimages/lightmap/treeview.png %}

In order to remember how the rectangle is split, a tree is needed to describe the topography of the partitioning. Here, in the tree, each node describes a rectangle. Rectangles that have images become leaves and empty rectangles make up the branches.

Here we see when we want to insert an image, A gets partitioned into B and C, and B, which has the same height as the incoming image, gets partitioned again to D and E, with D having the same width as the incoming image.

In the next step, D has the perfect size for the incoming image, and takes the image and becomes a leaf. In the future, if there were more images to be inserted to the supertexture, either C or E could be partitioned to take the image, depending on which one can fit the image, and which is smaller.

You might realize now that the efficiency of this method is seen in the amount of wasted space in a supertexture, that are usually pockets of rectangles that are too small to fit any image in. If there are lots of pockets, there is a smaller chance that an image would fit into the supertexture, hence, the supertexture can hold less images that what it should be able to otherwise.

The biggest factor that influences the efficiency of this method is how you decide to partition a rectangle every time a new image comes in. As you have seen in the example above, a rectangle is seldom the same size as an image, so often, the rectangle has to be partitioned two ways. There is a major and minor split, and one has to decide which split is horizontal, and which split is vertical.

The heuristic provided by BlackPawn's pseudocode is the best splitting heuristic I know of yet, though there could be an even more efficient way of deciding which way to cut the rectangle for minimal wasted space.

Another way to increase the efficiency of the packing is to sort the images by size. Big ones go in first, followed by smaller ones. This makes sense, because smaller ones are more likely to create small rectangles as a result of their major partitioning, which cannot fit larger images, and wastes space.

Here's a video of the lightmap packing structure in action:

<object width="425" height="350"> <param name="movie" value="https://www.youtube.com/v/No0Ykk2mMNo"> </param> <embed src="https://www.youtube.com/v/No0Ykk2mMNo" type="application/x-shockwave-flash" width="425" height="350"> </embed> </object>
