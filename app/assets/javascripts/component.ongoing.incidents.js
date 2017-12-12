"use strict";
var LCC;
(function (LCC) {
    var Modules;
    (function (Modules) {
        var OngoingIncident = (function () {
            function OngoingIncident(data) {
                this.RiskType = data.Cells.results[3].Value || "";
                this.UpdateText = data.Cells.results[4].Value || "";
                this.IncidentImage = data.Cells.results[6].Value || "";
                this.InfoLink = data.Cells.results[7].Value || "";
                var modified = data.Cells.results[5].Value;
                var displayDate = new Date(modified);
                this.LastModified = displayDate.format("dd/MM/yyyy HH:MM tt");
                this.Title = data.Cells.results[2].Value || "";
            }
            return OngoingIncident;
        }());
        Modules.OngoingIncident = OngoingIncident;
        var OngoingIncidents = (function () {
            function OngoingIncidents() {
            }
            OngoingIncidents.prototype.start = function (element) {
                console.log("OngoingIncidents started");
                ko.components.register("ongoing-incidents-content", {
                    viewModel: function (params) {
                        var self = this;
                        self.incidents = ko.observableArray(null);
                        self.pageTitle = params.pageTitle;
                        var hostUrl = document.location.protocol + "//" + document.location.host;
                        var listUrl = document.location.protocol + "//" + document.location.host + "/Lists/Ongoing Updates/*";
                        var url = "'ContentTypeId:\"0x010016DD9712094BA240AFECA9B2C177F97700CCC261225D64B145B2BACF40714DE379*\" Path:\"" + listUrl + "\"'&QueryTemplatePropertiesUrl='spfile://webroot/queryparametertemplate.xml'&selectproperties='Title,RiskTypeOWSCHCS,UpdateTextOWSMTXT,LastModifiedTime,IncidentImgOWSTEXT,IncidentMoreInfoLinkOWSTEXT'&sortlist='LastModifiedTime:descending'";
                        var query = {
                            queryText: url
                        };
                        jQuery.when(LCC.Services.SharePoint.ExecuteSearchQuery(query))
                            .then(function (listData) {
                            self.incidents(listData.map(function (item) {
                                return new OngoingIncident(item);
                            }));
                        });
                    },
                    template: "<h1 data-bind=\"text: pageTitle, visible: pageTitle\"></h1>\n                            <div id=\"OngoingIncidents\" data-bind=\"foreach: incidents\">\n                            <div class=\"IncidentPanel\" data-bind=\"css: RiskType\">\n                            <h3 data-bind=\"text: Title\"></h3>\n                            <img data-bind=\"visible: IncidentImage, attr: { src: IncidentImage }\" />\n                            <p data-bind=\"text: UpdateText\"></p>\n                            <a data-bind=\"text: Title, visible: InfoLink, attr: { href: InfoLink, title: Title }\"></a>\n                            <div class=\"clearfix\"></div>\n                            <div class=\"IncidentFooter\"><p>Updated: <span data-bind=\"text: LastModified\"></span></p></div>\n                            </div>\n                            </div>"
                });
                ko.components.register("ongoing-incidents", {
                    template: '<ongoing-incidents-content params="pageTitle: pageTitle"></ongoing-incidents-content>',
                    viewModel: function (params) {
                        var self = this;
                        self.pageTitle = params.pageTitle;
                    }
                });
                var OngoingIncidentVM = (function () {
                    function OngoingIncidentVM() {
                    }
                    return OngoingIncidentVM;
                }());
                ko.applyBindings(new OngoingIncidentVM(), element[0]);
            };
            return OngoingIncidents;
        }());
        Modules.OngoingIncidents = OngoingIncidents;
    })(Modules = LCC.Modules || (LCC.Modules = {}));
})(LCC || (LCC = {}));
