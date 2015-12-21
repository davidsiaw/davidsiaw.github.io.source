---
layout: post
title: "Rotating Integrals"
date: 2015-12-22 01:11
comments: true
categories: 
- Math
---

_This post assumes you know some trigonometry and can do some integral calculus on it._

My little brother in college complained about sines and cosines in an indefinite integral today. Specifically, an integration that he was annoyed with was:

\\[\int{x\^3\,sin(x)\,dx}\\]

It sounded like a whine at first but upon closer inspection, his complaints are not unwarranted. This is indeed a troublesome kind of indefinite integral. There is a trick to doing it quickly, but let us try and perform this particular integration normally first:

Since this is integration of the product of two functions, we perform integration by parts.

\\[\int{u\,dv} = uv\, - \int{v\,du}\\]

I choose \\(u = x\^3\\) and \\(dv = sin(x)\,dx\\) mostly to avoid having to integrate the \\(x\^3\\) and have fractions mess up my working.

This results in:

\\[
\begin{aligned}
 u &amp; = x\^3 \\cr
 du &amp; = 3x\^2\,dx \\cr
 dv &amp; = sin(x)\,dx \\cr
 v &amp; = -cos(x)
\end{aligned} 
\\]

Hence:

\\[
\begin{aligned}
 \int{u\,dv} &amp; = uv\, - \int{v\,du} \\cr
 &amp; = -x\^3\,cos(x)\, - \int{–3x\^2 cos(x)\,dx} \\cr
 &amp; = -x\^3\,cos(x) + \int{3x\^2 cos(x)\,dx} 
\end{aligned} 
\\]

We seem to have ended up with another integral to solve: \\(\int{cos(x)(3x\^2)\,dx}\\), so we shall proceed to solve it.

\\[
\begin{array}{cc}
 \begin{aligned}
  \int{u\,dv} &amp; = uv\, - \int{v\,du} \\cr
  \int{3x\^2 cos(x)\,dx} &amp; = 3x\^2 sin(x)\, - \int{6x\,sin(x)\,dx}
 \end{aligned} &amp;
 \begin{aligned}
  u &amp; = 3x\^2 \\cr
  du &amp; = 6x\,dx \\cr
  dv &amp; = cos(x)\,dx \\cr
  v &amp; = sin(x)
 \end{aligned} 
\end{array}
\\]

How vexing. We have yet another integral to solve. Let us proceed anyway.

\\[
\begin{array}{cc}
 \begin{aligned}
  \int{u\,dv} &amp; = uv\, - \int{v\,du} \\cr
  \int{6x\,sin(x)\,dx} &amp; = -6x\,cos(x)\, - \int{-6\,cos(x)\,dx} \\cr
  \int{6x\,sin(x)\,dx} &amp; = -6x\,cos(x) + \int{6\,cos(x)\,dx}
 \end{aligned} &amp;
 \begin{aligned}
  u &amp; = 6x \\cr
  du &amp; = 6\,dx \\cr
  dv &amp; = sin(x)\,dx \\cr
  v &amp; = -cos(x)
 \end{aligned} 
\end{array}
\\]

Once again, we have to solve another integral. This one seems to be the last though, because the x term has withered away into oblivion, it becomes a trivial integral.

\\[
\begin{aligned}
 \int{6x\,sin(x)\,dx} &amp; = -6x\,cos(x) + \int{6\,cos(x)\,dx} \\cr
 &amp; = -6x\,cos(x) + 6\int{cos(x)\,dx} \\cr
 &amp; = -6x\,cos(x) + 6\,sin(x)
\end{aligned} 
\\]

Bringing it all together, we have:

\\[
\begin{aligned}
 \int{x\^3\,sin(x)\,dx} &amp; = -x\^3\,cos(x) + \int{3x\^2 cos(x)\,dx} \\cr
 &amp; = -x\^3\,cos(x) + 3x\^2 sin(x)\, - \int{6x\,sin(x)\,dx} \\cr
 &amp; = -x\^3\,cos(x) + 3x\^2 sin(x)\, - [-6x\,cos(x) + \int{6\,cos(x)\,dx}] \\cr
 &amp; = -x\^3\,cos(x) + 3x\^2 sin(x)\, - [-6x\,cos(x) + 6\,sin(x)] \\cr
 &amp; = -x\^3\,cos(x) + 3x\^2 sin(x)\, + 6x\,cos(x) - 6\,sin(x) 
\end{aligned} 
\\]

Phew! Basically due to the fact that you have to integrate by parts as many times as the _power of x_, the amount of integration you have to do increases proportionally to x's power, making it troublesome.

## A Closer Look

However, if you have been following the working closely, you will notice that all we are really doing when we integrate by parts is performing a derivative of both parts over and over again. Notice how the \\(sin(x)\\) term keeps flipping between \\(sin(x)\\) and \\(cos(x)\\).

Better yet, if you differentiate \\(sin(x)\\) 4 times, the entire thing rotates back to \\(sin(x)\\) again. Since we integrated \\(sin(x)\\) 4 times in this example, that is exactly what happened. I call this kind of integral a **Rotating Integral** because the trigonometric term constantly rotates between the four combinations of negative and positive, \\(sin(x)\\) and \\(cos(x)\\).

Notice also that the \\(u\\) term we chose right at the beginning was differentiated at every step until it became a constant:

\\[x\^3\,\rightarrow\,3x\^2\,\rightarrow\,6x\,\rightarrow\,6\\] 

If we factorize the result, we get the following:

\\[
 -x\^3\,cos(x) + 3x\^2 sin(x)\, + 6x\,cos(x) - 6\,sin(x) = (-x\^3 + 6x)\,cos(x) + (3x\^2 - 6)\,sin(x) 
\\]

Notice how there is a negative term in both the \\(sin(x)\\) and \\(cos(x)\\) groups. Since the starting \\(u\\) we chose was positive, we can see the \\(sin(x)\\) go through 

\\[-cos(x)\,\rightarrow\,-sin(x)\,\rightarrow\,cos(x)\,\rightarrow\,sin(x)\\]

We can see a pattern of repeating derivatives distributed among the \\(sin(x)\\) and \\(cos(x)\\) groups. If we recognize that 

\\[
\begin{array}{cc}
 x\^3 &amp;\rightarrow\,3x\^2 &amp;\rightarrow\,6x &amp;\rightarrow\,6 \\cr
 f &amp;\rightarrow\,f^\prime &amp;\rightarrow\,f^{\prime \prime} &amp;\rightarrow\,f^{\prime \prime \prime} \\cr
\end{array} 
\\]

And from our rearranged result,

\\[
(-f + f^{\prime \prime})\,cos(x) + (f^\prime - f^{\prime \prime \prime})\,sin(x) 
\\]

This peaked my interest, and I decided to check the results of other powers of x:

\\[
\begin{array}{cc}
3 &amp; (-x\^3 + 6x)\,cos(x) &amp; + (3x\^2 - 6)\,sin(x) \\cr
4 &amp; (-x\^4 + 12x\^2 - 24)\,cos(x) &amp; + (4x\^3 - 24x)\,sin(x) \\cr
5 &amp; (-x\^5 + 20x\^3 - 120x)\,cos(x) &amp; + (5x\^4 - 60x\^2 + 120)\,sin(x) \\cr
6 &amp; (-x\^6 + 30x\^4 - 360x\^2 + 720)\,cos(x) &amp; + (6x\^5 - 120x\^3 + 720x)\,sin(x) \\cr
7 &amp; (-x\^7 + 42x\^5 - 840x\^3 + 5040x)\,cos(x) &amp; + (7x\^6 - 210x\^4 + 2520x\^2 - 5040)\,sin(x)
\end{array} 
\\]

## The Solution!

After doing some more wolframming, I found that we have a general solution of:

\\[
\int{f\,sin(x)\,dx} = (- f + f^{\prime \prime} - f^{\prime \prime \prime \prime} + \cdots - f^{\prime2n})\,cos(x) + (f^{\prime} - f^{\prime \prime \prime} + f^{\prime \prime \prime \prime \prime} - \cdots + f^{\prime2n+1})\,sin(x)
\\]

Where odd numbered differentials are on the \\(sin(x)\\) group and even numbered differentials are on the \\(cos(x)\\) group, and each differential alternates between negative and positive signs. The \\(sin(x)\\) group starts with a positive sign while the \\(cos(x)\\) starts with a negative sign.

Of course, the same rule slightly modified works for the \\(cos(x)\\) form:

\\[
\int{f\,cos(x)\,dx} = (f - f^{\prime \prime} + f^{\prime \prime \prime \prime} - \cdots + f^{\prime2n})\,sin(x) + (f^{\prime} - f^{\prime \prime \prime} + f^{\prime \prime \prime \prime \prime} - \cdots + f^{\prime2n+1})\,cos(x)
\\]

Note that this only works if \\(f\\) eventually derives into 0, and if the trigonometric function is \\(sin(x)\\) or \\(cos(x)\\). Otherwise you will need another method of finding the solution. 

With this, you can find the indefinite integral of expressions of this form by simply differentiating the non-trigonometric side. You can also use identities, factorizations and other ways to rearrange an expression into this form to use this technique to integrate this otherwise troublesome class of **Rotating Integrals**.
