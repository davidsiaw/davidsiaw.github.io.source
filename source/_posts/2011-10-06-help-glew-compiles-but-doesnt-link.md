---
layout: post
title: Help! GLEW compiles but doesn't link!
categories:
- Programming
tags:
- '2010'
- external
- glew
- msvc
- symbol
- unresolved
- visual studio
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
---
When you compile the glew_static project from glew on Visual Studio and link it with your program, you may get something like this:

```
app_init.obj : error LNK2001: unresolved external symbol __imp__glewInit
worldscene.obj : error LNK2001: unresolved external symbol __imp____glewBufferSubData
worldscene.obj : error LNK2001: unresolved external symbol __imp____glewBufferData
worldscene.obj : error LNK2001: unresolved external symbol __imp____glewBindBuffer
worldscene.obj : error LNK2001: unresolved external symbol __imp____glewGenBuffers
```

<a href="http://labs.astrobunny.net/wp-content/uploads/2011/10/wpid-glewstatic.jpg" rel="lightbox"><img src="http://labs.astrobunny.net/wp-content/uploads/2011/10/wpid-glewstatic.jpg" alt="" title="Picture" width="487" height="359" class="alignnone size-medium wp-image-1204" /></a>

It's easy to fix. Just add GLEW_STATIC to the preprocessor definitions and you're done. This is because without it the header specifies dllimport instead of just extern, which is needed for static linkage.
