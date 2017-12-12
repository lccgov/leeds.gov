/// <reference path="../../../node_modules/@types/knockout/index.d.ts" />
/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../../node_modules/@types/sharepoint/index.d.ts" />
"use strict";

// import ko = require("knockout");
// import * as ko from "knockout";

module LCC.Modules.SharePoint {

    export interface ISearchQuery {
        queryText: string;
        cache?: boolean;
        method?: string;
    }

    export class Services {
        public static ExecuteSearchQuery = function(searchQuery: ISearchQuery) {
            let dfd = jQuery.Deferred();

            // let Url = _spPageContextInfo.webAbsoluteUrl + '/_api/search/query?querytext=%27Path:"' + hostURL + '"+ListId:"' + listId + '"%27&QueryTemplatePropertiesUrl=%27spfile://webroot/queryparametertemplate.xml%27&SelectProperties=%27Path,ID,owstaxIdPageCategory,owstaxIdRelatedPages,Title%27&RowLimit=2';
            let Url = [_spPageContextInfo.webAbsoluteUrl, "/_api/search/query?querytext=", searchQuery.queryText].join("");
            jQuery.ajax({
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader("Accept", "application/json; odata=verbose");
                },
                cache: searchQuery.cache || true,
                error: function (data) {
                    dfd.reject(data);
                },
                method: searchQuery.method || "GET",
                success: function (data) {
                    dfd.resolve(data.d.query.PrimaryQueryResult.RelevantResults.Table.Rows.results);
                },
                url: Url
            });
            return dfd.promise();
        };
    }


}

//export = LCC.Modules.SharePoint;
