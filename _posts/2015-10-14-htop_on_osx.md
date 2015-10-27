---
layout: post
title:  "Running htop on Mac OS X needs root. Why?!"
excerpt: "Why does htop on Mac OS need to run as root in order to show all the running processes and their stats?"
redirect_from:
  - /blog/2015/10/14/htop_on_osx/
---

So, Mac OS X 10.11 came out a few days ago and I was keen to install and see 
[what's new](http://www.apple.com/uk/osx/whats-new/). When it comes to OS upgrades, I prefer to perform a wipe and 
load of whatever system is, so that I start with a blank slate and build it back up. This helps eradicate those gnarly 
issues that can arise if an inplace upgrade is performed and old configurations can sometimes conflict with new 
binaries, libraries or simply just "new ways to do things".

I started out on my Unix journey using Linux systems and once I started using Macs, it wasn't long before I began to 
miss a fair few of the Linux commands and utilities that I had gotten used to using. The solution: [Homebrew](http://brew.sh). 
It's awesome! That's all there is to it. If you're not using it already, you should be - [go get it](http://brew.sh)!

> The solution: [Homebrew](http://brew.sh). It's awesome! That's all there is to it.

[`htop`](http://hisham.hm/htop/) is an awesome process viewer for Unix based systems and it was the first thing I 
installed on my Mac, once I had Homebrew installed. One interesting point, though, is that `htop` on Mac OS needs to 
run as root in order to show all the running processes and their stats. Without root privileges, `htop` can only report 
on processes that the current user is running. On Linux, `htop` can be run by a non-privileged user and they can see (only) processes 
that are owned by other users on the system, including root's processes.

I asked [on SuperUser](http://superuser.com/q/981790/240354) why this was the case. It turns out that on Linux, htop uses the 
`/proc` filesystem to gather process info, however on a Mac, there's no `/proc` filesystem for `htop` to pull data from. 
Instead, it has to talk to the kernel and this is the step that requires root privileges. Thanks to 
[Thomas Dickey on SuperUser](http://superuser.com/users/441480/thomas-dickey) for his 
[answer](http://superuser.com/a/981811/240354) explaining this.

This is a documented caveat with `htop` on OS X; it's mentioned in the install information in the `htop` formula in the 
Homebrew repo that after install (see [here][1]), you need to run `htop` as root to see all the processes. For some 
time, the recommended workaround for this in the formula info was as follows:

{% highlight bash %}
sudo chown root:wheel $(which htop)/htop
sudo chmod u+s $(which htop)/htop
{% endhighlight %}

After that, `htop` can be run by simply typing:

{% highlight bash %}
htop
{% endhighlight %}

However this was [changed fairly recently][2] to suggest that instead of the above, `htop` should be run with `sudo` instead:

{% highlight bash %}
sudo htop
{% endhighlight %}

I personally prefer the original workaround of setting the `setuid` bit on the `htop` binary, as this means I don't have 
to setup a potentially messy Bash alias and I don't have to remember to run with `sudo` on Mac and without `sudo` on Linux. 

I'm sure there'll be a reason (probably security related) why the move away from this method was taken by the Homebrew 
maintainers, but I thought it would be useful to explain this change and hopefully explain why root privileges are 
needed for htop to report on all processes on Mac OS X.

If you have any questions, or if you care to enlighten me on why it's better to run `htop` as root through `sudo` on a 
Mac, rather than the `setuid` method above, then please feel free to comment below! 

[1]: https://github.com/Homebrew/homebrew/blob/299f8a27d17ce93c2c7dd8bb5719cd6a3152305e/Library/Formula/htop-osx.rb#L26-L28
[2]: https://github.com/Homebrew/homebrew/commit/299f8a27d17ce93c2c7dd8bb5719cd6a3152305e#diff-f2c362f0cb7316d896279dd18daa4dbd
