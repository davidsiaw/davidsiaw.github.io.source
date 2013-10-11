---
layout: post
title: That's Not The Point
categories:
- Programming
tags: []
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
---
Today I read an interesting chapter in Writing Solid Code, and it showed an example where a supposed optimization led to code bloat:

<blockquote>
To represent the hierarchical window structure, Character Windows used a binary tree in which one branch pointed to subwindwos, called "children" and the other branch pointed to windows with the same parent, called "siblings":
</blockquote>

``` c++
typedef struct WINDOW
{
	struct WINDOW *pwndChild;	/* NULL if no children */
	struct WINDOW *pwndSibling;	/* NULL if no brothers/sisters */
	char *strWndTitle;
	.
	.
	.
} window;		/* Naming: wnd, *pwnd */
```

<blockquote>
You can turn to any algorithm book and find efficient routines to manipulate binary trees, so I was a bit shocked to when I reviewed the Character Windows code for inserting a child window into the tree. The code looked like this:
</blockquote>

``` c++
/* pwndRootChildren is the pointer to the list of top-level windows
 * such as the menu bar and the main document windows.
 */
static window *pwndRootChildren = NULL;

void AddChild(window *pwndParent, window *pwndNewBorn)
{
	/* New windows may have children but not siblings... */
	ASSERT(pwndNewBorn->pwndSibling == NULL);

	if (pwndParent == NULL)
	{
		/* Add window to the top-level root list. */
		pwndNewBorn->pwndSibling = pwndRootChildren;
		pwndRootChildren = pwndNewBorn;
	}
	else
	{
		/*  If Parent's first child, start a new sibling chain;
		 *  otherwise, add child to the end of the existing
		 *  sibling chain.
		 */
		if (pwndParent->pwndChild == NULL)
		{
			pwndParent->pwndChild = pwndNewBorn;
		}
		else
		{
			window *pwnd = pwndParent->pwndChild;
			while (pwnd->pwndSibling != NULL)
			{
				pwnd = pwnd->pwndSibling;
			}
			pwnd->pwndSibling = pwndNewBorn;
		}
	}
}
```

<blockquote>
Despite the fact that the windowing structure was designed to be a binary tree, it hadn't been implemented that way. Since the root window (the one representing the entire display) never has siblings and never has a title and since you can't move hide or delete it, ... (cut short for tl;dr)... that led somebody to decide that declaring an entire window structure was wasteful, and the wndRoot structure was replaced with pwndRootChildren, a simple pointer to the top level windows.

Replacing wndRoot with a pointer may have saved a few bytes of data space, <b>but the cost in code space was enormous</b>.

</blockquote>

Forgive me for copying all that out verbatim, but I think that the complete background is needed to make the point clear. Here's the code that was supposed to be written that's found later in the article:

``` c++
/* pwndDisplay points to the root-level window, which is
 * allocated during program initialization
 */
window *pwndDisplay = NULL;

void AddChild(window *pwndParent, window *pwndNewBorn)
{
	/* New windows may have children but not siblings... */
	ASSERT(pwndNewBorn->pwndSibling == NULL);

	/*  If Parent's first child, start a new sibling chain;
	 *  otherwise, add child to the end of the existing
	 *  sibling chain.
	 */
	if (pwndParent->pwndChild == NULL)
	{
		pwndParent->pwndChild = pwndNewBorn;
	}
	else
	{
		window *pwnd = pwndParent->pwndChild;

		while (pwnd->pwndSibling != NULL)
		{
			pwnd = pwnd->pwndSibling;
		}
		pwnd->pwndSibling = pwndNewBorn;
	}
}
```

Any experienced programmer in C would have noticed two things:
<ul>
<li>There was a forced special case</li><li>The cost of the optimization was greater than the yield of the optimization</li>
</ul>
But anyone can see that. Its obvious because he said it. However, mentioned this common mistake to a couple of colleagues and said that I did make the same kind of mistake, and this is what they said:

<blockquote>
Sometimes code that was written back then may be correct back then, but may not be correct now. Just as I wrote an optimization once because computers were not fast enough to handle a certain operation at the time. They do now so that piece of code actually slowed the program down. Also, Opera recently made its engine less memory intensive but more CPU intensive, but after complaints that Opera was taking too much memory, they changed it to be less CPU intensive and more memory intensive. It's also a balancing act with more input from your users.
</blockquote>

The first thing that came to my mind was "Are you listening?" I am not sure if they were trying out of kindness to make me feel better that I make these bugs because of very good reasons and that the badness is unforseeable or that they were just in their own world going off in a skew. Besides the fact that its clearly the latter and that this is not a tradeoff problem nor was it a "we needed it at the time" problem, since it should have been obvious that the supposed optimization was going to cost more than it was worth in memory space alone at the time of writing the code. 

I, like many fellow humans am prone to thinking about the more negative side of this. Of course, this was meant to be a negative post, but on the flipside, I learned three mistakes about fellow programmers that I must remember not to make myself.
<ol>
<li>Winging it</li><li>Optimizing with a narrow view</li><li>The code I write is always flawless. I'll fix it later if I have to.</li>
</ol>
Firstly, winging it and not paying attention to the details of the problem is a fatal mistake I have been guilty of countless times, and have seen many people fall in to as well. our minds are complex-averse, and tend to try and group things into simple groups of things that share the same characteristics based off keywords in a conversation without really understanding it. In this case, my mention of optimization kicked off the ideas of past optimization and tradeoffs in my colleagues' heads, and was unfortunately all that occupied their heads from that moment on.

Secondly, we programmers are often indulged in our own mindset and steamroll our way through because our egos are big and our power limitless. When we see something that could be good, like an optimization, we tend to bulldoze our way to make sure it gets done.

Thirdly, we programmers are idealists. Not just in the sense that we want everything to be perfect, but we see perfection in everything we write too. This blindness can cause a lot of grief, and the defence is usually "I had no choice at the time", which is usually an excuse to cover up a more embarrassing mistake.

Finally, coming back to topic after a very very long strayoff, the whole idea of humans and sad facts of software is not the point. The point of the article from the book is to <b>tell you someone's mistake so you don't make it</b>, because if this one word of caution saved a bug in a simple subsystem, imagine the number of bugs that would be saved in a complex system of 100 subsystems. These are the kinds of articles books should be packed full of.
