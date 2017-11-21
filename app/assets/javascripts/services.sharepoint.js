(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Services = LCC.Services || {};
    LCC.Settings = LCC.Settings || {};
    LCC.Services.SharePoint = LCC.Services.SharePoint || {};
    
    //LCC.Services.SharePoint = function () { 
         LCC.Services.SharePoint.GetCurrentPageSPItem = function ()  {
                var dfd = jQuery.Deferred();

                var listId = _spPageContextInfo.pageListId.slice(1, -1);
                var hostURL = [location.protocol, '//', location.host, location.pathname].join('');
                var Url = _spPageContextInfo.webAbsoluteUrl + '/_api/search/query?querytext=%27Path:"' + hostURL + '"+ListId:"' + listId + '"%27&QueryTemplatePropertiesUrl=%27spfile://webroot/queryparametertemplate.xml%27&SelectProperties=%27Path,ID,owstaxIdPageCategory,owstaxIdRelatedPages,Title%27&RowLimit=2';
                jQuery.ajax({
                    url: Url,
                    method: 'GET',
                    beforeSend: function (XMLHttpRequest) {                     
                        XMLHttpRequest.setRequestHeader("Accept", "application/json; odata=verbose");
                    },              
                    cache: true,
                    error: function (data) {      
                        dfd.reject(data);                 
                    },              
                    success: function (data) {   
                        dfd.resolve(data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results);                  
                    }
                });

                return dfd.promise();
            };

            LCC.Services.SharePoint.GetPageRelatedTerms = function (listItem) {

                if(listItem.length > 0) {
                    var catString = listItem["0"].Cells.results[4].Value;
                    var pageCats = LCC.Services.SharePoint.SplitPageCatgoryTerms(catString);
                    return pageCats;
                }
            }

            LCC.Services.SharePoint.SplitPageCatgoryTerms = function (pageCatString) {
                var cats = [];
                var arr = pageCatString.split(/\;\s*/g);
                for (var i = 0; i < arr.length; i++){
                    var indCat = arr[i].split('|');
                    if(indCat[2]) {
                        cats.push({something: indCat[0], id: indCat[1].substr(2), name: indCat[2]});
                    }
                }

                return cats;

            }

            LCC.Services.SharePoint.GetTerm = function(item) {
                var dfd = jQuery.Deferred();

                 var thisitem = item;
                
                var context = SP.ClientContext.get_current();
                var session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
                var termStore = session.getDefaultSiteCollectionTermStore();

                //var parentTermId = 'd89595cf-7d0d-4f19-8e14-8b8b05efb7de'; // Some parent term
                var term = termStore.getTerm(thisitem.id);

                // arguments are termLabel, language code, defaultLabelOnly, matching option, max num results, trim unavailable
                //var terms = parentTerm.getTerms(series,1033,true,SP.Taxonomy.StringMatchOption.exactMatch,1,true);

                context.load(term);
                context.executeQueryAsync(
                    function(){
                        var termSet = term.get_termSet();
                        context.load(termSet);
                        context.executeQueryAsync(function () {
                            thisitem.term = term;
                            thisitem.termSet = termSet;
                            dfd.resolve(thisitem);
                        }, 
                        function(sender,args){
                            console.log(args.get_message());
                            dfd.reject(args.get_message());    
                        });

                        // var data = { item: item, term: term };
                        // dfd.resolve(data);
                    
                //print child Terms
                // for(var i = 0; i < terms.get_count();i++){
                //     var term = terms.getItemAtIndex(i);
                //     console.log(term.get_name());
                //     console.log(term.get_description());

                // }

                }, 
                function(sender,args){
                    console.log(args.get_message());
                    dfd.reject(args.get_message());    
                });

                return dfd.promise();
                
            }

            LCC.Services.SharePoint.GetTermSetOfTerm = function(data) {

                var that = this;
                that.data = data;

                var dfd = jQuery.Deferred();
                
                var context = SP.ClientContext.get_current();
                var session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
                var termStore = session.getDefaultSiteCollectionTermStore();

                var termSet = data.term.get_termSet();
                context.load(termSet);
                context.executeQueryAsync(function () {
                    that.data.termSet = termSet;
                    dfd.resolve(that.data);
                }, 
                function(sender,args){
                    console.log(args.get_message());
                    dfd.reject(args.get_message());    
                });

                return dfd.promise();
                
            }
    //}
})(window, jQuery)