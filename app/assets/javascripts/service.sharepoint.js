"use strict";
var LCC;
(function (LCC) {
    var Modules;
    (function (Modules) {
        var SharePoint;
        (function (SharePoint) {
            var Services = (function () {
                function Services() {
                }
                Services.ExecuteSearchQuery = function (searchQuery) {
                    var dfd = jQuery.Deferred();
                    var Url = [_spPageContextInfo.webAbsoluteUrl, "/_api/search/query?querytext=", searchQuery.queryText].join("");
                    jQuery.ajax({
                        beforeSend: function (XMLHttpRequest) {
                            XMLHttpRequest.setRequestHeader("Accept", "application/json; odata=verbose");
                        },
                        cache: searchQuery.cache || true,
                        error: function (data) {
                            dfd.reject(data);
                        },
                        method: searchQuery.method || "GET",
                        success: function (data) {
                            dfd.resolve(data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results);
                        },
                        url: Url
                    });
                    return dfd.promise();
                };
                return Services;
            }());
            SharePoint.Services = Services;
        })(SharePoint = Modules.SharePoint || (Modules.SharePoint = {}));
    })(Modules = LCC.Modules || (LCC.Modules = {}));
})(LCC || (LCC = {}));
