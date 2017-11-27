(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Services = LCC.Services || {};
    LCC.Settings = LCC.Settings || {};
    LCC.Services.SharePoint = LCC.Services.SharePoint || {};
    
    //LCC.Services.SharePoint = function () { 

        LCC.Services.SharePoint.GetRelatedPagesKQLString = function (pageTerms) {
            var output = "(";
            for (var i = 0; i < pageTerms.length; i++) {
                var currentValue = pageTerms[i];
                if(i !== 0) {
                    output += " OR ";
                }
                output += ["(owstaxIdPageCategory:%23", currentValue.id, ")"].join('');
            }
            output += ")";

            return output;
        };

        LCC.Services.SharePoint.GetRelatedPages = function (pageCats) {
            var dfd = jQuery.Deferred();            

            var pageCatsKQL = LCC.Services.SharePoint.GetRelatedPagesKQLString(pageCats);

            var listId = _spPageContextInfo.pageListId.slice(1, -1);
            var hostURL = [location.protocol, '//', location.host].join('');
            var Url = _spPageContextInfo.webAbsoluteUrl + '/_api/search/query?querytext=%27Path:"' + hostURL + '"+ContentTypeId:"0x010100C568DB52D9D0A14D9B2FDCC96666E9F2007948130EC3DB064584E219954237AF3900242457EFB8B24247815D688C526CD44D001B4CBF057CCA2648B5EA400BFF5F7F670067B8E6820625044CBF831D966F5287F4*" ' + pageCatsKQL + '%27&QueryTemplatePropertiesUrl=%27spfile://webroot/queryparametertemplate.xml%27&SelectProperties=%27Path,ID,owstaxIdPageCategory,owstaxIdRelatedPages,Title%27&RowLimit=20';
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

                var term = termStore.getTerm(thisitem.id);

                context.load(term);
                context.executeQueryAsync(
                    function(){
                        thisitem.term = term ;
                        dfd.resolve(thisitem);
                    
                }, 
                function(sender,args){
                    console.log(args.get_message());
                    dfd.reject(args.get_message());    
                });

                return dfd.promise();
                
            }

            LCC.Services.SharePoint.GetTermSetOfTerm = function(data) {
                var thisdata = data;

                var dfd = jQuery.Deferred();
                
                var context = SP.ClientContext.get_current();
                var session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
                var termStore = session.getDefaultSiteCollectionTermStore();

                var termSet = thisdata.term.get_termSet();
                context.load(termSet);
                context.executeQueryAsync(function () {
                    thisdata.termSet = termSet;
                    dfd.resolve(thisdata);
                }, 
                function(sender,args){
                    console.log(args.get_message());
                    dfd.reject(args.get_message());    
                });

                return dfd.promise();
                
            }
    //}
})(window, jQuery)