source 'https://rubygems.org'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', versions['github-pages']
gem 'jekyll'

group :development do
  gem 'jekyll-compose'
end

group :test do
  gem 'html-proofer'
end

group :development, :test do
  gem 'rake'
end
