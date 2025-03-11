---
layout: post
title: Exceptionless Programming
categories:
- Programming
tags:
- C++
- exceptionless
- practice
- programming
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
comments: true
---

I am a big fan of writing code that generates no runtime errors. This is an implementation of a function that takes the first element of an array.

``` c++
template<typename T>
T first(std::vector<T> array)
{
	if (array.size() == 0) { throw EmptyArrayException(); }
	return array[0];
}
```

This is the standard way we are taught to write programs. However, there is another way to write this function that makes the exception unneccessary.

``` c++
template<typename T>
void first(std::vector<T> array, std::function<void(T)> returnCallback)
{
	if (array.size() == 0)
	{
		return;
	}
	returnCallback(array[0]);
}
```

Suddenly the program flow is dictated by the emptiness of the array. Besides knowing well that this function will never throw an exception, the program that uses it will be structured in such a way that you can guarantee within the scope of the returnCallback function that was passed in, the function will always have the first element of the array. You don't even have to check for nullness.

``` c++
int calcCheckSum(std::vector<int> sorted)
{
	int result = 0;
	first<int>(sorted, [&amp;](int a)
	{
		int& res = result;
		last<int>(sorted, [&amp;](int b)
		{
			res = a + b;
		});
	});
	return result;
}
```

And as a perk, if this function compiles, you know that it will run without errors.
