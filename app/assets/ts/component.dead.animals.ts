/// <reference path="../../../node_modules/@types/knockout/index.d.ts" />
/// <reference path="../../../node_modules/@types/jquery/index.d.ts" />
/// <reference path="../../../node_modules/@types/sharepoint/index.d.ts" />
/// <reference path="./service.sharepoint.ts" />
"use strict";

namespace LCC.Modules {

    export interface Page {
        name: string;
        url: string;
    }

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
            this.Notified =  notifiedDate.format("dd/MM/yyyy HH:MM tt");
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

                    let query: LCC.Modules.SharePoint.ISearchQuery = {
                        queryText: url
                    };

                    jQuery.when(LCC.Modules.SharePoint.Services.ExecuteSearchQuery(query))
                    .then(function(listData: any) {
                        self.animals(listData.map(function(item: any) {
                            return new DeadAnimal(item);
                        }));
                     });
                },
                template: `<h1 data-bind="text: pageTitle, visible: pageTitle"></h1>
                            <div id="CatsandDogs">
                            <table class="table table-responsive">
                                <thead><tr><th>SR Ref</th><th>Notes</th><th>Location</th><th>Notified</th></tr></thead>
                                <tbody data-bind="foreach: animals">
                                    <tr>
                                        <td data-bind="text: SRRef"></td>
                                        <td data-bind="html: Notes"></td>
                                        <td data-bind="html: AnimalLocation"></td>
                                        <td data-bind="text: Notified"></td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>`
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