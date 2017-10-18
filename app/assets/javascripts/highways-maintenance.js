(function (global) {
    "use strict";

    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    LCC.Settings = LCC.Settings || {};

    LCC.Modules.HighwaysMaintenance = function () {

        this.start = function (element) {

            $(document).ready(function () {

                $("#showStreet").click(function (e) {

                    $("#tblResults").html('');

                    var ward = 'ALL';

                    var street = 'ALL';
                    if ($('#full-name-f1').val() != '') {
                        street = $('#full-name-f1').val();
                    }

                    $.getJSON('https://api.highwaysmaintenance.leeds.gov.uk/api/getSearchdata2014_Result/' + ward +'/' + street + '/Ward', function (data) {
                        $.each(data, function (key, value) {
                            var markup1 = "<tr><td>" + value.Promoter + "</td><td>" + value.Road + "</td><td>" + value.From___To + "</td><td>" + value.Nature_of_Works + "</td><td>" + value.Start_Date + "</td><td>" + value.Duration__weeks_ + "</td><td>" + value.Description + "</td></tr>";
                            $("#tblResults").append(markup1);
                        });
                    });
                });

                $("#select-box").change(function () {
                    var street = 'ALL';
                    var ward = this.value;
                    if (ward == 'All wards') 
                    {
                        ward = 'ALL';
                    }

                    $("#tblResults").html('');

                    $.getJSON('https://api.highwaysmaintenance.leeds.gov.uk/api/getSearchdata2014_Result/' + ward + '/' + street + '/Ward', function (data) {
                        $.each(data, function (key, value) {
                            var markup1 = "<tr><td>" + value.Promoter + "</td><td>" + value.Road + "</td><td>" + value.From___To + "</td><td>" + value.Nature_of_Works + "</td><td>" + value.Start_Date + "</td><td>" + value.Duration__weeks_ + "</td><td>" + value.Description + "</td></tr>";
                            $("#tblResults").append(markup1);
                        });
                    });
                });

                $.getJSON('https://api.highwaysmaintenance.leeds.gov.uk/api/getTreatmentTypes_Result', function (data) {
                    $.each(data, function (key, value) {
                        var markup2 = "<tr><td>" + value.Code + "</td><td>" + value.Treatment + "</td><td>" + value.Description + "</td></tr>";
                        $("#tblTreatmentTypes").append(markup2);
                    });
                });
            });
        };
    };

    global.LCC = LCC;
})(window);