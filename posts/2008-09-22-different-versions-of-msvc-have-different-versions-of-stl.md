---
layout: post
title: Different versions of MSVC have different versions of STL
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
Something that I have only recently noticed only after I have used MSVC for a while is that different versions of MSVC use different versions of the C++ standard template library. This isn't a problem, unless you are linking libraries statically that were built with different versions of MSVC. For example, a static library that uses the STL built with MSVC 2003 would not be linkable with a program built with MSVC 2005 without a considerable amount of dicking around.

This is weird, because the STL is meant to be portable and make programs portable. It appears that Microsoft's STL are not only a set of headers, but also a corresponding set of libraries that contain a set of functions that are used by the STL.

If you attempt to link a library built with a version of MSVC with a program built with another version of MSVC, the compiler will complain because it is unable to find references to the functions the library's version of the STL calls.

The obvious way around this would be to link all the libraries the library depends on into itself, but that would cause problems with compiling with the same version of MSVC, and even more so when you are using static libraries that were all compiled with different versions of MSVC.

Usually you wouldn't worry about this unless you are creating libraries to be used by other people, or using libraries written by other people. I wonder what Microsoft has against one STL to rule them all? So how do we get around this? Easy answer: You don't use the STL.
