---
layout: post
title: Homesick Bash completion
excerpt: I decided to write my own Bash completion script for Homesick.
---

Your dotfiles hold a lot of stuff in them: You've most probably spent a while accumulating handy Bash functions,
config and variables and that all gets stored in lots of hidden files that live in your `$HOME` directory. If you change
machines maybe between home and work or you like to keep everything version controlled for peace of mind, or you just
:heart: Git (like me), I recommend you check out [Homesick][homesick] by [Josh Nicols][josh-nicols].

I use it a hell of a lot for all of [my dotfiles][my-dotfiles], but one thing that I feel it's missing out-of-the-box
is Bash completion. I *mash* my tab button all day and all night and when a command doesn't respond to my furious
tabbing, it makes me feel sad that I'm going to have to use a whole lotta energy to think what parameters I want to
give a command and the path to a file, etc. It really is awful :wink:

So, I thought: "I use Homebrew all the time and it's never cost me a penny, so why not give something back and write
my own Bash completion?" That's just what I did!

Here we have it! :tada:

### Update
Good news!!! :confetti_ball: My Homesick completion script made it into Homebrew! Now you can install with:
{% highlight bash %}
brew tap homebrew/completions # Tap the homebrew-completions repo
brew install homesick-completion
{% endhighlight %}

Here's the old (manual) installation method, or if you want to look at the code:

<script src="https://gist.github.com/JoeNyland/10f692638ff6975bbc2550b4a37c561e.js"></script>
<noscript><p><a href="https://gist.github.com/JoeNyland/10f692638ff6975bbc2550b4a37c561e" target="_blank">Click here</a> to view 
the <a href="https://gist.github.com" target="_blank">Gist</a>.</p></noscript>

This is my first Bash completion script that I've written. Previous to this, I had no idea how packages allowed you to
tab complete stuff so this was a really interesting exercise to find out how it's done, whilst doing something useful
at the same time!

You can find the repo on GitHub [here][homesick-completion-repo]. If you've git any ideas for improvements, feel free
to submit a [pull request][pull-request], or if you get any problems, open up an [issue][issue].

I've currently got a pull request open on the [Homebrew/homebrew-completions repo][homebrew-completions] here:
[#113](https://github.com/Homebrew/homebrew-completions/pull/113), so if that get's accepted you should be able install
my Bash completion script using Homebrew!

I hope this helps someone out! Let me in the comments section below if it does, or if you have any questions.

[homesick]: https://github.com/technicalpickles/homesick
[josh-nicols]: https://github.com/technicalpickles
[my-dotfiles]: https://github.com/JoeNyland/dotfiles
[homesick-completion-repo]: https://github.com/JoeNyland/homesick-completion
[pull-request]: https://github.com/JoeNyland/homesick-completion/pulls
[issue]: https://github.com/JoeNyland/homesick-completion/issues
[homebrew-completions]: https://github.com/Homebrew/homebrew-completions
