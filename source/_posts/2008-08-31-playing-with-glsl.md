---
layout: post
title: Playing with GLSL
categories:
- Graphics
- Programming
tags:
- example
- glsl
- intermediate mode
- OpenGL
- simple
status: publish
type: post
published: true
meta:
  _edit_last: '2'
---
After puzzling some time over the tutorials in <a href="http://www.lighthouse3d.com/opengl/glsl/">Lighthouse3D</a>, I finally learned how to prepare a GLSL shader and use it in an OpenGL render. In the beginning I thought a shader could be used on a particular set of vertices and fragments. However, it turned out that the shader was run every frame on every vertex and fragment you gave OpenGL to use. This meant that if you made a simple fragment shader that coloured the current fragment red, then everything you draw on the screen will be red. It turns out the shader replaces the so-called fixed-functionality in the rendering pipeline, which is basically a little assembly line where all the vertices and colours given to the video card gets processed. So instead of having the workers work their normal routine, a shader tells them what to do instead. To be honest I felt a little disappointed since I could not write something like actionscript would allow me to do, but I guess that is just because it isn't meant to be actionscript.

<!--more-->

For those of you who are wondering how you go about using GLSL, here's a simple example that I used in my code:

``` c++
const char* fshadersource = 
	"void main()"
	"{"
	"	mat4 tform = mat4("
	"	1/200.0,0,0,0, "
	"	0,1/200.0,0,0, "
	"	0,0,1/200.0,0, "
	"	1.0,1.0,1.0,1.0);"
	"	vec4 comp = vec4(0, 0, 0, 1.0);"
	"	gl_FragColor = gl_FragCoord * tform + comp;"
	"}"
;

const char* vshadersource = 
	"void main()"
	"{"
	"	gl_Position = ftransform();"
	"}"
;

void useProgram()
{

	glewInit();
	GLuint fshader = glCreateShader(GL_FRAGMENT_SHADER);
	glShaderSource(fshader, 1, &fshadersource, NULL);
	GLuint vshader = glCreateShader(GL_VERTEX_SHADER);
	glShaderSource(vshader, 1, &vshadersource, NULL);
	glCompileShader(fshader);
	printShaderInfoLog(fshader);

	glCompileShader(vshader);
	printShaderInfoLog(vshader);

	GLuint prog = glCreateProgram();
	glAttachShader(prog, fshader);
	printProgramInfoLog(prog);

	glAttachShader(prog, vshader);
	printProgramInfoLog(prog);

	glLinkProgram(prog);
	printProgramInfoLog(prog);

	glUseProgram(prog);

}

void draw()
{
	glLoadIdentity();
	
	glBindTexture( GL_TEXTURE_2D, 0 );
	glBegin(GL_QUADS);

		glColor4f(1.0,0.0,0.0,1.0);
		glVertex3i( 50, 50, 0 );

		glColor4f(0.0,1.0,0.0,0.2);
		glVertex3i( 100, 50, 0 );

		glColor4f(0.0,0.0,1.0,1.0);
		glVertex3i( 100, 100, 0 );

		glColor4f(1.0,1.0,1.0,1.0);
		glVertex3i( 50,100, 0 );

	glEnd();

	glBegin(GL_QUADS);

		glColor3f(1.0,0.0,0.0);
		glVertex3i( 250, 250, 0 );

		glColor3f(0.0,1.0,0.0);
		glVertex3i( 300, 250, 0 );

		glColor3f(0.0,0.0,1.0);
		glVertex3i( 300, 300, 0 );

		glColor3f(1.0,1.0,1.0);
		glVertex3i( 250, 300, 0 );

	glEnd();
}

void init ()
{
	glShadeModel(GL_SMOOTH);		
	glClearColor(0.0f, 0.0f, 0.0f, 0.5f);				
	glClear( GL_COLOR_BUFFER_BIT );
	glDisable(GL_DEPTH_TEST);
	glHint(GL_PERSPECTIVE_CORRECTION_HINT, GL_NICEST);	
	glEnable (GL_TEXTURE_2D);							
	glEnable (GL_ALPHA_TEST); 
	glEnable (GL_BLEND); 
	glBlendFunc (GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
	glViewport( 0, 0, 800, 600 );

	int vPort[4];

	glGetIntegerv(GL_VIEWPORT, vPort);

	glMatrixMode(GL_PROJECTION);
	glPushMatrix();
	glLoadIdentity();

	glOrtho(0, vPort[2], 0, vPort[3], -1, 1);
	glMatrixMode(GL_MODELVIEW);
	glPushMatrix();
	glLoadIdentity();
}

```

{% img /images/blogimages/glsl.png %}

In the code, I show the init() and draw() routines to show the code that I used to test this. The useProgram() routine is the actual meat that was useful in preparing the GLSL code and using it. Here, the vertex shader still uses the fixed-functionality, but the fragment shader uses a simple transformation matrix to convert the coordinates of a certain fragment to its color. In this case, it makes any point near the top left of the screen green and any point near the bottom left of the screen red. Any other point on the screen would be yellowish.

You will find that the shader program only replaces the fixed functionality of the video card's pipeline, which means that it can't really generate new vertices or draw new stuff on the screen. You still need to tell OpenGL what to render with glBegin(GL_QUADS), which means it really doesn't help you if you want to render a lot of stuff. If you want to upload a set of vertices to the video card once and for all, you'd probably want to use stuff like VBOs.
