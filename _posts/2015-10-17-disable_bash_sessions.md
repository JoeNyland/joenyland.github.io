---
layout: post
title:  "Disable Bash sessions"
excerpt: "How to disable Bash sessions on Mac OS 10.11 El Capitan, because it's useless."
redirect_from:
  - /blog/2015/10/17/disable_bash_sessions/
---

When I upgraded to OS X 10.11 El Capitan earlier this month, one of the first things I did was open up Terminal.app so 
that I could install Homebrew, RVM, etc. After a while, I realised that my Bash history wasn't being saved.

I checked permissions on `~/.bash_history`:

    joenyland@Joes-MBP ~ $ stat ~/.bash_history -c "%a %U %G"
    600 joenyland staff

All looks good. Is the history file set correctly?

    joenyland@Joes-MBP ~ $ echo $HISTFILE
    /Users/joenyland/.bash_history

Again, all looks good. I noticed a new folder in my home directory: `~/.bash_sessions` and this contains what looked to 
be Bash history files with hashed file names:

    joenyland@Joes-MBP ~ $ tree ~/.bash_sessions/
    .bash_sessions/
    ├── 005551F0-A695-4FF5-B04A-E39E163D176D.historynew
    └── 87119D10-8A15-4AA0-A9A5-F9889436DD76.historynew
    
    0 directories, 2 files

Uncle Google lead me to find someone in the same boat as me: [here][1] and the solution was given [here][2]. Simply 
put, "Bash sessions" can be disabled by simply running the following:

    touch ~/.bash_sessions_disable
    
Then close your Terminal.app window and re-open to reload the Bash environment. As the [answer][2] suggests, that the 
presence of the `~/.bash_sessions_disable` file (although empty) instructs Bash to disable the "sessions" feature and 
revert to previous behaviour of storing history in the `$HISTFILE` (the value of which defaults to `~/.bash_history`).

A little more info on what Bash sessions is can be found [here][3].

There might be advantages to using Bash sessions that I'm not aware of. If you know of any or if you have any 
questions, feel free to pipe up in the comments section below!

[1]: http://stackoverflow.com/q/32418438/1788943
[2]: http://stackoverflow.com/a/32418439/1788943
[3]: https://www.reddit.com/r/osx/comments/397uep/changes_to_bash_sessions_and_terminal_in_el/
