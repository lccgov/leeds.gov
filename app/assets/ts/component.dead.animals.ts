/// <reference path="../../../node_modules/@types/knockout/index.d.ts" />
/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../../node_modules/@types/sharepoint/index.d.ts" />
/// <reference path="./services.sharepoint.ts" />
"use strict";

module LCC.Modules {

    export interface IDeadAnimals {
        start(element: any): void;
    }

    export class DeadAnimal {
        public Title: string;
        public SRRef: string;
        public Notes: string;
        public AnimalLocation: string;
        public Notified: string;
        public LastModified: string;
        constructor(data: any) {
            this.SRRef = data.Cells.results[3].Value || "";
            this.Notes = data.Cells.results[4].Value || "";
            let notified = data.Cells.results[6].Value || "";
            let notifiedDate = new Date(notified);
            // this.Notified =  notifiedDate.format("dd/MM/yyyy HH:MM tt");
            this.Notified =  notifiedDate.format("dd/MM/yyyy");
            this.AnimalLocation = data.Cells.results[5].Value || "";
            let modified = data.Cells.results[7].Value;
            let displayDate = new Date(modified);
            this.LastModified =  displayDate.format("dd/MM/yyyy HH:MM tt");
            this.Title = data.Cells.results[2].Value || "";
        }
    }

    export class DeadAnimals implements IDeadAnimals {
        public start(element: any) {
            console.log("DeadAnimals started");

            ko.components.register("dead-animals-content", {
                viewModel: function(params: any) {
                    let self = this;
                    self.animals = ko.observableArray(null);
                    self.pageTitle = params.pageTitle;

                    let hostUrl = document.location.protocol + "//" + document.location.host;
                    let listUrl = document.location.protocol + "//" + document.location.host + "/Lists/Dead Animals Register/*";
                    let url = "'ContentTypeId:\"0x01008458AFE154C4F54A9EC653F8A7C5CC8C0068F6C6CFF629174C93D79B84C46FFCB3*\" Path:\"" + listUrl + "\"'&QueryTemplatePropertiesUrl='spfile://webroot/queryparametertemplate.xml'&selectproperties='Title,SRRefOWSTEXT,Notes1OWSMTXT,AnimalLocationOWSMTXT,NotifiedOWSDATE,LastModifiedTime,IncidentImgOWSTEXT,IncidentMoreInfoLinkOWSTEXT'&sortlist='LastModifiedTime:descending'";

                    let query: LCC.Services.ISearchQuery = {
                        queryText: url
                    };

                    jQuery.when(LCC.Services.SharePoint.ExecuteSearchQuery(query))
                    .then(function(listData: any) {
                        self.animals(listData.map(function(item: any) {
                            return new DeadAnimal(item);
                        }));
                     });
                },
                template: `<h1 data-bind="text: pageTitle, visible: pageTitle"></h1>
                            <ul id="CatsandDogs" class="box-layout" data-bind="foreach: animals">
                                <li class="animal-list box-layout-item">
                                    <div class="animal-list-item animal-list-ref">
                                        <strong>SR Ref: </strong>
                                        <span data-bind="text: SRRef"></span>
                                    </div>
                                    <div class="animal-list-item animal-list-notes">
                                        <strong>Notes: </strong>
                                        <span data-bind="html: Notes"></span>
                                    </div>
                                    <div class="animal-list-item animal-list-location">
                                        <strong>Location: </strong>
                                        <span data-bind="html: AnimalLocation"></span>
                                    </div>
                                    <div class="animal-list-item animal-list-notified">
                                        <strong>Notified: </strong>
                                        <span data-bind="text: Notified"></span>
                                    </div>
                                </li>
                            </ul>`
            });

            ko.components.register("dead-animals", {
                template: '<dead-animals-content params="pageTitle: pageTitle"></dead-animals-content>',
                viewModel: function(params: any) {

                    let self = this;
                    self.pageTitle = params.pageTitle;
                }
            });

            class DeadAnimalsVM {

            }

            ko.applyBindings(new DeadAnimalsVM(), element[0]);
        }
    }

}