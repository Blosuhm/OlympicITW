$().ready(function () {
  function vm() {
    const self = this;
    self.displayName = "Athletes";
    self.athletes = ko.observableArray([]);

    $.ajax({
      url: "athletes.json",
      type: "GET",
      dataType: "json",
      success: function (data) {
        let athletes = shuffleArray(
          data.Records.filter((item) => item.BestPosition < 4 && item.Photo)
        ).slice(0, 12);

        console.log(athletes);

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
              athlete.Details = details;
            },
          });
          self.athletes(athletes);
          sleep(75);
        }
      },
    });
  }

  ko.applyBindings(new vm());
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
