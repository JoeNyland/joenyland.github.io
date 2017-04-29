---
layout: post
title: Careful with your Git remote config
excerpt: I thought I was being clever with my Git remote config.
---

For some time, I had the following in my [`~/.gitconfig`][1]:

{% highlight ini %}
[remote "origin"]
    prune = true
{% endhighlight %}

I like keeping my branches tidy on the projects I work on and the more developers that are working on a project, the
more branches are getting created, merged and delted all the time. The above Git config means that every time you
fetch, Git will prune remote branches automatically, just like it would if you used `git fetch --prune`. This worked
great and I thought I was being clever! :bowtie:

However, recently when I built the repositories for a few of my new projects (personal and work), I noticed a problem
when I came to add the remote GitHub or BitBucket (I know, I know - we *have* to use BitBucket at work - it's bloody
terrible!). As normal, I'd issue the following command to add the remote repo:

{% highlight bash %}
$ git remote add origin https://github.com/JoeNyland/test.git
{% endhighlight %}

But this would throw the error:

> `fatal: remote origin already exists.`

Bugger! :angry:

> Git (as always) wasn't lying either!

I was puzzled for a while trying to work out why, on a newly created and blank repo, Git was complaining that an
origin already existed. Git (as always) wasn't lying either!

{% highlight bash %}
$ mkdir test
$ cd test
$ git init
$ git remote -v
origin
{% endhighlight %}

Whilst the above configuration conveniently sets the configuration for a remote repository to always prune remote
branches when fetching, having this set implies that a remote with the name `origin` already exists, hence the
phantom `origin` in the above example shows up when listing remote repositories, even though technically is does not
exist.

> `fatal: remote origin already exists.`

[Googling][2] for the error above yields many many suggestions for users to use the following:

{% highlight bash %}
$ git remote set-url origin https://github.com/JoeNyland/test.git
{% endhighlight %}

But that doesn't really address the problem here. The real solution to that error is to remove the configuration at
the top of the post from your Git config file (`.git/config` or `~/.gitconfig`), which is [just what I did][3] and the
error went away!

It's annoying that you can't set the default configuration for a remote that does not necessarily exist yet in your Git
config, but hopefully this will be possible in a future version of Git.

#### Update 17/04/2015
I've found a solution! :tada:

Thanks to [Alberto Grespan's blog post][4] I found that you can set the default behaviour for `git fetch` to prune
remote branches automatically with the following command:

{% highlight bash %}
git config fetch.prune true
{% endhighlight %}

Or the following in your Git config:

{% highlight ini %}
[fetch]
  prune = true
{% endhighlight %}

I've [added this to my `~/.gitconfig`][5] and have been using it for the past few days and it works a treat!

Moral of the story: Git is awesome!!! :metal:

[1]: https://github.com/JoeNyland/dotfiles/blob/master/home/.gitconfig
[2]: https://www.google.co.uk/#q=fatal:+remote+origin+already+exists.
[3]: https://github.com/JoeNyland/dotfiles/commit/f2d9ea2fdfbb31c762ea3523d2a59c83735d406e
[4]: http://albertogrespan.com/blog/always-prune-remote-tracking-branches/
[5]: https://github.com/JoeNyland/dotfiles/commit/5ba637fd18da75e9f159a7186c9a01a975b6bcab
