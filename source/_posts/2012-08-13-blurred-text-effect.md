---
layout: post
title: Blurred Text Effect
categories:
- Programming
tags:
- blur
- css
- effect
- span
- style
- text
status: publish
type: post
published: true
meta:
  _syntaxhighlighter_encoded: '1'
---

I came across a strange site that blurred the text of answers and asked the reader to sign up to see it. It was strange because the text was already there, just blurred via css. I thought it was an interesting little snippet so I decided to record it.

<span style="color:transparent; text-shadow:0 0 7px #777">This is how it blurs</span>.

``` css
.blurred_text {
	color: transparent;
	text-shadow: 0 0 7px #777;
}
```
