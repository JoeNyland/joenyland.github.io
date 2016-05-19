---
layout: post
title: How to install a Ruby Gem from a custom source via Puppet
excerpt: Recently, I needed to install a Ruby gem from a custom source via Puppet and here's how to do it.
---

Here's the situation: You've written a [Ruby gem][example-gem-repo] that you want to install on a server, but you don't really have any
need to share the gem with the world via [RubyGems.org](https://rubygems.org). It's a custom gem with bespoke code
that no one would benefit from. You've pushed the gem to your Gem server and you use Puppet to manage your
servers.

Here's a simple, example Puppet manifest, showing how to install gem via Puppet from a custom source:
{% highlight puppet %}
# manifest.pp
node default {
  package { 'cautious-potato':
    provider => 'gem',
    source => 'http://mygemserver.com',
    ensure => '0.1.0'
  }
}
{% endhighlight %}

Then apply that manifest:
{% highlight bash %}
sudo puppet apply --test manifest.pp
{% endhighlight %}

...and you should see version 0.1.0 of the gem installed from your own Gem server!

It took me a while to figure this out and I only worked out how to do it whilst reading through the
[source of the Gem Package provider in Puppet][puppet-gem-source]. I hope this saves others from wasting too much time
on working out how to do this, like I did!

[example-gem-repo]: https://github.com/MasterRoot24/example-gem
[puppet-gem-source]: https://github.com/puppetlabs/puppet/blob/master/lib/puppet/provider/package/gem.rb
