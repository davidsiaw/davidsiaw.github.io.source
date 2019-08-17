---
layout: post
title: "Working with mruby"
date: 2019-08-17 22:55:01 +0900
comments: true
categories:
- Programming
tags:
- mruby
- c++
---

Having worked with Lua before and made a [LuaCppInterface](https://github.com/davidsiaw/luacppinterface), I decided about a year ago to start working on a C++ interface for mounting mruby as a scripting language.

To start, I have been developing in Ruby for several years now and I found it to be quite a pleasant language to work with. The particularly attractive thing about Ruby is its ability to create very clean DSLs. I have proceeded to use this to build some [DSLs of](https://github.com/davidsiaw/sumomo) [my own](https://github.com/davidsiaw/weaver).

Despite the power of Ruby, it turned out to be incredibly hard to use as scripting language. However, recently a Japanese-Government-funded project [mruby](http://www.mruby.org/) has been taking off and has headed into version 2.0.1. A year ago when I tried using it it was in version 1.4.0, and it was already in a fairly stable state. Since its syntax is meant to be compatible with Ruby 1.9 and its easy to compile into a C++ project, I decided to try it out.

## mruby-cpp

To that end, I created [mruby-cpp](https://github.com/davidsiaw/mruby-cpp) which provides a C++ frontend into mruby. Its still in beta as I trawl through the mruby C API and slowly gain an understanding of it. I'll continue to evolve it until it makes sense in both the C++ and mruby contexts.

### Simple introduction

To start, [mruby-cpp](https://github.com/davidsiaw/mruby-cpp) is a header-only C++ library. Just clone it into your sources as a submodule or copy it in and start using it. Your executable obviously needs to be linked with `libmruby.a`.

You can run scripts like this:

```cpp
#include <mruby.hpp>

int main()
{
	vm.run("puts 'hello ruby'");
	return 0;
}
```

You can also set and get global variables, instance variables and class variables:

```cpp
vm.run("$a = 100;");
int global_a = vm.get_global_variable<int>("$a");

vm.run("@a = 100;");
int instance_a = vm.get_instance_variable<int>("@a");

vm.run("@@a = 100;");
int class_a = vm.get_class_variable<int>("@@a");
```

You can bind your C++ classes and their methods to mruby, and specify constructor arguments too!

```cpp
class Person {
	int age;
public:
	Person(int age) : age(age) { }
	int how_old() const { return age; }
};

auto cls = vm.create_class<Person>("Person");
cls.bind_instance_method("how_old", &Person::how_old);
vm.run("puts Person.new(5).how_old")
```

Hopefully you will have a good idea of what I plan to achieve with this library. There are more examples in the [tests folder](https://github.com/davidsiaw/mruby-cpp/tree/master/tests).

### See the tests for more examples!

All the capabilities of [mruby-cpp](https://github.com/davidsiaw/mruby-cpp) are tested by the [tests](https://github.com/davidsiaw/mruby-cpp/tree/master/tests) which are also really good examples of how to use [mruby-cpp](https://github.com/davidsiaw/mruby-cpp).

## mruby

While I was writing this library, I've learned a few things about mruby and actually about Ruby itself too.

### The C API isn't well documented

One of the first things I realize when I started looking for ways to do things in mruby is its C API is sparsely documented. There are a bunch of comments in the headers but they are not nearly detailed enough.

A lot of functions have very abbreviated names such as

```c
mrb_value mrb_vm_special_get(mrb_state*, mrb_sym);
void mrb_vm_special_set(mrb_state*, mrb_sym, mrb_value);
mrb_value mrb_vm_cv_get(mrb_state*, mrb_sym);
void mrb_vm_cv_set(mrb_state*, mrb_sym, mrb_value);
mrb_value mrb_vm_const_get(mrb_state*, mrb_sym);
void mrb_vm_const_set(mrb_state*, mrb_sym, mrb_value);
```

I still don't know what `mrb_vm_special_get` mean, but I know `cv` means class variable and `const` means constant. These are the `vm` variations, which means they only access global scope. Strangely enough, matz removed `vm` variations for the instance variables. Not sure why that is the case.

Sometimes typenames are confusing and its not entirely clear how some types are converted to other types, such as `RProc*` and `mrb_value`.

### Difficulties I faced

While writing mruby-cpp, I encountered some difficulty with unifying mruby objects. All things in mruby are objects but they are not treated that way in the API. This is something I still have to solve.

Contrast with Lua where it exposes its GC reference api allowing you to increment and decrement references to its objects, and allowing you to create your own objects on the Lua GC and reference them the same way. This means that you can basically have a variant of the `shared_pointer` but managed by the Lua GC.

In mruby when you create a function you are forced to assign it to a class with a name. However, you can create a `proc` but it has a transparent `self` keyword, which means its impossible to associate it to an object.

As a result, the easiest way to work with mruby-cpp right now is to create classes and bind functions to them so you can use them in mruby. It makes little to no sense creating a function and assigning it to a variable. I am still working on a nice way to do this, and I spent hours trying to find a way to pass a function to mruby as a callable object.

The differences between procs, objects, classes and modules also mean that it was difficult to create an `mruby::Object` class. Meaning, pure ruby objects cannot really be passed to C++ with mruby-cpp right now.