---
layout: post
title:  "Naughty GitHub"
date:   2014-07-30 13:45:14
categories: blog
tags: dev html ios
---

I'll admit it: I was late to the party with [GitHub](http://github.com) and [Git](http://git-scm.com    ). I suppose [Subversion](http://subversion.apache.org) got in the way of coding so much, I was kind of left with a bitter taste in my mouth about VCSs in general. Who needs *another* VCS to learn right? I want to build stuff, not worry about my code.
 
So, fast forward a few years... Here I am, pretty much storing everything that's non-binary code in Git that I possibly can. Git has changed the way I work, and GitHub - where would I be if it weren't for services link you?

Now, with GitHub holding my code, I can't help but ignore [Gists](https://gist.github.com):

> Gist is a simple way to share snippets and pastes with others. All gists are Git repositories, so they are automatically versioned, forkable and usable from Git.

Now, that's gone [right up my flagpole][1]{:target="_blank"}, that has!

So, once again, I'm uploading pretty much all of the little notes, scripts and code snippets to GitHub, in the form of Gists.

But, you'd think a "well-thought-out" organisation like GitHub would be able to get simple mobile web development right, wouldn't you?

<span class="center">![Screenshot]({{ '/assets/attachments/gist-ios-bookmark.png' | prepend: site.baseurl }})</span>

After taking a look at the `<head>` section of the HTML for the Gists site, they aren't event defining an 'Apple touch icon'...

{% highlight html linenos %}
<head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# githubog: http://ogp.me/ns/fb/githubog#">
<meta charset="utf-8">
<meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
<title>Gists</title>
<meta name="csrf-param" content="authenticity_token">
<meta name="csrf-token" content="Pia7nkgtClaX7jEvVflO6AQdk5j1JTVWTqfLXo7gsPJaqyGdy2M8SenaGg+b3TJ0UY38WAhaxIonljETasixtQ==">
<meta content="width=960" name="viewport">
<link href="https://github.com/humans.txt" rel="author" type="text/plain">
<meta name="octolytics-app-id" content="gist">
<meta name="octolytics-host" content="collector.githubapp.com">
<meta name="octolytics-script-host" content="collector-cdn.github.com">
<meta name="octolytics-dimension-request_id" content="569696C8:2F41:88AA11:53D8F4A7">
<link href="https://gist-assets.github.com/" rel="assets">
<link rel="stylesheet" media="screen, print" href="https://gist-assets.github.com/assets/application-6aa95e92e16bc9aede46492c2b44dabd.css">
<script async="" src="//www.google-analytics.com/analytics.js">
<script src="https://gist-assets.github.com/assets/application-b0ad1b04929e096cce129a42fbef61fc.js">
<script src="https://gist-assets.github.com/assets/editor-7cb0f66ff975895401bba72ec8dff9e1.js">
<script src="//collector-cdn.github.com/assets/api.js">
<style id="ace_editor">
<style id="ace-tm">
<style>
<style id="ace-github">
</head>
{% endhighlight %}

What year is this???

I'll still be using GitHub and Gists, though :D

Update
======

I thought I'd have a moan to GitHub about this, and here's the reply I got from them:

> From: "James Dennes (GitHub Staff)" <support@github.com>
> 
> Subject: Re: No apple-touch-icon for Gists site
> 
> Date: 30 July 2014 14:15:31 BST
> 
> To: Joe Nyland
> 
> Hi Joe,
> 
> Thanks for the feedback. I'll open an internal issue to have this fixed.
> 
> Cheers,
> James

A speedy reply! But we'll see...

[1]: http://youtu.be/nMgqanHjRX8?t=3m30s
