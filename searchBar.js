var ViewModel = function () {
    console.log("ViewModel initiated...");
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable("http://192.168.160.58/Olympics/api/Athletes?page=1&pageSize=135571");
    //self.baseUri = ko.observable('http://localhost:62595/api/drivers');
    self.texto = ko.observable("")
    self.Athletes = ko.observableArray([]);
    self.error = ko.observable("");
    
    //--- Page Events
    self.activate = function (q) {
      console.log("CALL: getData...");

      

        var composedUri = self.baseUri()
        ajaxHelper(composedUri, "GET").done(function (data) {
            self.Athletes = ko.computed(function(){
                return data.Records.map(function(item){
                    return item.Name
                })
            })
            $("#searchBar").autocomplete({
                minLength: 5,
                selectFirst: true,
                source: self.Athletes()
            });
            })
            hideLoading();
            //self.SetFavourites();
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
      var sPageURL = window.location.search.substring(1),
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
    self.activate(self.texto)
    
    console.log("VM initialized!");
    
};


$("document").ready(function () {
    
    ko.applyBindings(new ViewModel());

});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})