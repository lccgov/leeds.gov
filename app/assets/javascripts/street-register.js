(function (global) {
    "use strict";

    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    LCC.Settings = LCC.Settings || {};

    LCC.Modules.StreetRegister = function () {

        this.start = function (element) {

            LCC.Modules.StreetRegister.getStreetData = function (roadId) {
                $("#street-register_details").show();
                $("#street-register_results").hide();

                $.getJSON('https://api-streetregister.leeds.gov.uk/api/getAddress_Result/' + roadId, function (data) {
                    LCC.Modules.StreetRegister.clearData();
                    $.each(data, function (key, value) {

                        $("#divStreet").append("<p>" + value.Street + "</p>");
                        $("#divFrom").append("<p>" + value.From + "</p>");
                        $("#divTo").append("<p>" + value.To + "</p>");
                        $("#divStatus").append("<p>" + value.Status + "</p>");
                        $("#divLength").append("<p>" + value.Length + "</p>");
                        $("#divInfo").append("<p>" + value.PublicInfo + "</p>");
                        $("#divReference").append("<p>" + value.NSG + "</p>");

                        if (data[0].FoothpathFrom != null) {
                            $("#footpaths").show();
                            for (var i = 0; i < data[0].FoothpathFrom.length; i++) {
                                $("#tblFootpaths").append("<tr><td>" +  data[0].FoothpathFrom[i] + "</td><td>" + data[0].FoothpathTo[i] + "</td><td>" + data[0].FoothpathStatus[i] + "</td></tr>");
                            }
                        }
                        else
                        {
                            $("#footpaths").hide();
                        }

                        if (data[0].UnnamedStreetFrom != null) {
                            $("#un-named-streets").show();
                            for (var i = 0; i < data[0].UnnamedStreetFrom.length; i++) {
                                $("#tblUnnamedStreets").append("<tr><td>" + data[0].UnnamedStreetFrom[i] + "</td><td>" + data[0].UnnamedStreetTo[i] + "</td><td>" + data[0].UnnamedStreetStatus[i] + "</td></tr>");
                            }
                        }
                        else
                        {
                            $("#un-named-streets").hide();
                        }

                        if (data[0].SplitStreetsFrom != null) {
                            $("#split-streets").show();
                            for (var i = 0; i < data[0].SplitStreetsFrom.length; i++) {
                                $("#tblSplitStreets").append("<tr><td>" + data[0].SplitStreetsFrom[i] + "</td><td>" + data[0].SplitStreetsTo[i] + "</td><td>" + data[0].SplitStreetsStatus[i] + "</td></tr>");
                            }
                        }
                        else
                        {
                            $("#split-streets").hide();
                        }
                    });
                });
            };

            LCC.Modules.StreetRegister.ShowResults =  function() {
                LCC.Modules.StreetRegister.clearData();
                $("#street-register_details").hide();
                $("#street-register_results").show();
            };
        
            LCC.Modules.StreetRegister.clearData =  function() {
                $("#divStreet").html('');
                $("#divFrom").html('');
                $("#divTo").html('');
                $("#divStatus").html('');
                $("#divLength").html('');
                $("#divInfo").html('');
                $("#divReference").html('');
                $("#tblFootpaths").html('');
                $("#tblUnnamedStreets").html('');
                $("#tblSplitStreets").html('');
            };

            $(document).ready(function () {
                $("#tblStreetData").hide();
                $("#street-register_details").hide();

                $('#streetName').keypress(function (event) {
                    if (event.keyCode == 13) {
                        $('#streetLookup').click();
                        return false;
                    }
                });

                $("#streetLookup").click(function (e) {
                    LCC.Modules.StreetRegister.ShowResults();
                    $("#tblBodyDetails").html('');
                    $("#lblMessage").html("Please wait...");
                    $("#tblStreetData").hide();
                    $("#street-register_details").hide();

                    $.getJSON('https://api-streetregister.leeds.gov.uk/api/getAddressSearch_Result/' + $('#streetName').val(), function (data) {
                        if (data.length == 0) {
                            $("#lblMessage").html('No results returned');
                        }
                        else
                        {
                            $("#lblMessage").html(data.length + " result(s) found ");
                            $("#tblStreetData").show();
                            $.each(data, function (key, value) {
                                var address = "<tr><td>" + value.RoadName + "</td><td>" + value.Area + "</td><td>" + value.Status + "</td><td>" + "<a href='#/' onClick='LCC.Modules.StreetRegister.getStreetData(" + value.RoadID + ")'>Details</a> </td></tr>";
                                $("#tblBodyDetails").append(address);
                            });
                        }
                    });
                });
            });
        };

        // return {
        //     getStreetData: function (roadId)
        //     {
        //         this.getStreetData(roadId);
        //     },
        //     clearData: function()
        //     {
        //         this.clearData();
        //     },
        //     start: function(elementId)
        //     {
        //         this.start(elementId);
        //     }
        // }
    };

    global.LCC = LCC;
})(window);