---
layout: post
title: Updated the b_pool!
categories:
- Programming
tags: []
status: publish
type: post
published: true
meta:
  _edit_last: '2'
comments: true
---
I've updated the b_pool again! This one has got some new features such as string functions (not yet complete) and a new b_resize function, which basically acts the same as realloc, except that if you are resizing the last block created on the pool, it will resize it without freeing. This makes it a lot faster and is perfect for string functions. I haven't tested it yet and its too late at night for me to test it. If anyone would be so keen to write some tests that will break the b_resize function?
