---
layout: post
title: This seems to make Cappuccino faster...
categories:
- Programming
tags:
- cappuccino
- javascript
- timer
status: publish
type: post
published: true
meta:
  _syntaxhighlighter_encoded: '1'
---
My lack of knowledge about Cappuccino's implementation details may play a role, but

``` javascript
window.setTimeout = window.setNativeTimeout;
```

Seems to make my Cappuccino apps more responsive.
