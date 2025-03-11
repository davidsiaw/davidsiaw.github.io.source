---
layout: post
title: Why I Prefer Initialization Through Constructors
categories:
- Programming
tags:
- C++
- constructor
- populate
status: publish
type: post
published: true
meta: {}
comments: true
---
I always prefer initializing my class through the use of a constructor like this:

``` csharp
class Apple
{
	Color color;
	Taste taste;
	List<string> countries;
	public Apple(Color color, Taste taste, List<string> countries)
	{
		this.color = color;
		this.taste = taste;
		this.countries = countries;
	}
}

void DoSomething() 
{
	List<string> grownInCountries = new List<string>();
	grownInCountries.Add("Japan");
	grownInCountries.Add("New Zealand");
	grownInCountries.Add("Poland");
	Apple a = new Apple(Color.Green, Taste.Sweet, grownInCountries);
	DoStuffWith(a);
}
```

Instead of

``` csharp
class Apple
{
	public Color color;
	public Taste taste;
	public List<string> countries;
}

void DoSomething()
{
	Apple a = new Apple();
	a.Color = Color.Green;
	a.Taste = Taste.Sweet;
	a.GrownInCountries = new List<string>();

	a.GrownInCountries.Add("Japan");
	a.GrownInCountries.Add("New Zealand");
	a.GrownInCountries.Add("Poland");
	DoStuffWith(a);
}
```

To some, the answer seems obvious: constructors enforce filling in all the fields. To others, it may look like a waste of time and increased complexity to apply the boilerplate: less code = less bugs. Either that or the argument is the class becomes less serialization-friendly.

The C# compiler (or C++ or Java compilers for that matter) provide us with Constructors as a facility to make sure that our fields are all initialized upon construction, besides being able to imply the size required for the data structure to the new operator.

The second example also means that encapsulation has been broken and other classes are free to access the variables within Apple (causing coupling). We could argue that the readonly qualifier could be applied to them, but the "countries" field is a reference type and still modifiable via its own methods.

This way you can avoid forgetting to initialize a certain set of fields. Whenever a field is added, the constructor should also get a parameter, forcing the implementor to ensure that all places that create instances of this class will have to initialize the new field, eliminating a whole class of bugs related to uninitialized variables.
