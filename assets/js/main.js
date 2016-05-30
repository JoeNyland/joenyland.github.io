$(document).ready(function () {

    /* Add the current year to the footer */
    function getYear() {
        var d = new Date();
        var n = d.getFullYear();
        return n.toString();
    }
    $('#year').html(getYear());

    (function(){
        var triggered = false;
        $(window).scroll(function () {
            if (($(window).scrollTop() >= $(document).height() - $(window).height() - 10) && !triggered) {
                triggered = true;
                ga('send', 'event', 'Page', 'Scroll', 'Bottom');
            }
        });
    })()

});
