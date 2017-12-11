"use strict";
var LCC;
(function (LCC) {
    var Modules;
    (function (Modules) {
        var OngoingIncidents = (function () {
            function OngoingIncidents() {
            }
            OngoingIncidents.prototype.start = function (element) {
                console.log('OngoingIncidents started');
                ko.components.register('ongoing-incidents-content', {
                    viewModel: function (params) {
                        var self = this;
                        self.pages = params.relatedPages;
                        self.pageTitle = "ongoing-incidents";
                    },
                    template: '<h1 data-bind="text: pageTitle"></h1><ul class="nav" data-bind="foreach: pages"><li><a data-bind="text: name, attr: { href: url, title: name }" class="item"></a></li></ul>'
                });
                ko.components.register('ongoing-incidents', {
                    viewModel: function (params) {
                        this.pageTitle = params.pageTitle || "Related Pages";
                        var pagesArr = new Array();
                        pagesArr.push({ name: 'Matt', url: 'https://bbc.co.uk' });
                        pagesArr.push({ name: 'Rod', url: 'https://leeds.gov.uk' });
                        this.pages = ko.observableArray(pagesArr);
                    },
                    template: '<ongoing-incidents-content params="relatedPages: pages, pageTitle: pageTitle"></ongoing-incidents-content>'
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
