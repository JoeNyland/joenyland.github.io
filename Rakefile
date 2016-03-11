require 'html-proofer'

task :default => :test

task :test => [:build] do
  HTMLProofer.check_directory('./_site',{
                                 # :only_4xx => true,
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
