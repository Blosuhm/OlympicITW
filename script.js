function vm() {
  const self = this;

  self.nome = ko.observable("");
  self.email = ko.observable("");
  self.telemovel = ko.observable("");
  self.nomeValido = ko.computed(function () {
    return self.nome().length > 3;
  });
  self.emailValido = ko.computed(function () {
    return self
      .email()
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  });

  self.telemovelValido = ko.computed(function () {
    return self.telemovel().length > 8;
  });

  self.activeNovidades = ko.computed(function () {
    return self.nomeValido() && self.emailValido() && self.telemovelValido();
  });

  self.clearAll = function () {
    self.nome("");
    self.email("");
    self.telemovel("");
  };
}

$("document").ready(function () {
  ko.applyBindings(new vm());

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
  const map = L.map("map").setView([40.633062, -8.659224], 20);

  // Adiciona uma camada de base (tiles) ao mapa
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const coords = [
    [40.63322921159137, -8.65928649902344],
    [40.6332332826146, -8.659125566482546],
    [40.63280989486929, -8.659109473228456],
    [40.63280175277096, -8.65928113460541],
    [40.63307206988017, -8.659291863441469],
    [40.63306962729764, -8.659399151802065],
    [40.63313232115286, -8.659409880638124],
    [40.63313639218198, -8.659474253654482],
    [40.63308536863199, -8.659479618072512],
    [40.63308753981594, -8.659651279449465],
    [40.63351092580074, -8.659656643867494],
    [40.63351906781259, -8.659495711326601],
    [40.63325038089704, -8.659479618072512],
    [40.63325038089704, -8.659356236457826],
    [40.63325038089704, -8.659350872039797],
    [40.633185244512255, -8.659350872039797],
    [40.63318931553818, -8.65928113460541],
  ];

  const polygon = L.polygon(coords).addTo(map);
  //Adiciona um marcador na Avenida João Jacinto Magalhães
  L.marker([40.633062, -8.659224])
    .addTo(map)
    .bindPopup("Estamos aqui!")
    .openPopup();

  map.on("click", function (event) {
    const coords = event.latlng;
    console.log(coords.lat, coords.lng);
  });

  $("#scroll-button1").click(function () {
    // Scroll to the element with the ID "target-element"
    $("html, body").animate(
      {
        scrollTop: $("#target-element1").offset().top,
      },
      1000
    );
  });

  $("#BackTop-button").click(function () {
    // Scroll to the element with the ID "target-element"
    $("html, body").animate(
      {
        scrollTop: $("#myCarousel").offset().top,
      },
      1000
    );
  });

  $("#scroll-button2").click(function () {
    // Scroll to the element with the ID "target-element"
    $("html, body").animate(
      {
        scrollTop: $("#target-element2").offset().top,
      },
      1000
    );
  });

  const navbar = document.querySelector("#neubar");
  const car = document.querySelector("#myCarousel");

  const handleScroll = () => {
    if (window.scrollY > car.offsetTop + car.offsetHeight) {
      navbar.classList.add("navbarBG");
    } else {
      navbar.classList.remove("navbarBG");
    }
  };

  document.addEventListener("scroll", handleScroll);

  handleScroll();
});

//! Search

$(".search").on("mouseenter", function () {
  $(".search input").focus();
  $(".search input").val("");
});

$(".search").on("mouseleave", function () {
  $(".search input").blur();
  $(".search input").val("");
});
