function showEvents(){  //   <!--É PARA MUDAR ISTO !!!-->
    if ($("#list_Events").hasClass("d-none")) {
        $("#list_Events").addClass('d-block').removeClass('d-none');
    }
    else {
        $("#list_Events").addClass('d-none').removeClass('d-block');
    }
}

function showParticipations(){  //  <!--É PARA MUDAR ISTO !!!-->
    if ($("#list_Participations").hasClass("d-none")) {
        $("#list_Participations").addClass('d-block').removeClass('d-none');
    }
    else {
        $("#list_Participations").addClass('d-none').removeClass('d-block');
    }
}

function showOrganizations(){  //  <!--É PARA MUDAR ISTO !!!-->
    
    if ($("#list_Organizations").hasClass("d-none")) {
        $("#list_Organizations").addClass('d-block').removeClass('d-none');
    }
    else {
        $("#list_Organizations").addClass('d-none').removeClass('d-block');
    }
}


// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Countries/');
    self.displayName = 'Olympic Countries edition Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.IOC = ko.observable('');
    self.Flag = ko.observable('');
    self.Events = ko.observable('');
    self.Participant = ko.observable('');
    self.Organizer = ko.observable('');

    self.Url = ko.observable('');

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getCountrie...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.IOC(data.IOC);
            self.Flag(data.Flag);
            self.Events(data.Events);
            self.Participant(data.Participant);
            self.Organizer(data.Organizer);
        });
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
    

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})
