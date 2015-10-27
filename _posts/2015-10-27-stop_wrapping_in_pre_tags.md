---
layout: post
title:  "Why is my code getting wrapped in pre tags?!"
excerpt: "I thought it was going to be a simple overflow-x:scroll..."
---

Following the migration of my blog site into my main site, I was performing some manual testing of my site and it's 
styling and I noticed that on mobile devices code in `<pre>` tags was being wrapped.

As a result, code blocks were looking like this:

![Screenshot ot the issue](https://cloud.githubusercontent.com/assets/7666402/10714950/3fa184d2-7afc-11e5-87d6-12f018dc4533.jpg)

I spent far too long on this. I thought it would be as easy as:

{% highlight scss %}
pre, code {
    overflow-x: scroll;
}
{% endhighlight %}

But still lines were wrapped.

To debug further, I decided to isolate the HTML and CSS and see if I could find if there was a style 
somewhere that was stopping the above from taking effect. I threw a [playground together on JSFiddle][1] and it was then 
that I confirmed my own assumption that the default behaviour is for `<code>`/`<pre>` tags to not wrap. But as soon as I 
added [Bootstrap][2] to the playground, code was wrapped! :angry:

I'm a big fan of [Bootstrap][2] and all, but this is silly! I wonder what the justification for this is. After all, `<pre>` 
means *pre*formatted text and text that's already been formatted will be wrapped if it's meant to be wrapped! Sadly, 
this is the trade off with using frameworks like Bootstrap, but in my opinion it's worth it when I think of the time 
saved when using Bootstrap in the first place and not reinventing the wheel just so that "I have full control over the 
code and I know exactly what it's doing".

So, the CSS that I used to fix this is:

{% highlight scss %}
// Make sure that <code> blocks in <pre> tags don't get wrapped.
// This is required as Bootstrap makes code blocks in pre wrap, for some reason....
pre > code {
  overflow: auto;
  word-wrap: normal;
  white-space: pre;
}
{% endhighlight %}

I hope this saves someone from the nightmare I went through to achieve such a small task!

[1]: https://jsfiddle.net/20quc67f/
[2]: http://getbootstrap.com
