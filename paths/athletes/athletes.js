// ViewModel KnockOut
function ViewModel() {
  console.log("ViewModel initiated...");
  //---Variáveis locais
  let self = this;
  self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/athletes");
  // self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/athletes");
  self.displayName = "Olympic Athletes";
  self.error = ko.observable("");
  self.passingMessage = ko.observable("");
  self.records = ko.observableArray([]);
  self.currentPage = ko.observable(1);
  self.SetFavorites = ko.observableArray([]);
  self.isFavorite = function (element) {
    console.log(self.SetFavorites());

    // If there are no favorites, return false
    if (!self.SetFavorites()) {
      return false;
    }

    // Return true if the element's Id is in the favorites array
    return self
      .SetFavorites()
      .some((item) => Number(item) === Number(element.Id));
  };
  self.addFavorite = function (element) {
    // Get the favorites array from local storage
    let favorites = JSON.parse(localStorage.getItem("favorites"));
    // If there are no favorites, create an empty array
    if (!favorites) {
      favorites = [];
    }
    // Add the element's Id to the favorites array
    if (favorites.includes(element.Id)) {
      favorites.push(element.Id);
      // Save the updated favorites array to local storage
      localStorage.setItem("favorites", JSON.stringify(favorites));
      self.SetFavorites(favorites);
    }
  };

  //--- Page Events
  self.activate = function (id) {
    console.log("CALL: getAthletes...");
    let composedUri = `${self.baseUri()}/page=1&pageSize=135600`;
    ajaxHelper(composedUri, "GET").done(function (data) {
      console.log(data);

      self.SetFavorites(JSON.parse(localStorage.getItem("favourites")));
      //* Load Athletes
      let athletes = shuffleArray(
        data.Records.filter(
          (item) =>
            item.BestPosition < 4 &&
            item.Photo &&
            !item.Photo.includes("th.bing")
        )
      ).slice(0, 12);
      athletes = $.map(athletes, function (athlete) {
        const name = athlete.Name.split(" ");
        athlete.Name = `${name[0]} ${name[name.length - 1].toUpperCase()}`;
        athlete.Details = {
          Country: ko.observable(""),
          Modality: ko.observable(""),
          Medals: ko.observableArray([]),
        };
        return ko.observable(athlete);
      });
      self.records(athletes);
      for (let athlete of self.records()) {
        composedUri = `${self.baseUri()}/fulldetails?id=${athlete().Id}`;
        ajaxHelper(composedUri, "GET")
          .done(function (data) {
            athlete().Details.Country(
              data.BornPlace
                ? data.BornPlace.split(" ")
                    [data.BornPlace.split(" ").length - 1].replaceAll(")", "")
                    .replaceAll("(", "")
                    .slice(-3)
                : "<br>"
            );
            athlete().Details.Modality(data.Modalities[0].Name);
            athlete().Details.Medals(data.Medals);
          })
          .then(function () {
            self.records(athletes);
            addShadow();
          });
        // $.ajax({
        //   url:
        //     "http://192.168.160.58/Olympics/api/athletes/fulldetails?id=" +
        //     athlete().Id,
        //   type: "GET",
        //   dataType: "json",
        //   success: function (data) {
        //     athlete().Details.Country(
        //       data.BornPlace
        //         ? data.BornPlace.split(" ")
        //             [data.BornPlace.split(" ").length - 1].replaceAll(")", "")
        //             .replaceAll("(", "")
        //             .slice(-3)
        //         : "<br>"
        //     );
        //     athlete().Details.Modality(data.Modalities[0].Name);
        //     athlete().Details.Medals(data.Medals);
        //   },
        // }).then(function () {
        //   self.records(athletes);
        //   addShadow();
        // });

        sleep(100);
      }
      hideLoading();
      console.log(self.records());
    });
  };

  //* Internal functions
  function ajaxHelper(uri, method, data) {
    self.error(""); // Clear error message
    return $.ajax({
      type: method,
      url: uri,
      dataType: "json",
      contentType: "application/json",
      data: data ? JSON.stringify(data) : null,
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX Call[" + uri + "] Fail...");
        hideLoading();
        self.error(errorThrown);
      },
    });
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
  }

  function showLoading() {
    $("#myModal").modal("show", {
      backdrop: "static",
      keyboard: false,
    });
  }
  function hideLoading() {
    $("#myModal").on("shown.bs.modal", function (e) {
      $("#myModal").modal("hide");
    });
  }

  function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split("&"),
      sParameterName,
      i;
    console.log("sPageURL=", sPageURL);
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? true
          : decodeURIComponent(sParameterName[1]);
      }
    }
  }

  //! Start
  showLoading();
  console.log("VM initialized!");
}

$(document).ready(function () {
  console.log("ready!");
  ko.applyBindings(new ViewModel());
});

$(document).ajaxComplete(function () {
  $("#myModal").modal("hide");
});

$("body").click(function () {
  addShadow();
});

function addShadow() {
  $(".gold").each(function () {
    let element = $(this);
    let uncle = element
      .parent()
      .siblings()
      .first()
      .children()
      .first()
      .children()
      .first();
    uncle.addClass("shadow-gold");
  });
  $(".silver").each(function () {
    let element = $(this);
    let uncle = element
      .parent()
      .siblings()
      .first()
      .children()
      .first()
      .children()
      .first();
    uncle.addClass("shadow-silver");
  });
  $(".bronze").each(function () {
    let element = $(this);
    let uncle = element
      .parent()
      .siblings()
      .first()
      .children()
      .first()
      .children()
      .first();
    uncle.addClass("shadow-bronze");
  });
}
