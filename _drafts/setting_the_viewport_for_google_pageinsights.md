---
layout: post
title:  "Setting the viewport tag for Google PageSpeed Insights"
excerpt: "A note about how to correctly set the viewport meta tag for Google PageSpeed Insights"
---

Recently, I was checking through [Google Webmaster Tools][1] for the sites that I manage and I noticed that a 
PageSpeed Insights suggestion was flagged up for my site, telling me that I need to set the Viewport for the site to be 
rendered correctly on mobile devices.

> Configure the viewport
>
> Your page does not have a viewport specified. This causes mobile devices to render your page as it would appear on a 
desktop browser, scaling it down to fit on a mobile screen. Configure a viewport to allow your page to render properly 
on all devices.

Now, I had the viewport tag already in the `<head>` of my site, in format:

{% highlight html %}
    <meta name="viewport" content="width=device-width, initial-scale=1">
{% endhighlight %}

However, the [Google documentation][2] on this showed the `name` attribute for the tag being set with *no* quotes, 
like so:

{% highlight html %}
    <meta name=viewport content="width=device-width, initial-scale=1">
{% endhighlight %}

Technically, I know this is no different than the `<meta>` tag I was already using, but I decided to give it a go and it 
worked!

I'm interested to find out why this is required. If you know why, please let me know in the comments below.

[1]: https://developers.google.com/speed/pagespeed/insights/
[2]: https://developers.google.com/speed/docs/insights/ConfigureViewport
