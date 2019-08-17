---
layout: post
title: "Jepsen and Docker"
date: 2018-08-16 00:06
comments: true
categories: 
- Programming
tags:
- database
- testing
- etcd
---

Recently I have been reading a series of very interesting posts by an Aphyr who [tests distributed databases](https://aphyr.com/tags/jepsen) and then publishes their performance under [network partition](https://aphyr.com/posts/288-the-network-is-reliable) conditions, clock skews, dead nodes and other interesting failure conditions.

The tool he uses is called [Jepsen](https://github.com/jepsen-io/jepsen) which he wrote himself, and the repo itself includes the set of tests that he used on various databases. After reading all the posts about how various supposedly industry-standard (I guess this is the industry standard) databases which claim to be quite reliable fail under precisely the conditions they are not supposed to fail under, I decided to try the tool out myself and document the experience.

My first thought about this tool was that it would be a great application of Docker, and it turns out he had already written a [Docker harness for Jepsen](https://github.com/jepsen-io/jepsen/tree/master/docker). This was great since you could do all sorts of things in the container environment of Docker and still simulate network partitions and all those nasty things without needing too much hardware.

I checked out Jepsen and ran the scripts the way it told me to.

```ruby
$ sh up.sh
[INFO] Generating key pair
Generating public/private rsa key pair.
Your identification has been saved in ./secret/id_rsa.
.
.
.

```

And then it goes off and builds a bunch of containers from scratch.

![Alt text](/images/blogimages/notlike.png)

Then at the very end (after maybe 15 mins of downloading and installing) it goes

```bash
.
.
.
jepsen-control | Please run `docker exec -it jepsen-control bash` in another terminal to proceed.

```

Excellent I can run it now! 

So I open another terminal and type it in and instantly I'm transported to where I should be to start working with Jepsen. Hooray!

```bash
$ docker exec -it jepsen-control bash
Welcome to Jepsen on Docker
===========================

This container runs the Jepsen tests in sub-containers.

You are currently in the base dir of the git repo for Jepsen.
If you modify the core jepsen library make sure you "lein install" it so other tests can access.

To run a test:
   cd etcd && lein run test --concurrency 10
root@control:/jepsen# 

```

Let's try the next command. It looks to me like I should try running the test on etcd with 10 clients?

```bash
# cd etcd && lein run test --concurrency 10
```

It then goes off and spews a large amount of output

```bash
16:09:00.452 [main] INFO  jepsen.cli - Test options:
 {:concurrency 10,
 :test-count 1,
 :time-limit 60,
 :nodes ["n1" "n2" "n3" "n4" "n5"],
 :ssh
 {:username "root",
  :password "root",
  :strict-host-key-checking false,
  :private-key-path nil}}
.
.
.
```

It basically goes off and does a large number of reads and writes. At the very end, it comes back with this:

```bash
Analysis invalid! (ﾉಥ益ಥ）ﾉ ┻━┻
```

Wow that was quick. I did not expect to run into an etcd problem so fast. I did not even specify any failures.

Seems like I had some code to read. After fumbling around I discovered the [source file](https://github.com/jepsen-io/jepsen/blob/master/etcd/src/jepsen/etcd.clj#L159).

Aha.

```clojure
...
(merge tests/noop-test
         {:name "etcd"
          :os debian/os
          :db (db "v3.1.5")
          :client (client nil)
          :nemesis (nemesis/partition-random-halves)
          :model  (model/cas-register)
...
```

Looks like the Jepsen nemesis was baked into the test script. Well thats fine for now.

## Knossos

The next step basically to me was to find out what was wrong. There was a large amount of data output so there must be a tool of some sort that can tell me what was wrong. (Or so I imagined)

After a bit of googling I came across another project called [Knossos](https://github.com/jepsen-io/knossos).

I didn't know very much about Clojure so I just followed through the README anyway. So first I cloned knossos

```bash
# git clone https://github.com/jepsen-io/knossos
# cd knossos
```

I dug around to find the .edn file from my Jepsen run and discovered it in /jepsen/etcd/store/latest/history.edn 

Then I ran the command in the README

```bash
# lein run --model cas-register /jepsen/etcd/store/latest/history.edn 
/jepsen/etcd/store/latest/history.edn	false
```

Excellent. Yes. I knew that.

Scrolling down a little in the README I discovered it could generate the linearizability graph too. That was cool so I tried, by following the code in the README

```bash
root@control:/knossos# lein repl
nREPL server started on port 37400 on host 127.0.0.1 - nrepl://127.0.0.1:37400
REPL-y 0.3.7, nREPL 0.2.12
Clojure 1.8.0
OpenJDK 64-Bit Server VM 1.8.0_181-8u181-b13-0ubuntu0.16.04.1-b13
    Docs: (doc function-name-here)
          (find-doc "part-of-name-here")
  Source: (source function-name-here)
 Javadoc: (javadoc java-object-or-class-here)
    Exit: Control+D or (exit) or (quit)
 Results: Stored in vars *1, *2, *3, an exception in *e
```

I am then dropped into the Clojure prompt, where I try clumsily to guess how things are done:

```clojure
knossos.cli=> (def h (read-history "/jepsen/etcd/store/latest/history.edn"))
#'knossos.cli/h
knossos.cli=> (def a (competition/analysis (model/cas-register) h))
#'knossos.cli/a
knossos.cli=> (require '[knossos.linear.report :as report])
nil
knossos.cli=> (report/render-analysis! h a "linear.svg")
AssertionError Assert failed: No invocation for op {:process 2, :type :ok, :f :read, :value [0 4], :index 12, :time 421990474}
inv  knossos.linear.report/time-coords/fn--5143 (report.clj:186)
```

Okay, I had no idea what that meant. Looks like there are still kinks.


## Thoughts

In short I have a few thoughts:

1. Using docker for this is way cool
2. The analysis tool sucks
3. This can be so much more general

### Using docker is way cool

While Aphyr says that he uses his own LXC stuff to work with, I think its cool that he does provide a Docker interface. However he isn't taking advantage of a few things docker can do:

a. Prebuilt docker containers
b. Networking in docker that can be used to simulate faults
c. Skewing clocks in the container
d. Adding and removing new containers, simulating scaling effects and changing configuration

It is probably because the tool is in its early stages of development, and really he knows how to use it the best, so he can do his stuff the best. But I can't help but feel he himself would benefit from some improvement in this domain. Perhaps he does not use it right now, or maybe he does in another way. I've only sat with this code for the last 4 hours.

### The analysis tool sucks

It needs to recover from weird errors nicely and maybe still present some amount of information. Unfortunately it doesn't, so I will need to spend some time figuring out what I did wrong. Once I get it then I will be able to truly start analysing databases myself.

### This can be so much more general

All in all it looks like a large amount of the code done here is still quite research quality and tests, while composable seemed like they had to be baked into the testing code still. On the surface it felt to me that skew clocks, network failures, network delays and failing environments were things that did not have to be part of the test and could be external. 

** None of this makes any of Jepsen less cool **

In my opinion all one should really need to do is specify what to do in order to perform a read, write or CAS, and the testing tool should attempt a combination of the three to figure out how a database puts up with it.

Its also likely to be the case because different databases are different. Some are queues, some are data structures, some are RDBMS and some are key value stores. However they all should have the same idea that storing data stores, and automated analysis that shows if it is CP or AP and how would be incredible. This is something I might work on in a later post when I have time.

## Conclusions

The world needs more of these. This run was an eye-opener to real simulations of faults, and also the idea that distributed databases are actually extremely hard to understand and build. It also has shown me how one person who makes an effort to do something advanced and difficult and documents it in a clear manner can so quickly change the landscape of a field. 

Thanks to him I am sure I and a large number of people now understand the definitions and jargon behind distributed databases which have been hidden behind walls of text in white papers and difficult to read (read longwinded) articles, and this really opens the door to helping people build better and more resilient systems.

This probably will not be the last post on distributed databases on the blog as I, as are many others, interested in how things can scale safely. We have more or less solved it for webservers, but scaling databases, that is clearly a different beast.
