//= require services.sharepoint




/*
 * Usage: 
 *  <div data-module="related-pages" class="relatedPages">
    <related-pages params="relatedPages: pages, pageTitle:'Related Pages'"></related-pages>
    </div>
 * 
 * 
 */
(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    LCC.Settings = LCC.Settings || {};
    
    LCC.Modules.RelatedPages = function () { 
        var self = this;

        this.start = function (element) {
            console.log("RelatedPages started");
            ko.components.register('related-pages', {
                viewModel: function(params) {
                    var self = this;
                    self.pages = params.relatedPages;
                    self.pageTitle = params.pageTitle || "Related Pages";
                },
                template: '<h3 data-bind="text: pageTitle, visible: pages().length > 0"></h3><ul class="nav" data-bind="foreach: pages"><li><a data-bind="text: name, attr: { href: url, title: name }" class="item"></a></li></ul>'
            });

            var RelatedPage = function(data) {
                var self = this;
                self.name = data.Cells.results[5].Value; 
                self.url = data.Cells.results[2].Value;
            }

            var vm = function () {
                var self = this;
                self.pages = ko.observableArray(null);

                jQuery(document).ready(function(){   
  
                
                jQuery.when(LCC.Services.SharePoint.GetCurrentPageSPItem())
                .then(function(listItem) {
                        var pageTerms = LCC.Services.SharePoint.GetPageRelatedTerms(listItem);
                        
                        if(typeof(pageTerms) !== 'undefined') {
                            if(pageTerms.length > 0) {
                                jQuery.when(LCC.Services.SharePoint.GetRelatedPages(pageTerms))
                                .then(function (relatedData) {
                        
                                    // use me if there are no duplicates
                                    self.pages(relatedData.map(function(item) { 
                                        return new RelatedPage(item); 
                                    }));

                                    // use this code block if there are duplicates showing
                                    // var parsedData = relatedData.map(function(item) { 
                                    //     return new RelatedPage(item); 
                                    // });

                                    // var unique = new Map(parsedData.map(obj => [obj.name, obj]));
                                    // var uniques = Array.from(unique.values());
                                    // self.pages(uniques);

                                },
                                function(error) {
                                    console.log(error);
                                });
                            }
                        }
                    },
                    function(error) {
                        console.log(error);
                    });
                });

            }

            ko.applyBindings(new vm(), element[0]);
        };
    };

    global.LCC = LCC; 
})(window, jQuery);