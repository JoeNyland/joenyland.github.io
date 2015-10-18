function loadBlogPosts(url, target_div, limit) {
    // Default to a limit of 6 blog posts, unless it's overridden by the script calling this function
    limit = limit || 6;

    // First, get posts from the blog
    $.ajax({
        url: url,
        jsonpCallback: "postsCallback",
        dataType: "jsonp",  // Tell jQuery we're expecting JSONp
        success: function(data) {

            for (var post_id in data) {
                if (post_id < limit) {
                    var post = data[post_id];

                    // For each post, create a div and populate it with the information about the current blog post
                    var post_div = document.createElement('div');       // Create a <div>
                    post_div.className = 'col-sm-4 col-md-4';                    // Set the class of the <div>
                    // Finally, add the post data into the <div>
                    post_div.innerHTML = '<h4><a href="' + post.url + '">' + post.title + '</a></h4>' +
                        '<p>' + post.excerpt + '</p>' +
                        '<p><a class="btn btn-default" href="' + post.url + '" role="button">View post &raquo;</a></p>';

                    // Now, actually add our new <div> to the recent-blog-articles <div>
                    $(target_div).append(post_div);
                } else {
                    // We've reached the limit of posts to display, so break out of the loop
                    break;
                }
            }

            // Finally return true to confirm that this function has completed
            return true;

        }
    });
}

$(document).ready(function () {
    loadBlogPosts(
        'http://blog.joenyland.me/posts.jsonp',
        $('.recent-blog-articles')
    );
});
