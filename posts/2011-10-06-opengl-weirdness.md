---
layout: post
title: OpenGL weirdness
categories:
- Programming
tags:
- display list
- glbegin
- OpenGL
- performance
- tight loop
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
comments: true
---
Try this:

``` c++
        dispList = glGenLists(1);

        glNewList(dispList, GL_COMPILE);

        for(int x=-768; x<768; x++)
        for(int y=-768; y<768; y++)
        {
            glBegin(GL_QUADS);
                glColor3f((double)(rand() % 100) / 500, 
			(double)(rand() % 100) / 100, 0);
                glVertex3i((x)  * 1, (y)  * 1, 0);
                glVertex3i((x+1)* 1, (y)  * 1, 0);
                glVertex3i((x+1)* 1, (y+1)* 1, 0);
                glVertex3i((x)  * 1, (y+1)* 1, 0);
            glEnd();
        }

        glEndList();
```

and render your display list. Then, try this:

``` c++
        dispList = glGenLists(1);

        glNewList(dispList, GL_COMPILE);
        glBegin(GL_QUADS);	// <- the subtle difference is here

        for(int x=-768; x<768; x++)
        for(int y=-768; y<768; y++)
        {
                glColor3f((double)(rand() % 100) / 500, 
			(double)(rand() % 100) / 100, 0);
                glVertex3i((x)  * 1, (y)  * 1, 0);
                glVertex3i((x+1)* 1, (y)  * 1, 0);
                glVertex3i((x+1)* 1, (y+1)* 1, 0);
                glVertex3i((x)  * 1, (y+1)* 1, 0);
        }
        glEnd();		// <- and here

        glEndList();
```

I don't know if its my graphics drivers, or graphics card or perhaps just me, but the top code maxed out at 60 fps while the bottom code ran at ~10 fps.

Oh, and don't ask me why I'm using display lists.
