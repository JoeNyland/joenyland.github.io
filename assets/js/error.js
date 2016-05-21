// Random Gif on error page
$(document).ready(function(){
  $(".error-not-found").sort(function(){ return 0.5 - Math.random()}).first().show();
});
