---
layout: post
title: C is the new Assembler
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

As far back as I can tell, while I have used C, there was never a time when I didn't have to write abstractions to make it easier to see that I am doing something in particular. Every knowledgeable C programmer would know that abstractions tend to make code easier to read, reducing the cost of maintenance, but it also incurs a performance penalty, as a result of data structure translations and additional function calls.

``` c++
void ReadArray(Array arr, PopulateCallback cb, void* data)
{
	for (int i=0; i<GetCount(arr); i++)
	{
		void* elem = GetElement(arr);
		cb(elem, data);
	}
}
```

This is because C was written to make assembler easier to write accurately for whatever machine it was compiled for. It was a method to allow UNIX to present the same face to the programmer no matter what machine it ran on, by abstracting commonly used concepts when dealing with hardware and operating systems. Thus the concept of pointers, packing, memory management and low-level optimizations are important in the language.

``` c++
#define INITIALSIZE 32
Hashtable* CreateHashtable()
{
	Hashtable* h = malloc(sizeof(Hashtable));
	h->array = malloc(sizeof(INITIALSIZE));
	h->arraysize = INITIALSIZE;
	h->hashfun = &implePrimeHashFunc;
	return h;
}

void DeleteHashtable(Hashtable* h)
{
	free(h->array);
	free(h);
}
```

However, that is operating systems. Fast forward to the modern real world, which requires programs to
easily maintainable, and highly flexible when responding to code changes, layer after layer of abstraction is piled on top of each other to make the seemingly mundane tasks of sorting arrays and creating hashtables, or even responding to a user's keyboard possible. The reason for this is the low levelness of C. C does not have first class support for concepts that have arisen from real-world requirements and sensible programming techniques, such as closures, currying, lambdas and automated memory management.

``` csharp
class Program
{
	static void Main (string[] args)
	{
		Dictionary<int,int>; mapOfEmployeeNumberToAge = new Dictionary<int,int>();
		mapOfEmployeeNumberToAge.Add(5,6);
	}
}
```

This was because operating systems never had the luxury of being supported by a complete set of libraries. They have to stand on their own and can only depend on themselves. This meant that if one were to write an operating system for many machines, one needed an abstract form of assembler to be able to write for many platforms. Because C allowed OSes to present the same face across all platforms, it seemed the perfect choice at the time to write in C too, and it probably was.

``` c
FILE* fp = fopen("five.txt","w");
fprintf(fp, "%d", 5);
fclose(fp);
```

Looking at things this way, C is really just an abstract assembler, abstracting the single instructions into recognizable concepts such as pointers and associating them with types to reduce mistakes. In reality, nothing has changed in software development world ever since the 1970's when UNIX was conceived. People are still writing in assembler. There is nothing wrong with it, but the tediousness of having to abstract simple tasks has driven up the cost of writing software lately as complexity has increased tremendously.

``` c
short a = 0x1234;
short b = a;
```

``` nasm
mov ax, 1234h
mov bx, ax
```

However, mankind has probably learned the hard way that eventually there was need for better languages, and came up with many different languages such as Java, C++, C#, D, Processing, Python. All of which attempt to improve on C by introducing concepts absent in C that were highly desired by programmers. However, in an egoistic attempt to reach for the stars, they have all been made to compile directly to assembler, and thus end up still less portable than C and also perform slower as a result of those abstractions. In almost 40 years of development with C, it can be said that there is no other language more portable and no other language whose compilers are more capable of optimization than those for C.
<pre>error CS0006: cannot find metadata file `System.Windows.Forms.dll'Compilation failed:</pre>
One comes to wonder why, if there already are so many languages that can cover the shortcomings of C, they still cannot interoperate with C without an incredibly large amount of glue code and abstraction systems? All this makes for an extremely difficult situation which people have to bear with when they write for portability. Perhaps it is because the desires of proprietary lock ins done by companies such as Microsoft to promote this trend, to push their products such as COM/OLE and .NET which they preach as superior interop systems, yet fall short of achieving the very thing they are made to do, in order to prevent interop outside of Windows.

``` csharp
class NativeHashtable
{
	[DllImport("mydll")]
	static extern IntPtr CreateHashTable();
}
```

I propose that we leverage the existing codebase and toolchains that have made C so widely used and so well supported to make it simpler to write portable programs. This has many advantages: First, by targeting a subset of C that can be compiled by any existing C compiler at all, one effectively moves the repetitous task of writing abstractions and custom data structures to provide a code base from which programs can work on to the compiler specific to the language, and allowing the C compiler to provide the powerful optimization capabilites. Such a language that targets C will also find itself in a good position, since C already is compilable on many platforms, a language that targets C will be compilable too on many platforms.

``` c++
int NearestPow2(int n)
{
	int x = 1;

	while(x < n) {
		x <<= 1;
	}

	return x;
}
```
Also, compilers written for another language can perform their own optimizations in C code, which is what humans do, and maintain the rest of the program's data structures instead of having a human being do it, which is error prone and usually inconsistent. It also allows a program to write code effectively with one convention and allows one to automate the task of documenting hacks, tasks and tricks such as flag-reading, wrapping function pointers and checking datatypes, and maintaining structures and functions which use them, which is usually a choke point that requires extreme discipline from programmers and usually is tedious and takes up a lot of time.

``` c++
// Populate an array.
// The PopulateCallback will be called as many times as there are elements in the array
// It will be given a pointer to a particular point in the array and it is cb's duty to modify
// the contents of each cell.
// data is any generic data that you can provide your cb for its use.
void PopulateArray(Array arr, PopulateCallback cb, void* data);
```

Writing such a compiler would also be easier than writing a compiler that targets assembler. There are more people who know C than people who know assembler, and it is an easy language to write automatically, since the same things are done over and over again when we write C code, in the form of maintaining declarations and definitions.

In order to target C for existing C compilers, one cannot realistically automate writing code for pure ANSI C. Instead, one must target a defined subset of C that resolves into machine code in a predictable way. There are many definitions out there such as C-- and CIL, however none of them have been put to significant practical use.
<pre>astrobunny@localhost$ ./program.cexe</pre>
<pre>C:\> cil program.cexe</pre>
If C were ever to be a target for modern languages, and used as an intermediate language for just-in-time compilation by compilers which have already abstracted system calls specific to a platform, one may finally be able to achieve the task that portability proponents have always longed for, with the performance to boot. C is the most portable language on Earth. Why not make the most of it?
