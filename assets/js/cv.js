$(document).ready(function () {
    // Scroll to top button
    var back_to_top_button = $('.btn.back-to-top');

    // Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            back_to_top_button.fadeIn();
        } else {
            back_to_top_button.fadeOut();
        }
    });

    // Click event to scroll to top
    back_to_top_button.click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });
});
