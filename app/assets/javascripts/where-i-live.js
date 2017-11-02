(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    LCC.Settings = LCC.Settings || {};
    
    LCC.Modules.WhereILive = function () { 
        this.start = function (element) {
            console.log('starting module Where I live');

            $("<p>" + (LCC.Settings.WhereILivePageText || "Find My Nearest") + "</p>").appendTo(element);

            // var s = $("<select id=\"selectId\" name=\"selectName\" />");
            // s.appendTo(element);

            LCC.Modules.WhereILive.getCurrentPage = function ()  {
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

            LCC.Modules.WhereILive.getPageCategory = function (listItem) {
                if(listItem.get_item('PageCategory')._Child_Items_.length > 0) {
                    return listItem.get_item('PageCategory')._Child_Items_["0"].Label;
                }
            }

            LCC.Modules.WhereILive.getLocalServiceOptions = function (pageCat) {

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

            ExecuteOrDelayUntilScriptLoaded(function() {
                jQuery.when(LCC.Modules.WhereILive.getCurrentPage())
                .then(function(listItem) {
                    var pageCat = LCC.Modules.WhereILive.getPageCategory(listItem);
                    jQuery.when(LCC.Modules.WhereILive.getLocalServiceOptions(pageCat)).then(function(results) {
                        // console.log(results);
                        // for (var i = 0; i < results.length; i++) {
                        //     console.log(results[i]);
                        // }
                        var s = $("<select id=\"selectId\" name=\"selectName\" />");
                        
                        jQuery.each(results, function(row, val) {
                            //console.log(val.Cells.results[4].Value);
                            $("<option />", {value: val.Cells.results[4].Value, text: val.Cells.results[4].Value}).appendTo(s);
                        });
                        s.appendTo(element);

                    });
                },
                function(error) {
                    console.log(error);
                });
            }, "sp.js");
        }

    };

    
    global.LCC = LCC;
})(window, jQuery);