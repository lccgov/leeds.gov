//= require address-lookup-service 

(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    LCC.Settings = LCC.Settings || {};
    
    LCC.Modules.AddressLookup = function () { 
        this.start = function (element) {
            console.log('starting module find my nearest');

            $("<p>" + (LCC.Settings.AddressLookupPageText || "Find My Nearest") + "</p>").appendTo(element);

            // var s = $("<select id=\"selectId\" name=\"selectName\" />");
            //s.appendTo(element);

            LCC.Modules.AddressLookup.getCurrentPage = function ()  {
               var dfd = jQuery.Deferred();

                var listId = _spPageContextInfo.pageListId.slice(1, -1);
                var hostURL = [location.protocol, '//', location.host, location.pathname].join('');
                var Url = _spPageContextInfo.webAbsoluteUrl + '/_api/search/query?querytext=%27Path:"' + hostURL + '"+ListId:"' + listId + '"%27&QueryTemplatePropertiesUrl=%27spfile://webroot/queryparametertemplate.xml%27&SelectProperties=%27Path,ID,owstaxIdPageCategory,Title%27&RowLimit=2';
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

            LCC.Modules.AddressLookup.getPageCategory = function (listItem) {
                if(listItem.length > 0) {
                    var catString = listItem["0"].Cells.results[3].Value;
                    var pageCats = splitPageCatgoryTerms(catString);
                    return pageCats[0][2];
                }
            }

            LCC.Modules.AddressLookup.getLocalServiceOptions = function (pageCat) {

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

            LCC.Modules.AddressLookup.hasMatchingPageCat = function (itemCategories, pageCategory) {
                var pageCats = LCC.Modules.AddressLookup.splitPageCatgoryTerms(itemCategories);
                for(var i = 0; i < pageCats.length; i++) {
                    if(pageCats[i][2] === pageCategory) {
                        return true;
                    }
                }
                return false;
            }

            LCC.Modules.AddressLookup.splitPageCatgoryTerms = function (pageCatString) {
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

            //LCC.Modules.AddressLookup.loadStuff = function () {
//                SP.SOD.ExecuteOrDelayUntilScriptLoaded(function() {
                SP.SOD.executeFunc('sp.js', 'SP.ClientContext', function() {
                    jQuery.when(LCC.Modules.AddressLookup.getCurrentPage())
                    .then(function(listItem) {
                        var pageCat = LCC.Modules.AddressLookup.getPageCategory(listItem);
                        jQuery.when(LCC.Modules.AddressLookup.getLocalServiceOptions(pageCat)).then(function(results) {
                            // console.log(results);
                            // for (var i = 0; i < results.length; i++) {
                            //     console.log(results[i]);
                            // }
                            //var s = $("<select id=\"selectId\" name=\"selectName\" />");
                            
                            jQuery.each(results, function(row, val) {
                                //console.log(val.Cells.results[4].Value);
                                var pageCats = val.Cells.results[3].Value;
                                var title = val.Cells.results[5].Value;
                                if(LCC.Modules.AddressLookup.hasMatchingPageCat(pageCats, pageCat)) {
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
            //     LCC.Modules.AddressLookup.loadStuff();
            // }
       //}
        }

    };

    
    global.LCC = LCC;
})(window, jQuery);