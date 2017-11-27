//= require services.sharepoint




/*
 * Usage: 
 *  <div data-module="related-pages" class="relatedPages">
    <related-pages params="relatedPages: pages, pageTitle:'Test Related Pages'"></related-pages>
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
                template: '<h3 data-bind="text: pageTitle"></h3><ul class="nav" data-bind="foreach: pages"><li><a data-bind="text: name, attr: { href: url, title: name }" class="item"></a></li></ul>'
            });

            var RelatedPage = function(data) {
                var self = this;
                self.name = ko.observable(data.Cells.results[5].Value); 
                // or plain "self.name = data.name;" if you don't need 2way binding
                self.url = data.Cells.results[2].Value;
            }

            var vm = function () {
                var self = this;
                self.pages = ko.observableArray(null);

                jQuery(document).ready(function(){   
  
                    var scriptbase = _spPageContextInfo.siteAbsoluteUrl + "/_layouts/15/";
                    
                    jQuery.getScript(scriptbase + "SP.Runtime.js", function () {
                            jQuery.getScript(scriptbase + "SP.js", function() {
                                jQuery.getScript(scriptbase + "SP.Taxonomy.js", function() {

                                    jQuery.when(LCC.Services.SharePoint.GetCurrentPageSPItem())
                                    .then(function(listItem) {
                                        var pageTerms = LCC.Services.SharePoint.GetPageRelatedTerms(listItem);
                                        
                                        if(typeof(pageTerms) !== 'undefined') {

                                            jQuery.when(LCC.Services.SharePoint.GetRelatedPages(pageTerms))
                                            .then(function (relatedData) {
                                                self.pages(relatedData.map(function(item) { 
                                                    return new RelatedPage(item); 
                                                }));
                                            },
                                            function(error) {
                                                console.log(error);
                                            });
                                        }
                                    },
                                    function(error) {
                                        console.log(error);
                                    });
                                });
                            });
                        });
                
                });
            }

            ko.applyBindings(new vm(), element[0]);
        };
    };

    global.LCC = LCC; 
})(window, jQuery);