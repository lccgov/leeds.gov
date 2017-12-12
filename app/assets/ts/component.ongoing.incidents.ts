/// <reference path="../../../node_modules/@types/knockout/index.d.ts" />
/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../../node_modules/@types/sharepoint/index.d.ts" />
/// <reference path="./services.sharepoint.ts" />
"use strict";

module LCC.Modules {

    export interface IOngoingIncidents {
        start(element: any): void;
    }

    export class OngoingIncident {
        public Title: string;
        public RiskType: string;
        public UpdateText: string;
        public IncidentImage: string;
        public InfoLink: string;
        public LastModified: string;
        constructor(data: any) {
            this.RiskType = data.Cells.results[3].Value || "";
            this.UpdateText = data.Cells.results[4].Value || "";
            this.IncidentImage = data.Cells.results[6].Value || "";
            this.InfoLink = data.Cells.results[7].Value || "";
            let modified = data.Cells.results[5].Value;
            var displayDate = new Date(modified);
            this.LastModified =  displayDate.format("dd/MM/yyyy HH:MM tt");
            this.Title = data.Cells.results[2].Value || "";
        }
    }

    export class OngoingIncidents implements IOngoingIncidents {
        public start(element: any) {
            console.log("OngoingIncidents started");

            ko.components.register("ongoing-incidents-content", {
                viewModel: function(params: any) {
                    let self = this;
                    self.incidents = ko.observableArray(null);
                    self.pageTitle = params.pageTitle;

                    let hostUrl = document.location.protocol + "//" + document.location.host;
                    let listUrl = document.location.protocol + "//" + document.location.host + "/Lists/Ongoing Updates/*";
                    let url = "'ContentTypeId:\"0x010016DD9712094BA240AFECA9B2C177F97700CCC261225D64B145B2BACF40714DE379*\" Path:\"" + listUrl + "\"'&QueryTemplatePropertiesUrl='spfile://webroot/queryparametertemplate.xml'&selectproperties='Title,RiskTypeOWSCHCS,UpdateTextOWSMTXT,LastModifiedTime,IncidentImgOWSTEXT,IncidentMoreInfoLinkOWSTEXT'&sortlist='LastModifiedTime:descending'";

                    let query: LCC.Services.ISearchQuery = {
                        queryText: url
                    };

                    jQuery.when(LCC.Services.SharePoint.ExecuteSearchQuery(query))
                    .then(function(listData: any) {
                        self.incidents(listData.map(function(item: any) {
                            return new OngoingIncident(item);
                        }));
                     });
                },
                template: `<h1 data-bind="text: pageTitle, visible: pageTitle"></h1>
                            <div id="OngoingIncidents" data-bind="foreach: incidents">
                            <div class="IncidentPanel" data-bind="css: RiskType">
                            <h3 data-bind="text: Title"></h3>
                            <img data-bind="visible: IncidentImage, attr: { src: IncidentImage }" />
                            <p data-bind="text: UpdateText"></p>
                            <a data-bind="text: Title, visible: InfoLink, attr: { href: InfoLink, title: Title }"></a>
                            <div class="clearfix"></div>
                            <div class="IncidentFooter"><p>Updated: <span data-bind="text: LastModified"></span></p></div>
                            </div>
                            </div>`
            });

            ko.components.register("ongoing-incidents", {
                template: '<ongoing-incidents-content params="pageTitle: pageTitle"></ongoing-incidents-content>',
                viewModel: function(params: any) {

                    let self = this;
                    // self.pages = params.relatedPages;
                    self.pageTitle = params.pageTitle;
                    // this.pageTitle = params.pageTitle || "Related Pages";

                    // let pagesArr: Array<Page> = new Array<Page>();
                    // pagesArr.push({ name: "Matt", url: "https://bbc.co.uk"});
                    // pagesArr.push({ name: "Rod", url: "https://leeds.gov.uk"});

                    // this.pages = ko.observableArray(pagesArr);

                }
            });

            class OngoingIncidentVM {

            }

            ko.applyBindings(new OngoingIncidentVM(), element[0]);
        }
    }

}