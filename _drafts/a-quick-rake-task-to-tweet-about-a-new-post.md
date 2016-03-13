---
layout: post
title: A quick rake task to tweet about a new post
excerpt: Here's a quick and easy Rake task to tweet when a new post is published
---

I use [Twitter][1] a fair bit, so I like to fire a quick tweet out to my many (not) followers when I've published a new
post :bird:. This task was a bit of a pain, so I thought I'd throw together a quick `Rake` task to do this for me.

* To get this to work, you'll need to install the `twitter` gem manually or, by adding it to your `Gemfile`.
* You'll also need to create config file that will store the API keys for the `twitter` gem to use to authenticate
with the Twitter API. Use the following template, enter your API keys and save it as `twitter-api-credentials.yaml`
right next to your `Rakefile`:

{% highlight yaml %}
consumer_key:
consumer_secret:
access_token:
access_token_secret:
{% endhighlight %}
* You can get your API keys by creating yourself an app at the [Twitter dev site][2].
* Add the following task to your Rakefile:
{% highlight bash %}
require 'twitter'

desc 'Tweet about a new post'
task :tweet_link_to_post , [:title, :url] do |task,args|

  # Connect to the Twitter API
  client = Twitter::REST::Client.new do |config|
    YAML.load_file('twitter-api-credentials.yaml').each do |config_item,value|
      config.send "#{config_item}=", value
    end
  end

  # Check that we've been provided with a title and URL
  fail 'Missing title or URL' if args[:title].nil? or args[:url].nil?

  # Confirm the message with the user to make sure they're happy with it
  puts 'This is the message that will be tweeted:'
  puts message = "I just published a blog post: “#{args['title']}” Check it out here: #{args['url']}"
  puts 'Happy with it? Enter yes or no:'
  response = STDIN.gets.chomp

  if %w{y yes}.include? response.downcase
    # User is happy, so let's tweet it!
    client.update message
    puts 'Ok, tweeted that to your followers!'
  elsif %w{n no}.include? response.downcase
    # User has changed their mind, so don't tweet
    puts 'Not tweeting, as requested.'
  else
    # Invalid response, so
    fail 'You must answer yes or no'
  end

end
{% endhighlight %}
* When you're ready, run the task with:
{% highlight bash %}
rake tweet_link_to_post[$TITLE_OF_POST,$URL_OF_POST]
{% endhighlight %}
... but obviously change the `$TITLE_OF_POST` and `$URL_OF_POST` parameters to those of the post that you've just published :smile:.

[1]: https://twitter.com/JoeNyland
[2]: https://apps.twitter.com
