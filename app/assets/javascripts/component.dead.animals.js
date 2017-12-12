"use strict";
var LCC;
(function (LCC) {
    var Modules;
    (function (Modules) {
        var DeadAnimal = (function () {
            function DeadAnimal(data) {
                this.SRRef = data.Cells.results[3].Value || "";
                this.Notes = data.Cells.results[4].Value || "";
                var notified = data.Cells.results[6].Value || "";
                var notifiedDate = new Date(notified);
                this.Notified = notifiedDate.format("dd/MM/yyyy HH:MM tt");
                this.AnimalLocation = data.Cells.results[5].Value || "";
                var modified = data.Cells.results[7].Value;
                var displayDate = new Date(modified);
                this.LastModified = displayDate.format("dd/MM/yyyy HH:MM tt");
                this.Title = data.Cells.results[2].Value || "";
            }
            return DeadAnimal;
        }());
        Modules.DeadAnimal = DeadAnimal;
        var DeadAnimals = (function () {
            function DeadAnimals() {
            }
            DeadAnimals.prototype.start = function (element) {
                console.log("DeadAnimals started");
                ko.components.register("dead-animals-content", {
                    viewModel: function (params) {
                        var self = this;
                        self.animals = ko.observableArray(null);
                        self.pageTitle = params.pageTitle;
                        var hostUrl = document.location.protocol + "//" + document.location.host;
                        var listUrl = document.location.protocol + "//" + document.location.host + "/Lists/Dead Animals Register/*";
                        var url = "'ContentTypeId:\"0x01008458AFE154C4F54A9EC653F8A7C5CC8C0068F6C6CFF629174C93D79B84C46FFCB3*\" Path:\"" + listUrl + "\"'&QueryTemplatePropertiesUrl='spfile://webroot/queryparametertemplate.xml'&selectproperties='Title,SRRefOWSTEXT,Notes1OWSMTXT,AnimalLocationOWSMTXT,NotifiedOWSDATE,LastModifiedTime,IncidentImgOWSTEXT,IncidentMoreInfoLinkOWSTEXT'&sortlist='LastModifiedTime:descending'";
                        var query = {
                            queryText: url
                        };
                        jQuery.when(LCC.Modules.SharePoint.Services.ExecuteSearchQuery(query))
                            .then(function (listData) {
                            self.animals(listData.map(function (item) {
                                return new DeadAnimal(item);
                            }));
                        });
                    },
                    template: "<h1 data-bind=\"text: pageTitle, visible: pageTitle\"></h1>\n                            <div id=\"CatsandDogs\">\n                            <table class=\"table table-responsive\">\n                                <thead><tr><th>SR Ref</th><th>Notes</th><th>Location</th><th>Notified</th></tr></thead>\n                                <tbody data-bind=\"foreach: animals\">\n                                    <tr>\n                                        <td data-bind=\"text: SRRef\"></td>\n                                        <td data-bind=\"html: Notes\"></td>\n                                        <td data-bind=\"html: AnimalLocation\"></td>\n                                        <td data-bind=\"text: Notified\"></td>\n                                    </tr>\n                                </tbody>\n                            </table>\n                            </div>"
                });
                ko.components.register("dead-animals", {
                    template: '<dead-animals-content params="pageTitle: pageTitle"></dead-animals-content>',
                    viewModel: function (params) {
                        var self = this;
                        self.pageTitle = params.pageTitle;
                    }
                });
                var DeadAnimalsVM = (function () {
                    function DeadAnimalsVM() {
                    }
                    return DeadAnimalsVM;
                }());
                ko.applyBindings(new DeadAnimalsVM(), element[0]);
            };
            return DeadAnimals;
        }());
        Modules.DeadAnimals = DeadAnimals;
    })(Modules = LCC.Modules || (LCC.Modules = {}));
})(LCC || (LCC = {}));
