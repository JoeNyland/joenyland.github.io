$(document).ready(function() {
  // Scroll to top button
  // Check to see if the window is top if not then display button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $(".btn#scroll-to-the-top").fadeIn();
    } else {
      $(".btn#scroll-to-the-top").fadeOut();
    }
  });

  // Click event to scroll to top
  $(".btn#scroll-to-the-top").click(function() {
    $("html, body").animate({scrollTop: 0}, 800);
    return false;
  });
});
