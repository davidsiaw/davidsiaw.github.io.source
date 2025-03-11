---
layout: post
title: A resource pool implementation
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
After some interesting discussion with a friend, I've decided to try my hand at coding a resource pool like Apache's APR pools. I'm gonna call my pool b_pool, which stands for bunny pool.

Its not going to be a copy of APR pools however, it will just by my idea of what a pool should be like. It will be able handle not only memory, but file handles, socket descriptors and other shared system resources and manage them. Thus, instead of calling it just a memory pool, I call it a resource pool.

You can check it out from LaunchPad using Bazaar version control.

```
bzr branch lp:~davidsiaw/bpool/trunk
```

Currently the only way to build bpool is by using Visual Studio 2008. I'll check in some autogen scripts sometime later this week. Or someone can help me write a temporary makefile that I can merge into the tree ^_^.

This resource pool is meant to be used inside a subsystem that has a limited lifetime, but uses memory in a complex enough way to make tracking the lifetimes of objects allocated inside it difficult. The idea of a pool is that you create a pool just before you run the subsystem, and the subsystem will use the pool to allocate memory and other resources, in other words, allocate resources inside the pool. When the subsystem is no longer needed, the pool is destroyed, taking along with it all the resources it was used to allocate. The subsystem has the freedom to free memory if it wants to, or it can allocate memory to be used at a later time.

The b_pool is still in its infancy and I still have a lot of things I want to add to it such as string manipulation functions that use the b_pool, which would be tremendously useful if used together with a subsystem that uses strings a lot.

How do you use the pool?

Well right now there's only one way to use it, and it can only pool memory at the moment. In order to create a pool, simply create a variable to hold a pointer to the pool and call b_create_pool

``` c
b_pool* pool;
b_create_pool(&pool);
```

When you are sure you are finished with it, you call
``` c
b_destroy_pool(pool);
```

This frees all the memory allocated in the pool.

In order for the subsystem to allocate memory in the pool, it needs to call the function b_alloc, which is basically a replacement for malloc, but it is used slightly differently.

``` c
void mysubsystem(b_pool* pool)
{
	char* mem1;
	b_alloc(pool, &mem1, 50);
}
```

b_alloc takes 3 parameters, it takes the pointer to the pool, a reference to the pointer to memory that it will assign to, and the size of memory requested. b_alloc will then fill in the pointer with an address where the requested memory has been prepared. It returns a number too, 0 for success and anything else for fail. I might add an enumeration later.

If you so wish to free the memory because you know you are finished with it, you can use

``` c
b_free(pool, mem);
```

Similar to free() in libc, b_free frees up memory to be allocated by somebody else again. Although this is optional as long as you destroy the pool when your subsystem has done its job, this is useful whenever you want to keep the memory usage to a minimum constantly, which is the case in memory-constrained environments like mobile phones.

So whats the difference between using a memory pool and malloc to allocate memory? Isn't it just putting a big malloc and free around a set of function calls? It may seem absurd and unuseful on the outset, but the only rule you must definitely observe when using a pool is that you must Never make a global pool in your application, because that's what your application address space already is. Essentially, yes. It is putting a big malloc and free around a set of function calls. But the usage of memory is simplified in the sense that you can ignore having to worry about trying to reuse memory that isn't used anymore inside your subsystem, or resizing the amount of memory you allocated for your subsystem in order to let it store more data. All you need to do is ask for memory, which is one less worry in a low-level language.

It is also faster to have a userland routine manage your memory for you, since it does not incur the cost of changing privilege levels, which is expensive on most CPU architectures, and is required whenever you want to ask the OS to reserve memory for you. Eventually I will create more routines to allow the registration of destructors, deep copiers for other kinds of custom resources into the pool. I am also thinking of turning it into a layer over a set of OS resource requesting functions, so one can write subsystems that are platform-independant, and all one needs to do to use a subsystem on another platform is to implement the b_pool for that platform and use the subsystem.

So, have fun with experimenting with it and tell me what you think about it, or even, tell me your idea of what you think a resource pool should be like!
