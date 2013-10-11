---
layout: post
title: Regex Escapees
categories:
- Programming
tags:
- .net
- characters
- escape
- regex
- snippet
status: publish
type: post
published: true
meta:
  _edit_last: '2'
---
Sometimes when one writes regexes, Its hard to know what needs to be escaped and what doesn't. But I've solved that problem while I was writing a program that generated my regexes for me. Now I have a snippet that both humans and programs can use to write regexes!

This is for the .NET flavor of Regex.

``` csharp
private static string SanitizeToken(string token) 
{
	return token
					.Replace(@"\", @"\\")
					.Replace("*", @"\*")
					.Replace("?", @"\?")
					.Replace("+", @"\+")
					.Replace("{", @"\{")
					.Replace("}", @"\}")
					.Replace("^", @"\^")
					.Replace("$", @"\$")
					.Replace(".", @"\.")
					.Replace("[", @"\[")
					.Replace("]", @"\]")
					.Replace("(", @"\(")
					.Replace(")", @"\)")
					.Replace("|", @"\|");
}
```
