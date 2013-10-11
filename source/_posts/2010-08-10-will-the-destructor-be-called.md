---
layout: post
title: Will the destructor be called?
categories:
- Programming
tags:
- C++
- destructor
- exception
- throw
- will it happen
status: publish
type: post
published: true
meta:
  _edit_last: '2'
  _syntaxhighlighter_encoded: '1'
---
Here's a C++ quiz for all of you: somefunc() will be called from a thread. Do you think this destructor will be called?

``` c++
class A {
public:
	A () {
		printf("Constructor\t");
	}

	~A() {
		printf("Destructor\n");
	}
};

int somefunc () {
	A inst;
	int* a = 0
	*a = 1;
	return 0;
}
```
