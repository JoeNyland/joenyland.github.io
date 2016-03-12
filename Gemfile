source 'https://rubygems.org'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', versions['github-pages']
gem 'jekyll'
gem 'jekyll-compose', group: [:jekyll_plugins]

group :test do
  gem 'html-proofer', '~> 3'
end

group :development, :test do
  gem 'rake'
end
