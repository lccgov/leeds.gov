(function (global) {
    "use strict";

    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    LCC.Settings = LCC.Settings || {};

    LCC.Modules.NearestSchool = function () {

        this.start = function (element) {

            LCC.Modules.NearestSchool.ShowResults =  function() {
               // $("#nearestschool-results").show();
            };
        
            $(document).ready(function () {
                $("#tblSchool").hide();

                $('#postcode').keypress(function (event) {
                    if (event.keyCode == 13) {
                        $('#postcodeLookup').click();
                        return false;
                    }
                });

                $("#postcodeLookup").click(function (e) {
                    //LCC.Modules.NearestSchool.ShowResults();
                    $("#tblSchoolDetails").html('');
                    $("#lblMessage").html("Please wait...");
                    $("#tblSchool").hide();

                    var pCode = $('#postcode').val();
                       $.getJSON('https://api-nearestschool-test.leeds.gov.uk/api/GetSchoolNearestToPostcode_Result/' + pCode.replace(/\s/g, ''), function (data) {

                        if (data.length == 0) {
                            $("#lblMessage").html('No results returned.');
                        }
                        else
                        {
                            $("#lblMessage").html(data.length + " result(s) found. ");
                            $("#tblSchool").show();
                            $.each(data, function (key, value) {
                                var schoolDetails = "<tr><td>" + value.Name + "</td><td>" + value.Distance.toFixed(2) + " miles </td></tr>";
                                $("#tblSchoolDetails").append(schoolDetails);
                            });
                        }
                    });
                });
            });
        };

    };

    global.LCC = LCC;
})(window);