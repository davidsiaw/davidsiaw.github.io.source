---
layout: post
title: "Adjacency in a Grid"
date: 2020-05-04 13:07:56 +0900
comments: true
categories: 
- Programming
tags:
- c
- bittwiddling
---

Many times when I have to deal with grids and adjacency, I always come up with a solution that results in difficult to understand code that makes no sense to anyone who uses it. Here I will try and explain my system to defining adjacency in a square grid and why I use it.

Consider a grid where you stand on AA and you want the coordinates for the things around you.

```
00 00 00
00 AA 00
00 00 00
```

I will for this thing assume you have a simple expression to convert your xy coordinates to position in an array

```
pos = y * width + x;
```

Lets not consider the diagonals for now and concentrate on just the sides. I usually set numbers to define directions:

```
LEFT  = 0
RIGHT = 1
UP    = 2
DOWN  = 3
```

These numbers seem arbitrary but there is a reason to them, in binary these numbers are

```
LEFT  = 00
RIGHT = 01
UP    = 10
DOWN  = 11
```

When you do this its now possible to get adjacent cells like this:

```
int oper = dir << 1;
int d[2] = {0, 0};
d[oper >> 2] = (oper & 10) - 1;
diff = d[0] + d[1] * width;
```

Let's unpack that. The numbers we chose for each direction lets us assign a meaning to each of the bits, so we have one bit for direction, and one bit for dimension:

```
00 <- direction bit
^
dimension bit
```

Using this arrangement, first we assume we are on the X axis, and if its a 1 we want to move forward and if its 0 we want to move backwards. This means we have to convert 0 to -1 and 1 to 1. We can do this by subtracting 1 from 2 times the direction bit.

```
int dx = (2 * dir & 1) - 1;
```

Next, we want to use the dimension bit to choose a dimension. This is straightforward because we simply create an array with two elements, and use the dimension bit to index the array.

```
int d[2] = {0, 0};
d[dir >> 1] = dx;
```

Since we are walking a one dimensional array, we can simply substitute each bit of the directions int our array:

```
diff = d[0] + d[1] * width;
```

Putting it all together, we have

```
int dx = (2 * dir & 1) - 1;
int d[2] = {0, 0};
d[dir >> 1] = dx;
diff = d[0] + d[1] * width;
```

We realize that anything multiplied by two is just a left shift, so we first of all shift the entire number up one bit. (I will show why we do the entire number instead of the direction bit later)

```
int oper = dir << 1;
```

And then `dx` simply becomes

```
int oper = dir << 1;
int dx = (oper & 10) - 1;
```

Lets get rid of `dx` since its so simple now, and we can use oper as well with a down shift of 2, but it doesn't really matter. Both are equally fast.

```
int oper = dir << 1;
int d[2] = {0, 0};
d[oper >> 2] = (oper & 10) - 1;
diff = d[0] + d[1] * width;
```

By making this a function, we can use it to produce an amount we can move in the array to where we want to be:

```
int pos_of(Dir dir)
{
  int oper = dir << 1;
  int d[2] = {0, 0};
  d[oper >> 2] = (oper & 10) - 1;
  return d[0] + d[1] * width;
}
```

Using this, say we have the position somewhere in the array

```
us = arr[x];
```

## Usage

We can simply add our movement into the position to give us the say, cell below ours:

```
below = arr[x + pos_of(LEFT)];
```

If we wanted to access all the side cells, we just have to loop through all of the 4 numbers.

```
for(int i = 0; i < 4; i++)
{
  arr[x + pos_of(4)] = 0; /* Set all adjacent cells to 0 */
}
```

## Diagonals

Say we want to also do diagonals, then we modify our map to this

```
111 010 101
000 AAA 001
100 011 110
```

I usually set a bunch of values for this:

```
LEFT UP    -> 10 00 -> 100
RIGHT DOWN -> 11 01 -> 101
RIGHT UP   -> 10 01 -> 110
LEFT DOWN  -> 11 00 -> 111
```

This way we can add to our directions enum:

```
TOPLEFT     = 4
BOTTOMRIGHT = 5
TOPRIGHT    = 6
BOTTOMLEFT  = 7
```

Our function then becomes:

```
int oper = (dir & 3) << 1;
int d[2] = {0, 0};
int idx = (oper >> 2);
int diag = (dir >> 2);
int second = (oper & 10) ^ (dir & 10);
d[idx] = (oper & 10) - 1;
d[~idx & 1] = (second - 1) * diag;
diff = d[0] + d[1] * width;
```

Now, lets analyze this again. First of all, notice that the new directions all have an extra bit set, this bit is what I call the diagonal bit. We first of all need to remove this diagonal bit from our original `oper` variable, because it will cause a buffer overflow.

```
int oper = (dir & 3) << 1;
int d[2] = {0, 0};
d[oper >> 2] = (oper & 10) - 1;
diff = d[0] + d[1] * width;
```

By masking out our `oper` bit, now the function behaves as if it was

```
TOPLEFT     = LEFT
BOTTOMRIGHT = RIGHT
TOPRIGHT    = TOP
BOTTOMLEFT  = BOTTOM
```

However, since these are diagonals, we need to set the other dimension's diff as well. The missing directions then are:

```
TOPLEFT     = LEFT    TOP
BOTTOMRIGHT = RIGHT   BOTTOM
TOPRIGHT    = TOP     RIGHT
BOTTOMLEFT  = BOTTOM  LEFT
```

Since our second directions are `-1, 1, 1, -1` respectively, we need to use the XOR operator to produce them. Recall that `dir` values are

```
100
101
110
111
```

Using an XOR operator on the bottom two bits, we can create

```
100 -> 0
101 -> 1
110 -> 1
111 -> 0
```

Now we can go

```
int secondbit = ((dir & 1) ^ ((dir & 10) >> 1));
```

And then applying the `(x * 2) - 1` trick, we can essentially make that

```
100 -> 0 -> -1
101 -> 1 ->  1
110 -> 1 ->  1
111 -> 0 -> -1
```

By just applying

```
int second = secondbit * 2 - 1;
```

However, since we know that `oper` is `dir` shifted up one, we can instead just let `secondbit` operate in the 2nd bit field, without having to mask and shift `dir` down by one, we can just use it where it is, along with `oper`.

```
int second = (oper & 10) ^ (dir & 10);
```

Now that we have our second bit, all we need to do is assign it to the dimension that was not assigned to.

```
int oper = (dir & 3) << 1;
int d[2] = {0, 0};
int second = (oper & 10) ^ (dir & 10);
d[oper >> 2] = (oper & 10) - 1;
d[~(oper >> 2) & 1] = second - 1;
diff = d[0] + d[1] * width;
```

But we aren't done yet, we only need the second dimension to be filled if the diagonal bit is set, so we need to do this:

```
int diag = (dir >> 2);
```

And simply multiply the diagonal bit in, to mask it out.

```
int oper = (dir & 3) << 1;
int d[2] = {0, 0};
int diag = (dir >> 2)
int second = (oper & 10) ^ (dir & 10);
d[oper >> 2] = (oper & 10) - 1;
d[~(oper >> 2) & 1] = (second - 1) * diag;
diff = d[0] + d[1] * width;
```

We are also repeating ourselves by going `oper >> 2` so we go

```
int oper = (dir & 3) << 1;
int d[2] = {0, 0};
int diag = (dir >> 2)
int second = (oper & 10) ^ (dir & 10);
int idx = oper >> 2;
d[idx] = (oper & 10) - 1;
d[~(idx) & 1] = (second - 1) * diag;
diff = d[0] + d[1] * width;
```

Now you can use this to access all 8 squares around by iterating from 0 to 7, or simply iterate from 0 to 4 to get adjacent squares only.

```
for(int i = 0; i < 8; i++)
{
  arr[x + pos_of(i)] = 0; /* set all 8 surrounding squares */
}
```

Obviously this is very much a toy example and you will still have to check bounds and manage datatypes yourself, but it gives a very nice set of shortcuts to anyone who wishes to work easily on a grid, and hopefully will go some way to explaining the bit twiddling I do when I work on grids.
