require 'html/proofer'

task :test do
  sh 'bundle exec jekyll build'
  HTML::Proofer.new('./_site',{
                                 :only_4xx => true,
                                 :check_favicon => true,
                                 :error_sort => true
                             }).run
end
