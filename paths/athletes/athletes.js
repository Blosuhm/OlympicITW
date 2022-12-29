﻿// ViewModel KnockOut
function vm() {
  console.log("ViewModel initiated...");
  //---Variáveis locais
  let self = this;
  self.baseUri = ko.observable("athletes.json");
  // self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/athletes");
  self.displayName = "Olympic Athletes List";
  self.error = ko.observable("");
  self.passingMessage = ko.observable("");
  self.records = ko.observableArray([]);
  self.currentPage = ko.observable(1);
  self.pagesize = ko.observable(20);
  self.totalRecords = ko.observable(50);
  self.hasPrevious = ko.observable(false);
  self.hasNext = ko.observable(false);
  self.previousPage = ko.computed(function () {
    return self.currentPage() * 1 - 1;
  }, self);
  self.nextPage = ko.computed(function () {
    return self.currentPage() * 1 + 1;
  }, self);
  self.fromRecord = ko.computed(function () {
    return self.previousPage() * self.pagesize() + 1;
  }, self);
  self.toRecord = ko.computed(function () {
    return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
  }, self);
  self.totalPages = ko.observable(0);
  self.pageArray = function () {
    let list = [];
    let size = Math.min(self.totalPages(), 9);
    let step;
    if (size < 9 || self.currentPage() === 1) step = 0;
    else if (self.currentPage() >= self.totalPages() - 4)
      step = self.totalPages() - 9;
    else step = Math.max(self.currentPage() - 5, 0);

    for (let i = 1; i <= size; i++) list.push(i + step);
    return list;
  };

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
    let composedUri =
      self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
    ajaxHelper(composedUri, "GET").done(function (data) {
      console.log(data);
      hideLoading();

      self.currentPage(data.CurrentPage);
      self.hasNext(data.HasNext);
      self.hasPrevious(data.HasPrevious);
      self.pagesize(data.PageSize);
      self.totalPages(data.TotalPages);
      self.totalRecords(data.TotalRecords);
      self.SetFavorites(JSON.parse(localStorage.getItem("favourites")));

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
      let counter = 0;
      for (let athlete of self.records()) {
        counter++;
        $.ajax({
          url:
            "http://192.168.160.58/Olympics/api/athletes/fulldetails?id=" +
            athlete().Id,
          type: "GET",
          dataType: "json",
          success: function (data) {
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
          },
        }).then(function () {
          self.records(athletes);
          addShadow();
        });

        sleep(100);
      }

      console.log(self.records());
    });
  };

  //--- Internal functions
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

  //--- start ....
  showLoading();
  let pg = getUrlParameter("page");
  console.log(pg);
  if (pg == undefined) self.activate(1);
  else {
    self.activate(pg);
  }
  console.log("VM initialized!");
}

$(document).ready(function () {
  console.log("ready!");
  ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
  $("#myModal").modal("hide");
});

$("body").click(function () {
  addShadow();
});

function addShadow() {
  $(".gold").each(function () {
    let element = $(this);
    let uncle = element.parent().siblings().first().children().first();
    uncle.addClass("shadow-gold");
  });
  $(".silver").each(function () {
    let element = $(this);
    let uncle = element.parent().siblings().first().children().first();
    uncle.addClass("shadow-silver");
  });
  $(".bronze").each(function () {
    let element = $(this);
    let uncle = element.parent().siblings().first().children().first();
    uncle.addClass("shadow-bronze");
  });
}
