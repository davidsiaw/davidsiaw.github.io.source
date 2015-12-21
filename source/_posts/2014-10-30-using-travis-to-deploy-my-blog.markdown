---
layout: post
title: "Using Travis to deploy my blog"
date: 2014-10-30 01:07
comments: true
categories: 
- Programming
tags: [travis, blog]
---

I've been using Travis-CI more and more as a platform from which I can deploy things, due to the fact that we can run any code on it. Today I made it so that this blog is deployed to gh-pages when pushed. I have also set up my personal blog to be pushed this way as well.

Why did I use Travis-CI instead of Shippable or other CI systems for this? Well, its mainly due to the fact that I was already using Travis, and the tools (specifically the Travis gem) are quite mature. Many of the things that are quite troublesome, like generating a key and placing decrypt commands into the .travis.yml, are now covered in simple command line instructions.

My blog uses Jekyll + Octopress, but I don't like the limitations imposed by github on the templates I can use. So I decided it was better to simply upload the finished product. First of all, I push all my blog sources up to a public repository at [https://github.com/davidsiaw/davidsiaw.github.io.source](https://github.com/davidsiaw/davidsiaw.github.io.source)

While the setup is easy, its not obvious that you can do this. Hopefully this will go some way to helping others who want to circumvent the github limitations on their gh-pages content as well.

In this post I will show you how to set it up. First of all, I create a key that will give push access to my blog's repository at [https://github.com/davidsiaw/davidsiaw.github.io](https://github.com/davidsiaw/davidsiaw.github.io) by calling up `ssh-keygen`

``` 
nagatsuki david$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/david/.ssh/id_rsa): deploy_key
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in deploy_key.
Your public key has been saved in deploy_key.pub.
The key fingerprint is:
89:8d:a9:60:5c:8b:77:05:c4:2b:05:a4:96:64:8e:fa david@nagatsuki
The key's randomart image is:
+--[ RSA 2048]----+
|     .=+o        |
|     *  o.       |
|    = o. o.      |
| o = ..=.o       |
|  = . =.S        |
|   o o .         |
|    E            |
|                 |
|                 |
+-----------------+
```

I then place the deploy_key.pub in my github repository.

Next, I make use of the Travis gem to encrypt my private key. I add the `--add` parameter to make it write to my .travis.yml (I am in the directory.)

```
nagatsuki david$ travis encrypt-file deploy_key --add
encrypting deploy_key for davidsiaw/davidsiaw.github.io
storing result as deploy_key.enc
storing secure env variables for decryption

Make sure to add deploy_key.enc to the git repository.
Make sure not to add deploy_key to the git repository.
Commit all changes to your .travis.yml.
```

This gives me a deploy_key.enc that is my encrypted private key.

In order to use this key, I need to add some more lines to [.travis.yml](https://github.com/davidsiaw/davidsiaw.github.io.source/blob/master/.travis.yml) to enable it to push to github. First of all, I need to install the key into the .ssh folder so git can use it. I also chmod it so ssh will not complain.

``` yml
- chmod 600 deploy-key
- cp deploy-key ~/.ssh/id_rsa
```

With this, I can now tell Travis to push the generated files. All I do is tell it to generate the site (since this is just Jekyll), and then call my [deploy script](https://github.com/davidsiaw/davidsiaw.github.io.source/blob/master/deploy) which simply pushes the right stuff up to github.

```
- bundle exec rake generate
- bash deploy
```

With this, my website gets updated everytime I push my changes to [https://github.com/davidsiaw/davidsiaw.github.io.source](https://github.com/davidsiaw/davidsiaw.github.io.source), Travis will automatically update my blog.

