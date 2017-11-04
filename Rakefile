require 'html-proofer'
require 'jekyll'

task :default => :test

desc 'Test the site for errors'
task :test => [:build] do
  options = {
    check_favicon: true,
    check_html: true,
    allow_hash_href: true,
    typhoeus: {
      headers: { 'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/601.7.7 (KHTML, like Gecko) Version/9.1.2 Safari/601.7.7' }
    },
    cache: {
      timeframe: '2w'
    }
  }
  HTMLProofer.check_directory('./_site', options).run
end

task :build => [:clean] do
  config = Jekyll.configuration safe: ENV.has_key?('JEKYLL_SAFE')
  site = Jekyll::Site.new(config)
  Jekyll::Commands::Build.build site, config
end

task :clean do
  config = Jekyll.configuration
  Jekyll::Commands::Clean.process config
end
