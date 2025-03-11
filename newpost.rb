require 'time'
require 'active_support/inflector'

if ARGV[0].nil?
  puts "USAGE: ruby newpost.rb my-new-post"
  exit
end

title = ARGV[0].tr('-', '_').humanize
time = Time.new
fname = "posts/#{time.year}-#{time.month.to_s.rjust(2, '0')}-#{time.day.to_s.rjust(2, '0')}-#{ARGV[0]}"
fcontent = <<~CONTENT
---
layout: post
title: "#{title}"
date: #{time}
comments: true
categories: 
- Random
tags:
- random
---

write content here
CONTENT

puts fname 
puts fcontent
File.write("#{fname}.md", fcontent)
