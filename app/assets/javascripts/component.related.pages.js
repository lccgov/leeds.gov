//= require services.sharepoint

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
                },
                template: '<h3>New Related Pages</h3><ul class="nav" data-bind="foreach: pages"><li data-bind="text: name"></li></ul>'
            });

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
                                        //console.log(pageTerms);
                                        //self.pages(pageTerms);
                                        
                                        if(typeof(pageTerms) !== 'undefined') {

                                            for (var i = 0; i < pageTerms.length; i++) {
                                            //pageTerms.map(function(currentValue) {
                                                var currentValue = pageTerms[i];
                                                jQuery.when(LCC.Services.SharePoint.GetTerm(currentValue))
                                                .then(function(term) {
                                                    console.log(term);
                                                    //  jQuery.when(LCC.Services.SharePoint.GetTermSetOfTerm(term))
                                                    //  .then(function(fullData) {
                                                    //     console.log(fullData);
                                                         self.pages.push(term);
                                                    //  });
                                                });
                                                
                                            }
                                            //});

                                            
                                        }
                                    },
                                    function(error) {
                                        console.log(error);
                                    });
                                });
                            });
                        });
                
                });

                //SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.js'));   
            //     SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function() {
            //     SP.SOD.executeFunc('sp.taxonomy.js', 'SP.Taxonomy.TaxonomySession', function () {   
            //     jQuery.when(LCC.Services.SharePoint.GetCurrentPageSPItem())
            //     .then(function(listItem) {
            //         var pageTerms = LCC.Services.SharePoint.GetPageRelatedTerms(listItem);
            //         if(typeof(pageTerms) !== 'undefined') {
            //             pageTerms.map(function(currentValue) {
            //                 jQuery.when(LCC.Services.SharePoint.GetTerm(currentValue.termId))
            //                 .then(function(data) {
            //                     console.log(data);
            //                 });
            //             });

            //             console.log(pageTerms);
            //             self.pages(pageTerms);
            //         }
            //     },
            //     function(error) {
            //         console.log(error);
            //     });
            // });
            // }, "sp.js");
            }

            ko.applyBindings(new vm(), element[0]);
        };
    };

    global.LCC = LCC; 
})(window, jQuery);