$(document).ready(function () {

    /* Add the current year to the footer */
    function getYear() {
        var d = new Date();
        var n = d.getFullYear();
        return n.toString();
    }
    $('#year').html(getYear());

});
