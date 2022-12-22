$("document").ready(function () {
  const carousel = new bootstrap.Carousel("#myCarousel", {
    interval: 10000,
  });

  $(".navbarButton").hover(function () {
    $(this).toggleClass("border-white border-bottom border-2 active");
  });

  $(".navbarButton2").hover(function () {
    $(this).toggleClass("btn btn-primary ");
  });
});

