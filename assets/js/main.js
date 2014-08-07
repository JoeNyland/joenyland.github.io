/**
 * Project: masterroot24.github.io
 */

$(document).ready(function () {

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

});
