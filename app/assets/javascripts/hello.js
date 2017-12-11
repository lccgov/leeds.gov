"use strict";
var LCC;
(function (LCC) {
    var Modules;
    (function (Modules) {
        var TestComponent = (function () {
            function TestComponent() {
            }
            TestComponent.prototype.start = function (element) {
                console.log('TestComponent started');
                ko.components.register('test-component-content', {
                    viewModel: function (params) {
                        var self = this;
                        self.pages = params.relatedPages;
                        self.pageTitle = params.pageTitle;
                    },
                    template: '<h3 data-bind="text: pageTitle"></h3><ul class="nav" data-bind="foreach: pages"><li><a data-bind="text: name, attr: { href: url, title: name }" class="item"></a></li></ul>'
                });
                ko.components.register('test-component', {
                    viewModel: function (params) {
                        this.pageTitle = params.pageTitle || "Related Pages";
                        var pagesArr = new Array();
                        pagesArr.push({ name: 'Matt', url: 'https://bbc.co.uk' });
                        pagesArr.push({ name: 'Rod', url: 'https://leeds.gov.uk' });
                        this.pages = ko.observableArray(pagesArr);
                    },
                    template: '<test-component-content params="relatedPages: pages, pageTitle: pageTitle"></test-component-content>'
                });
                var TestComponentVM = (function () {
                    function TestComponentVM() {
                    }
                    return TestComponentVM;
                }());
                ko.applyBindings(new TestComponentVM(), element[0]);
            };
            return TestComponent;
        }());
        Modules.TestComponent = TestComponent;
    })(Modules = LCC.Modules || (LCC.Modules = {}));
})(LCC || (LCC = {}));
