---
layout: post
title: "Script for setting up FTP to a folder on a Mac"
date: 2015-01-23 10:34
comments: true
categories: 
- Programming
---

This script came in handy many times when I had to share things with my other laptops or windows users.

On a Mac you should have Ruby installed. Macs normally come with an ftpd whose frontend has been ripped out, so you can only do this on the command line. Basically, write this to a script file (lets call it `setftp`)

and then use it by typing:

`./setftp /directoryIWantToShare`

Tested on Mavericks

```ruby
#!/usr/bin/env ruby

#puts ARGV.inspect

puts `sudo -s launchctl unload -w /System/Library/LaunchDaemons/ftp.plist`

config = <<-THEFILE
# Set the ftp root dir to this folder
umask all 022
chroot GUEST #{ARGV[0]}
modify guest off
umask  guest 0707
upload guest on
THEFILE

File.open("/etc/ftpd.conf", 'w') { |file| file.write(config) }

puts `sudo -s launchctl load -w /System/Library/LaunchDaemons/ftp.plist`
```

With this you will have an ftpd turn on whose root folder is the folder you named. in this case it is `/directoryIWantToShare`
