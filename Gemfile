source 'https://rubygems.org'

require 'json'
require 'open-uri'
versions = JSON.parse(open('https://pages.github.com/versions.json').read)

gem 'github-pages', versions['github-pages']
gem 'jekyll'

# Using this gem for workflow until Jekyll >=2.5.0 is available on GitHub Pages, thus allowing the use of the jekyll-compose plugin
gem 'mr_poole'
