$(document).ready(function () {
    /* Add the current year to the footer */
    function getYear() {
        var d = new Date();
        var n = d.getFullYear();
        return n.toString();
    }
    $('#year').html(getYear());

    // Scroll to top button
    // Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.btn#back-to-top').fadeIn();
        } else {
            $('.btn#back-to-top').fadeOut();
        }
    });

    // Click event to scroll to top
    $('.btn#back-to-top').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });
});
