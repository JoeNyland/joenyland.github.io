$(document).ready(function () {

    // Send GA event when user scrolls to the bottom of the page, which we interpret as them reading the content
    // on the page.
    (function(){
        var triggered = false;
        $(window).scroll(function () {
            if (($(window).scrollTop() >= $(document).height() - $(window).height() - 10) && !triggered) {
                triggered = true;
                ga('send', 'event', 'Page', 'Scroll', 'Bottom');
            }
        });
    })();

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
