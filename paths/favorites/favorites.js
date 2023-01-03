function ViewModel() {
  const self = this;

  self.favAthletes = ko.observableArray(
    JSON.parse(localStorage.getItem("athletes"))
  );
  self.favCountries = ko.observableArray(
    JSON.parse(localStorage.getItem("countries"))
  );
  self.favModalities = ko.observableArray(
    JSON.parse(localStorage.getItem("modalities"))
  );
  self.favGames = ko.observableArray(JSON.parse(localStorage.getItem("games")));

  self.toggleFavAthletes = function (data) {
    if (self.isFavorite(data.Id)) {
      self.favAthletes.remove(data);
    } else {
      self.favAthletes.push(data);
    }
    localStorage.setItem("athletes", JSON.stringify(self.favAthletes()));
    console.log(localStorage.getItem("athletes"));
  };

  self.toggleFavCountries = function (data) {
    if (self.isFavorite(data.Id)) {
      self.favCountries.remove(data);
    } else {
      self.favCountries.push(data);
    }
    localStorage.setItem("countries", JSON.stringify(self.favCountries()));
    console.log(localStorage.getItem("countries"));
  };

  self.toggleFavModalities = function (data) {
    if (self.isFavorite(data.Id)) {
      self.favModalities.remove(data);
    } else {
      self.favModalities.push(data);
    }
    localStorage.setItem("modalities", JSON.stringify(self.favModalities()));
    console.log(localStorage.getItem("modalities"));
  };

  self.toggleFavGames = function (data) {
    if (self.isFavorite(data.Id)) {
      self.favGames.remove(data);
    } else {
      self.favGames.push(data);
    }
    localStorage.setItem("games", JSON.stringify(self.favGames()));
    console.log(localStorage.getItem("games"));
  };
}

$().ready(function () {
  ko.applyBindings(new ViewModel());
  console.log("Viewmodel initiated!");
});
