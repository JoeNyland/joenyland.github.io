/**
 * Project: masterroot24.github.io
 */

$(document).ready(function () {

    /* Add the current year to the footer */
    function getYear() {
        var d = new Date();
        var n = d.getFullYear();
        return n.toString();
    }
    $('#year').html(getYear());

    /* Enable Bootstrap tooltips */
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });

    /* Avatar Hover Zoom */
    $("#about-avatar").hover(function () {
            $(this).switchClass('avatar-md', 'avatar-lg');
        },
        function () {
            $(this).switchClass('avatar-lg', 'avatar-md');
        }
    );

    /* goBack() function */
    function goBack() {
        window.history.back()
    }

});
