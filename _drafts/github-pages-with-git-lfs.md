---
layout: post
title: GitHub Pages with Git LFS
excerpt: A word of warning, if you'd like to use Git LFS with GitHub Pages.
---

[Recently][git-lfs-tweet], I decided to take another look at [Git LFS][git-lfs]. I was blown away by the simplicity of
the extension to the already awesome Git VCS but also the ease of use of GitHub's implementation of the feature.

<img id="git-lfs-graphic" src="/assets/img/posts/gituhb-pages-with-git-lfs/git-lfs-graphic.gif" />

Git LFS allows you to store large like binary files, assets and other files that you don't want to clog up a Git repo
and store them on a storage network like the one provided by [GitHub][github]. You can get a bit more of an
understanding on what Git LFS is [here][git-lfs]. It's really easy to install and setup - just follow the instructions
on the site. 

Previously, [I've blogged about my site][github-pages-post] telling you all about how wonderful Jekyll is on
GitHub Pages. When I found out how great Git LFS is, I naturally wanted to know if I could use Git LFS to store assets
for my sites, such as Photoshop assets, large images, PDFs, etc. Through trial and error, I found that GitHub Pages
does not allow you to serve assets from Git LFS in your GitHub Pages site, which is a little disappointing. :disappointed:

I turned to Uncle Google to make sure that there wasn't a workaround for this that I hadn't thought of, but all I
found was [this][github-issue]. So it seems ([from a GitHub employee][github-issue-comment]) that Git LFS is not
supported by GitHub Pages, outright. Sad, because it would be great!

GitHub are a great company and in the past when I've had questions or queries, they've been most helpful. I decided to
ask them why they don't support this feature, merely to satisfy my own curiosity. [Jess Hosman at GitHub][jess-hosman]
kindly replied to my email (really quickly! :grinning:):

> Hi Joe,
>
> Thanks for getting in touch! LFS with GitHub Pages is something we'd love to support in the future, but still have some work to do to get us there. I'll definitely pass this along to the team, and let them know you'd find that feature useful.
>
> Thanks so much for the feedback, and let us know if you notice anything else that could be improved.
>
> Cheers,
>
> Jess

So, at least there's hope that this feature will be supported by GitHub in the future - It wasn't just a point blank
_"No!"_ that we come to expect from large companies like Apple and Google nowadays.

This post is a little different from my recent posts as it's less of a tutorial/how-to format and instead a more "FYI"
style post. Hopefully Google will index it and help others get to the conclusion I did, without having to waste too
much time. Furthermore, hopefully GitHub will implement this feature sooner rather than later!

As always, hit me up in the comments section below if you have questions or comments!

[git-lfs-tweet]: https://twitter.com/JoeNyland/status/718732564882710529
[git-lfs-repo]: https://github.com/github/git-lf
[git-lfs]: https://git-lfs.github.com
[github]: https://github.com
[github-pages-post]: {% post_url 2015-06-22-so_im_using_jekyll_to_run_my_blog %}
[github-issue]: https://github.com/github/git-lfs/issues/791
[github-issue-comment]: https://github.com/github/git-lfs/issues/791#issuecomment-151318020
[jess-hosman]: https://github.com/jhosman
