---
layout: page
title: "octopress cheat sheet"
date: 2014-01-17 10:56
comments: true
sharing: true
footer: true
---

Create a new post
	rake new_post["title"]
 
Create a new page
	rake new_page["title"]

Re-build the site including any recent changes
	rake generate
 
Run WEBrick server locally on port 4000
	rake preview
 
Push changes to github (master branch)
	rake deploy
 
Commit recent changes and push to github (source branch)
	git add .
	git commit -m 'description of commit'
	git push origin source