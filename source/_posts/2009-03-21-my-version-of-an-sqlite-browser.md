---
layout: post
title: My version of an SQLite Browser
categories:
- Programming
tags: []
status: draft
type: post
published: false
meta:
  _edit_last: '2'
comments: true
---
<iframe width="420" height="315" src="//www.youtube.com/embed/wipug2xJx-A" frameborder="0" allowfullscreen></iframe>

Having used an SQLiteBrowser available for free on Sourceforge, I felt that it didn't handle big datasets as well as I would have liked, and wasn't responsive enough when I wanted to browse through large tables. So I decided that I should make own one since I had so many complaints.

I call it "SQLyte" its written with C# and .NET. I'm releasing this application under the GPL V3 (meaning it includes sources!). I'm not including a help file since anyone who would work with SQLite databases would know exactly how to operate it. You can watch the video below if you want to know more about this program.

You can compile this program if you so wish to using Visual Studio 2008. You'll need to make your own private key. If anyone wishes to port this to Linux/Mono you are welcome to do so. Please drop me a line if you do! Also, if you feel there's something the program doesn't do so well, or you feel it just needs something, <a href="https://bugs.launchpad.net/sqlyte">file a bug</a>!

You can check out the sources by branching this: 

<pre lang="bash">
bzr push lp:~davidsiaw/sqlyte/sqlyte
</pre>

Here are some x86 binaries compiled with a strong name that's only available from bunnylabs:

<a href="http://labs.astrobunny.net/downloads/sqlyte.zip">http://labs.astrobunny.net/downloads/sqlyte.zip</a>

Edit: Yes, you can modify the tables and use any INSERT, CREATE or DELETE query you like on your database.
