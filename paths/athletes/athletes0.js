$().ready(function () {
  let data;

  function getResponseData() {
    $.ajax({
      url: "athletes.json",
      type: "GET",
      dataType: "json",
      success: function (response) {
        data = response;
        getAthletesDetails(data, function (athletes) {
          console.log(athletes);
          console.log("ViewModel is ready");
          function vm() {
            const self = this;
            self.displayName = "Athletes";
            self.records = ko.observableArray(athletes);
            console.log(self.records());
          }

          ko.applyBindings(new vm());
        });
      },
    });
  }

  function getAthletesDetails(data, callback) {
    let athletes = shuffleArray(
      data.Records.filter((item) => item.BestPosition < 4 && item.Photo)
    ).slice(0, 12);

    for (let athlete of athletes) {
      $.ajax({
        url:
          "http://192.168.160.58/Olympics/api/athletes/fulldetails?id=" +
          athlete.Id,
        type: "GET",
        dataType: "json",
        success: function (data) {
          let details = {
            Country: data.BornPlace,
            Modality: data.Modalities[0].Name,
            Medals: data.Medals,
          };
          athlete.Details = ko.observable(details);
        },
      });
      sleep(75);
    }
    callback(athletes);
  }

  getResponseData();
});

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sleep(ms) {
  const start = Date.now();
  let elapsed = 0;
  while (elapsed < ms) {
    elapsed = Date.now() - start;
  }
}
