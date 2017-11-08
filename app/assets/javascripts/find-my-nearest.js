(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    LCC.Settings = LCC.Settings || {};
    
    LCC.Modules.FindMyNearest = function () { 
        this.start = function (element) {
            console.log('starting module find my nearest');

            //$("<p>" + (LCC.Settings.FindMyNearestPageText || "Find My Nearest") + "</p>").appendTo(element);

            // var s = $("<select id=\"selectId\" name=\"selectName\" />");
            // s.appendTo(element);

            LCC.Modules.FindMyNearest.getCurrentPage = function ()  {
                var dfd = jQuery.Deferred();

                var context = SP.ClientContext.get_current();
                var web = context.get_web(); 
                var currentList = web.get_lists().getById(_spPageContextInfo.pageListId); 
                var currentListItem = currentList.getItemById(_spPageContextInfo.pageItemId);
                context.load(currentListItem);
                context.executeQueryAsync(
                    function(){
                        dfd.resolve(currentListItem);
                    }, 
                    function(sender,args){
                        dfd.reject(args.get_message());
                    }
                );

                return dfd.promise();
            }

            LCC.Modules.FindMyNearest.getPageCategory = function (listItem) {
                if(listItem.get_item('PageCategory')._Child_Items_.length > 0) {
                    return listItem.get_item('PageCategory')._Child_Items_["0"].Label;
                }
            }

            LCC.Modules.FindMyNearest.getLocalServiceOptions = function (pageCat) {

                console.log(pageCat);
                var dfd = jQuery.Deferred();
                
                var Url = _spPageContextInfo.webAbsoluteUrl + '/_api/search/query?querytext=%27IsActive=true+Path:"' + _spPageContextInfo.webAbsoluteUrl + '/Lists/LocalServices/*"%27&selectproperties=%27IsActive,owstaxIdParentPage,ID,ItemValue,Title%27&RowLimit=30&sortlist=%27Title:ascending%27';
                console.log(Url);
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
            }

            LCC.Modules.FindMyNearest.hasMatchingPageCat = function (itemCategories, pageCategory) {
                var pageCats = LCC.Modules.FindMyNearest.splitPageCatgoryTerms(itemCategories);
                for(var i = 0; i < pageCats.length; i++) {
                    if(pageCats[i][2] === pageCategory) {
                        return true;
                    }
                }
                return false;
            }

            LCC.Modules.FindMyNearest.splitPageCatgoryTerms = function (pageCatString) {
                var cats = [];
                var arr = pageCatString.split(/\;\s*/g);
                for (var i = 0; i < arr.length; i++){
                    var indCat = arr[i].split('|');
                    if(indCat[2]) {
                        cats.push(indCat);
                    }
                }

                return cats;

            }

            //LCC.Modules.FindMyNearest.loadStuff = function () {
//                SP.SOD.ExecuteOrDelayUntilScriptLoaded(function() {
                SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function() {
                    jQuery.when(LCC.Modules.FindMyNearest.getCurrentPage())
                    .then(function(listItem) {
                        var pageCat = LCC.Modules.FindMyNearest.getPageCategory(listItem);
                        jQuery.when(LCC.Modules.FindMyNearest.getLocalServiceOptions(pageCat)).then(function(results) {
                            // console.log(results);
                            // for (var i = 0; i < results.length; i++) {
                            //     console.log(results[i]);
                            // }
                            //var s = $("<select id=\"selectId\" name=\"selectName\" />");
                            
                            jQuery.each(results, function(row, val) {
                                //console.log(val.Cells.results[4].Value);
                                var pageCats = val.Cells.results[3].Value;
                                var title = val.Cells.results[5].Value;
                                if(LCC.Modules.FindMyNearest.hasMatchingPageCat(pageCats, pageCat)) {
                                    //$("<option />", {value: title, text: title}).appendTo(s);
                                    console.log(title);
                                }
                            });
                            //s.appendTo(element);

                        });
                    },
                    function(error) {
                        console.log(error);
                    });
                });
            //}

            // return {
            // loadStuff: function () {
            //     LCC.Modules.FindMyNearest.loadStuff();
            // }
       //}
        }

    };

    
    global.LCC = LCC;
})(window, jQuery);