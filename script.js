$("document").ready(function () {
  const carousel = new bootstrap.Carousel("#myCarousel", {
    interval: 10000,
  });
});

$('#myCarousel').on('slide.bs.carousel', function(event) {
  
  if (event.relatedTarget.id === 'Slide2' || event.relatedTarget.id === 'Slide3') {  // Dependendo do slide a navbar pode precisar de ocupacidade
    $('#neubar').addClass('bg-opacity-75');
    $('#neubar').removeClass('bg-opacity-10');
  }

  else{
    $('#neubar').addClass('bg-opacity-10');
    $('#neubar').removeClass('bg-opacity-75');
  }
  });
