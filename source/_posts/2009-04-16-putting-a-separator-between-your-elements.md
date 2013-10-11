---
layout: post
title: Putting a separator between your elements
categories:
- Programming
tags:
- better way
- C++
- separator
- string.join
status: publish
type: post
published: true
meta:
  _edit_last: '2'
---
Often when I'm programming, I'll need to list a bunch of stuff and put commas between them. Like this:

```
1,2,3,4,5
```

Usually, this is what I, and most of my colleagues do:

``` csharp
            List<int> nums = new List<int>();
            for (int i = 0; i < 5; i++)
            {
                nums.Add(i);
            }

            string msg = "";
            bool first = true;
            foreach (int num in nums)
            {
                if (first)
                {
                    first = false;
                }
                else
                {
                    msg += ",";
                }
                msg += num.ToString();
            }
```

After reading Eric Lippert's little article about <a href="http://blogs.msdn.com/ericlippert/archive/2009/04/13/restating-the-problem.aspx">the horrid-seeming problem of commas and lists</a>, I noticed him mentioning the method

```
String.Join
```

Needless to say, I went and tried it, and found that I could do the equivalent of the above, like this:

``` csharp
            List<int> nums = new List<int>();
            for (int i = 0; i < 5; i++)
            {
                nums.Add(i);
            }
            
            string msg = string.Join(",", nums.Select(x => x.ToString()).ToArray());
            Console.WriteLine(msg);
```

Its kinda amazing how after coding in C# for a good year now that I haven't noticed the existence of such a method. 

Okay, the lambda expression seems a bit messy with all the parens and all, but you get the idea. Still, its a lot better than writing a loop and having the evil "first" variable which kinda clutters the whole thing. Does anyone know an even better way of doing this?

Update: and for my answer to Eric's <a href="http://blogs.msdn.com/ericlippert/archive/2009/04/15/comma-quibbling.aspx">next post</a>:

``` csharp
    string msg = "{";
    IEnumerable<string> s = something;

    string[] arr = s.ToArray();

    if (arr.Length > 1)
    {
        string[] ar2 = { 
                   string.Join(", ", arr, 0, arr.Length - 1 ), 
                    arr[arr.Length - 1] 
               };

        msg += string.Join(" and ", ar2);
    }
    else if (arr.Length == 1) msg += arr[0];

    msg += "}";
```
