---
layout: post
title: Mac SSH agent not loading identity on login
excerpt: This has been annoying me for a while now, but I've been putting off investigating it. Until now...
---

So, what's your :cow: ?

For both work and my personal projects, I often use SSH agent forwarding. For those of you that don't know what this is,
basically it means that your local SSH key is forwarded in a secure manner to the remote server that you're connecting
to and allows you to connect onto other servers using your local SSH identity without manually copying your keys around.

An example use case is that you want to perform a deploy on a remote server, but in order to perform the deploy you
need to pull from Github on the remote server and because it's a private repo that you're pulling from, you'll need to
present your SSH key to Github.

An easy (but insecure) way to do this is to copy your local SSH key to the server where you want to deploy to and
then SSH to the server and then pull from Github using your "copied" SSH identity. Now, whilst this might work, it's
wrong for a couple of reasons. Essentially it's bad practise, due to the security risks that it creates. So you've
been warned! - Do NOT do this! :rage:

SSH agent forwarding essentially handles the above, roughly speaking, but it does it using a much more secure and
convenient model. SSH agent forwarding uses an local agent, whose responsibilty is to load and hold a user's SSH
identities in memory, ready for use. On connecting to a server, the server has access to the SSH identities that have
been loaded into the client's SSH agent and can then in turn use these to present to SSH servers that are connected to
from that user's session.

In order to use SSH agent forwarding, you need to add your local SSH identity to your local SSH agent so that it can
make it available to remote servers:
{% highlight bash %}
ssh-add ~/.ssh/id_rsa
{% endhighlight %}

Then, you can connect to remote servers:
{% highlight bash %}
ssh me@remote.server
{% endhighlight %}

Then, you can pull from Github and you will be authenticated to Github's servers using the SSH identity from your local PC:
{% highlight bash %}
cd git-project
git pull
{% endhighlight %}

This works great on a Mac too, because it's a UNIX based OS. However, after a reboot of my Mac (not very often, but...)
my SSH agent would lose the SSH identities that I had loaded. This was really annoying and just when you needed to
deploy that urgent hotfix to a server, you would get a "Permission denied" error message when you tried to pull! So annoying!

This problem plagued me for a while and I got so sick of it that I researched how I could fix it. A bit of help from
Uncle Google lead me to this Github help article [here][1] and specifically this [point][2]. As it say's adding the `-K`
switch to `ssh-add` when you're loading your SSH identity, invokes Mac OS's Keychain functionality to securely load the
key into memory on login. It's annoying that `ssh-add` on a Mac doesn't do this by default, but there's an argument for
it not being the default too, I guess.

I hope this helps others that might come across this issue, but haven't spotted that note at the bottom of the Github
help article. As always; any comments, queries or suggestions - bang them in the comments section below and I'll take a
look!

[1]: https://developer.github.com/guides/using-ssh-agent-forwarding/
[2]: https://developer.github.com/guides/using-ssh-agent-forwarding/#your-key-must-be-available-to-ssh-agent
