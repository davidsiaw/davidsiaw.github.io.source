---
layout: post
title: The Identity of an Array
categories:
- Programming
tags:
- array
- compiler
- identity
- languages
- programming
- type safety
- unit types
status: publish
type: post
published: true
meta:
  _syntaxhighlighter_encoded: '1'
comments: true
---

Given two arrays of integers: a and b, what does (a == b) mean?

Most of us will say, it depends on the programming language you are using, and that is true. In the case of C, it means a and b are the pointers to the start of the same array. In Java and C# it means the arrays are Reference Equal, basically meaning that the pointer to the arrays a and b are the same.

But how is that really useful? If you passed around these two arrays and checked if the references are the same, you are really just comparing the object with itself or not. The object is never going to be equal to anything else but itself. Even another array created in a different part of the program that has exactly the same integers in it in the same order will be a different array.

One would agree that [1, 2, 3] and [1, 2, 3] are the same but if these two arrays were created at different places the == operator will return false. Why is the extra information that the arrays are made in two different places important to the == operator? It makes no sense when you look at arrays as a list of numbers, and not a pointer into memory, which is an implementation detail.

So if we were to write a better == operator for arrays, what would it be?

```
[1,2,3,3] == [1,2,3,3] -> true
[1,2,3,3] == [3,2,1,3] -> ?
[1,2,3,3] == [1,2,3,1,2,3] -> ?
[1,2,3,3] == [2,3,1] -> ?
[1,2,3,3] == [1,2,3] -> ?
[1,2,3,3] == [1233] -> ?
[1,2,3,3] == "1233" -> ?
```

We suddenly see that the array's identity changes depending on what you are using it for. Let us replace those question marks with context.

```
[1,2,3,3] == [1,2,3,3] -> true if the array is an ordered list
[1,2,3,3] == [3,2,1,3] -> true if the array is an unordered list
[1,2,3,3] == [1,2,3,1,2,3] -> true if the array is a bag of numbers
[1,2,3,3] == [2,3,1] -> true if the array is an unordered set
[1,2,3,3] == [1,2,3] -> true if the array is an ordered set
[1,2,3,3] == [1233] -> true if the array is a collection of digits
[1,2,3,3] == "1233" -> true if the array is a string
```

The array is too general. It is actually really important that we know what the array represents. A whole bunch of things are arrays but are passed around as plain arrays. This causes maintainer programmers to wonder what exactly they represent.

Some cite performance reasons. Fair enough, passing a struct that contains an array and a set of methods to manipulate it in C is slower than just passing the struct around. C is a very low level language where implementation detail really mixes with requirements.

But why is it that so many other modern languages have this problem? Why isn't there a language that treats a set like a set, and has a compiler that really just compiles it down into an array?

Interestingly enough, this problem does not stop at arrays. Numbers have different meanings in different contexts too. Take for example the function Math.Cos in C#. This function takes a double in <i>radians</i>.

Why is it that the function signature is

``` c#
double Cos(double angle)
```

and not 

``` c#
ratio Cos(radians angle)
```

where radians is just a type of double?

If the compiler was fed this information the first place, programs like this:
```
degrees a = 40;
ratio r = Cos(a);
```

will cause the compiler to either throw a compiler error for passing degrees into a radians parameter, or generate code to convert degrees to radians.
