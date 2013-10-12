---
layout: post
title: Vertex Buffer Objects
categories:
- Graphics
- Programming
tags:
- buffer
- enhancement
- intermediate mode
- objects
- OpenGL
- performance
- vbo
- vertex
status: publish
type: post
published: true
meta:
  _edit_last: '2'
comments: true
---
In my last post I mentioned that if you wanted to draw a large number of things on a screen, you need VBOs. Well, honestly at the time, I only knew what it was but never touched it before. VBOs are Vertex Buffer Objects, in other words, boxes in the GPU to store vertices, their colors, normals and attributes. After a considerable amount of Googling, I was finally able to learn what VBOs are and relate them to the intermediate mode. This would probably help those who have started openGL by learning glBegin and glEnd learn about what VBOs truly are, and why they exist.

<!--more-->

The first difference is, in intermediate mode, one would send vertices one by one to the GPU inside glBegin and glEnd blocks, so openGL can draw them to a screen. Using a VBO, however, you get to send a whole pile of vertices to the GPU at once, and save them there, and when you refresh the screen, all you need to do is tell the GPU where the vertices are and they will get drawn to the screen. Alright, lets look at some code to illustrate this: (this is the refresh function by the way, which gets called every frame, stolen from the previous post)


{% codeblock lang:c++ Intermediate mode %}
void refresh()
{
	glBegin(GL_QUADS);
 
		glColor4f(1.0,0.0,0.0,1.0);		
		glVertex3i( 250, 250, 0 );
 
		glColor3f(0.0,1.0,0.0);
		glVertex3i( 300, 250, 0 );
 
		glColor3f(0.0,0.0,1.0);
		glVertex3i( 300, 300, 0 );
 
		glColor3f(1.0,1.0,1.0);
		glVertex3i( 250, 300, 0 );
 
	glEnd();
}
{% endcodeblock %}

{% codeblock lang:c++ Vertex Buffer Object %}
void refresh()
{
	glBindBuffer(GL_ARRAY_BUFFER, vbo);     // Use the buffer called 'vbo'

        glVertexPointer(3, GL_FLOAT, 0, 0);     // The vertex information start at 0, and have 3 numbers
        glColorPointer(3, GL_FLOAT, 0, (void*)( sizeof(vertices) ));    // The vertex information start at offset (sizeof(vertices)) and have 3 numbers

        glDrawArrays(GL_QUADS, 0, 4);     // Draw quads. You should find 4 complete vertices and colors in the places I just mentioned
}
{% endcodeblock %}

Whoa whoa now, how does openGL know what to draw in the second refresh function, and where did the variables 'vbo' and 'vertices' come from? You may ask. Well, the secret lies in the initialization, or what happens before we start flipping buffers. Which brings us to the second difference between Intermediate Mode and VBOs: You need to give the vertex buffer objects to the GPU first, then, you just tell the GPU "hey, I wanna draw the stuff I told you about". Here is the initialization code for the VBO refresh function you just saw:

``` c++
GLuint vbo;

GLfloat vertices[] = {
	250.0, 250.0, 0.0, 
	300.0, 250.0, 0.0, 
	300.0, 300.0, 0.0,
	250.0, 300.0, 0.0};

GLfloat colors[] = {
	1.0,0.0,0.0, 
	0.0,1.0,0.0, 
	0.0,0.0,1.0, 
	1.0,1.0,1.0};

void initvbo()
{
	glGenBuffers(1, &vbo);      // Can I has 1 buffer
	glBindBuffer(GL_ARRAY_BUFFER, vbo);     // The buffer is for an array of floats

	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices)+sizeof(colors), 0, GL_STATIC_DRAW);   // The buffer is empty
	glBufferSubData(GL_ARRAY_BUFFER, 0, sizeof(vertices), vertices);    // Starting from zero to (sizeof(vertices)), copy the contents of vertices to the buffer
	glBufferSubData(GL_ARRAY_BUFFER, sizeof(vertices), sizeof(colors), colors);    // Starting from (sizeof(vertices)) to (sizeof(colors)) later, copy the contents of the array colors to the buffer.

        glEnableClientState(GL_COLOR_ARRAY);    // Make it so that you can use color arrays
        glEnableClientState(GL_VERTEX_ARRAY);  // Make it so that you can use vertex arrays
}
```

Basically, the before you tell the GPU what to draw, you need to tell it how to draw it first. In Intermediate mode, you tell the GPU how to draw shapes in every frame, so there is no initialization code, but using a VBO, you tell the GPU how to draw shapes once, and tell it to draw it every frame. This doesn't seem like a very useful thing until your program starts slowing down when you have too many things on the screen in Intermediate mode. VBOs solve that problem by avoiding having to send vertices to the GPU all the time like in intermediate mode, which takes a while. 

Why? Imagine a group of school children that go to school every day. Every day (Intermediate mode) they will need to ride a bus to school and back home, which wastes petrol, makes noise, and ruins the environment (especially by paper planes thrown out by the kids). However, it would be great if you could just (VBO) send them to a boarding school once, and let them get all the discipline in the world that they need without having to worry about them being late for the bus. Advantages: less wasted time, more real work done.

So if you are using Intermediate mode to draw the City of Paris, remember that you can use VBOs to speed up the process.
