---
layout: post
title:  "How to test a Jekyll site"
excerpt: "Testing is great, so you should test your site as well as your code."
---

Whilst I can build a site as awesome and as fantastic as this, I'm only human. That means that I make mistakes, just
like everyone does. Testing the code that you write means that those mistakes get found and rectified, hopefully before
end users/readers/customers (whatever the context) see them in production.

I'm a big fan of unit testing and integration testing my code, but I didn't know just how easy it was to test my 
Jekyll based site until I read [this article][1]. I couldn't resist having a go at this myself and I've been able to 
get some testing in place for my site and blog. It's by no means the kind of test coverage I'd like, but some tests are 
better than no tests, right?

I've come up with the following Rakefile that I can use to test my site, pre-release:

{% highlight ruby %}
require 'html-proofer'

task :test => [:build] do
  HTMLProofer.check_directory('./_site',{
                                 :check_favicon => true,
                                 :check_html => true
                             }).run
end

task :build => [:clean] do
  system 'bundle exec jekyll build'
end

task :clean do
  system 'bundle exec jekyll clean'
end
{% endhighlight %}

As we're using HTMLProofer, you'll need to make sure that you've installed the HTMLProofer gem manually, or preferably
in your `Gemfile`, like so:

{% highlight ruby %}
group :test do
  gem 'html-proofer', '~> 3'
end
{% endhighlight %}

...and then run `bundle` to install the gem and it's dependencies.

I'm also running [Travis CI][4] on my site's GitHub repo too. Whenever I push to my site's repo on GitHub, a build is 
triggered on Travis automatically. That means that if I miss any issues in local testing before deploying any changes, 
I get an email pinged across to me from Travis. Kind of like another set of eyes on the tests, if you will. Overkill? 
Maybe, but it's not doing any harm and I learnt a bit about Travis CI in the process and I plan to use it in all 
[my major projects][3] moving forward.

It also means I get a nice badge to show off in the [README][6] :sunglasses::

![Screenshot of README.md](/assets/img/posts/how_to_test_a_jekyll_site/readme_screenshot.png)

Now, I'll be the first to throw my hands up and say that this is by no means perfect. I really don't like the fact that 
I have to call `jekyll build` as a command from within a Rake task. Instead, I should be able to start a build of the 
site directly from within the Rake task, but I've yet to work out how to do this. To that end, I've posted a 
[question on StackOverflow][2], hoping that some clever soul will be able to help work it out. For now, the above is 
achieving the purpose as I've corrected a few issues with broken links on my site already and also corrected some HTML 
validation issues too.

If you're using Jekyll for your sites or blogs and you're not already running some sort of tests, then I recommend you 
give this a go!

### Update 12/03/2016
I've updated the Rake tasks in the code snippet above to work with HTMLProofer 3 which was recently released. The old
code no longer worked with the latest versions of that gem.

[1]: http://www.jacobtomlinson.co.uk/jekyll/2015/02/18/test-you-jekyll-blog-with-travis-ci/
[2]: http://stackoverflow.com/questions/33582197/how-do-i-build-a-jekyll-site-from-rake-task-without-using-the-command-line
[3]: /portfolio
[4]: https://travis-ci.org
[6]: https://github.com/JoeNyland/joenyland.github.io/blob/master/README.md
