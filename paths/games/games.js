﻿// ViewModel KnockOut
function ViewModel() {
  console.log("ViewModel initiated...");
  //---Variáveis locais
  const self = this;
  console.log(self);
  self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/games");
  self.displayName = "Olympic Game Editions List";
  self.error = ko.observable("");
  self.passingMessage = ko.observable("");
  self.records = ko.observableArray([]);
  self.currentPage = ko.observable(1);
  self.pagesize = ko.observable(21);
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
    const size = Math.min(self.totalPages(), 9);
    let step;
    if (size < 9 || self.currentPage() === 1) step = 0;
    else if (self.currentPage() >= self.totalPages() - 4)
      step = self.totalPages() - 9;
    else step = Math.max(self.currentPage() - 5, 0);

    for (let i = 1; i <= size; i++) list.push(i + step);
    return list;
  };

  //--- Page Events
  self.activate = function (id) {
    console.log("CALL: getGames...");
    const composedUri =
      self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
    ajaxHelper(composedUri, "GET").done(function (data) {
      console.log(data);
      hideLoading();
      self.records(data.Records);
      self.currentPage(data.CurrentPage);
      self.hasNext(data.HasNext);
      self.hasPrevious(data.HasPrevious);
      self.pagesize(data.PageSize);
      self.totalPages(data.TotalPages);
      self.totalRecords(data.TotalRecords);
      //self.SetFavourites();
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
    const sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split("&");
    console.log("sPageURL=", sPageURL);
    for (let urlVar of sURLVariables) {
      let sParameterName = urlVar.split("=");

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? undefined
          : decodeURIComponent(sParameterName[1]);
      }
    }
  }

  //! start
  showLoading();
  const pg = getUrlParameter("page");
  console.log(pg);
  if (pg === undefined) self.activate(1);
  else {
    self.activate(pg);
  }
  console.log("VM initialized!");
}

$(document).ready(function () {
  console.log("ready!");
  ko.applyBindings(new ViewModel());
});

$(document).ajaxComplete(function (event, xhr, options) {
  $("#myModal").modal("hide");
});
