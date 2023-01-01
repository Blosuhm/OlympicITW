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

  // Cria um mapa e define a posição inicial e o zoom
  // Cria um mapa e define a posição inicial e o zoom
  var map = L.map('map').setView([40.633062, -8.659224], 20);

  // Adiciona uma camada de base (tiles) ao mapa
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var coords = [[40.63322921159137,-8.65928649902344],
  [40.6332332826146,-8.659125566482546],
  [40.63280989486929,-8.659109473228456],
  [40.63280175277096,-8.65928113460541],
  [40.63307206988017,-8.659291863441469],
  [40.63306962729764,-8.659399151802065],
  [40.63313232115286,-8.659409880638124],
  [40.63313639218198,-8.659474253654482],
  [40.63308536863199,-8.659479618072512],
  [40.63308753981594,-8.659651279449465],
  [40.63351092580074,-8.659656643867494],
  [40.63351906781259,-8.659495711326601],
  [40.63325038089704,-8.659479618072512],
  [40.63325038089704,-8.659356236457826],
  [40.63325038089704,-8.659350872039797],
  [40.633185244512255,-8.659350872039797],
  [40.63318931553818,-8.65928113460541]];
  

var polygon = L.polygon(coords).addTo(map);
  //Adiciona um marcador na Avenida João Jacinto Magalhães
  L.marker([40.633062, -8.659224]).addTo(map)
      .bindPopup('Estamos aqui!')
      .openPopup();

  map.on('click', function(event) {
  var coords = event.latlng;
  console.log(coords.lat, coords.lng);
});
      
});

