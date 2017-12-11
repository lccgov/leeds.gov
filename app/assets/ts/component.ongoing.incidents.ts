/// <reference path="../../../node_modules/@types/knockout/index.d.ts" />
"use strict";

//import ko = require("knockout");
// import * as ko from "knockout";

namespace LCC.Modules {

    export interface Page {
        name: string;
        url: string;
    }

    export interface IOngoingIncidents {
        start(element: any): void;
    }

    export class OngoingIncidents implements IOngoingIncidents {
        start(element: any) {
            console.log('OngoingIncidents started');

            ko.components.register('ongoing-incidents-content', {
                viewModel: function(params:any) {
                    var self = this;
                    self.pages = params.relatedPages;
                    self.pageTitle = "ongoing-incidents";//params.pageTitle;
                },
                template: '<h1 data-bind="text: pageTitle"></h1><ul class="nav" data-bind="foreach: pages"><li><a data-bind="text: name, attr: { href: url, title: name }" class="item"></a></li></ul>'
            });

            ko.components.register('ongoing-incidents', {
                viewModel: function(params: any) {

                    // var self = this;
                    // self.pages = params.relatedPages;
                    // self.pageTitle = params.pageTitle || "Related Pages";
                    this.pageTitle = params.pageTitle || "Related Pages";

                    var pagesArr: Array<Page> = new Array<Page>();
                    pagesArr.push({ name: 'Matt', url: 'https://bbc.co.uk'});
                    pagesArr.push({ name: 'Rod', url: 'https://leeds.gov.uk'});

                    this.pages = ko.observableArray(pagesArr);

                },
                template: '<ongoing-incidents-content params="relatedPages: pages, pageTitle: pageTitle"></ongoing-incidents-content>'
            });

            class OngoingIncidentVM {

            }

            ko.applyBindings(new OngoingIncidentVM(), element[0]);
        }
    }

}