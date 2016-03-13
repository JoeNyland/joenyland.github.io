require 'html-proofer'
require 'twitter'
require 'jekyll'

task :default => :test

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

task :tweet_link_to_last_post do

  # Connect to the Twitter API
  client = Twitter::REST::Client.new do |config|
    YAML.load_file('twitter-api-credentials.yaml').each do |config_item,value|
      config.send "#{config_item}=", value
    end
  end

end
