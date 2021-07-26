(function(){
    
    var SAOverridesOptions = {
        BaseViewID: 1,
        ListTemplateType: 100,
        OnPreRender: saPreRender,
        Templates: {
            Header: '<div id="schoolTable"><div class="text">',
            Item: saItem,
            Footer: '</div></div>'
        }
    }
 
    SP.SOD.executeFunc('clienttemplates.js','SPClientTemplates',function(){
        SPClientTemplates.TemplateManager.RegisterTemplateOverrides(SAOverridesOptions);
    });

    function saPreRender(ctx){
        ctx.ListSchema.NoListItem = "";
    }
 
    function saItem(ctx){
        //Update years in this file March each year
        var yearOne = "2021";
        var yearTwo = "2020";
        var yearThree = "2019";

        var locationMapHtml = ctx.CurrentItem.LocationMap ? '<td><a href="' + ctx.CurrentItem.LocationMap + '" rel="external" target="_blank">Open in Google Maps</a></td>' : '<td></td>';
        var websiteHtml = ctx.CurrentItem.URL ? '<td><a href="' + ctx.CurrentItem.URL + '" rel="external" target="_blank">' + ctx.CurrentItem["URL.desc"] + '</a></td>' : '<td></td>';

        var title = '<h1>' + ctx.CurrentItem.SchoolName + '</h1>' +
        '<p><strong>DfE number: </strong>' + ctx.CurrentItem.Title + '</p>';

        var contactDetails = '<h2>Contact details</h2>' + 
        '<div class="table-responsive">' +
        '<table>' +
        '<caption class="sr-only">Address for ' + ctx.CurrentItem.SchoolName + '</caption>' +
        '<tbody>' +
        '<tr>' +
        '<th scope="row">Address</th>' +
        '<td>' + ctx.CurrentItem.SchoolAddressAdmissions + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Location</th>' +
        locationMapHtml +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Website</th>' +
        websiteHtml +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Email</th>' +
        '<td>' + ctx.CurrentItem.EMail + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Phone</th>' +
        '<td>' + ctx.CurrentItem.Phone + '</td>' +
        '</tr>' +
        '<th scope="row">Headteacher</th>' +
        '<td>' + ctx.CurrentItem.SchoolHeadteacher + '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';

        var schoolDetails = '<h2>About this school</h2>' + 
        '<div class="table-responsive">' +
        '<table>' +
        '<caption class="sr-only">About school for ' + ctx.CurrentItem.SchoolName + '</caption>' +
        '<tbody>' +
        '<tr>' +
        '<th scope="row">Number of pupils</th>' +
        '<td>' + ctx.CurrentItem.SchoolPupils + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Education phase</th>' +
        '<td>' + ctx.CurrentItem.SchoolType + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Age range</th>' +
        '<td>' + ctx.CurrentItem.SchoolAgeRange + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Type of school</th>' +
        '<td>' + ctx.CurrentItem.TypeOfSchool + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Faith</th>' +
        '<td>' + ctx.CurrentItem.Faith + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Specialism</th>' +
        '<td>' + ctx.CurrentItem.Specialism + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Facilities</th>' +
        '<td>' + ctx.CurrentItem.Facilities1 + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Area</th>' +
        '<td>' + ctx.CurrentItem.SchoolAreaAdmissions + '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';

        var admissionsPolicy = '<h2>Admissions policy</h2>' + 
        '<p>Places are offered in priority order. Children who meet the first priority will get a place before children who meet the second.</p>' +
        '<div class="table-responsive">' +
        '<table>' +
        '<caption class="sr-only">Number of school places for ' + ctx.CurrentItem.SchoolName + '</caption>' +
        '<tbody>' +
        '<tr>' +
        '<th scope="row">Admissions year</th>' +
        '<td>' + 
        '<p class="top">' + ctx.CurrentItem.AdmissionsYear + '</p>' + 
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Number of places (published admission number)</th>' +
        '<td>' + 
        '<p class="top">' + ctx.CurrentItem.NumberOfSchoolPlaces + '</p>' + 
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Summary of admissions policy</th>' +
        '<td><p>' + STSHtmlDecode(ctx.CurrentItem.AdmissionCriteriaSummary) + '</p>' +
        '<p>You should read the full admissions policy before applying. For some criteria, you may need to send extra information.</p>' +
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Full admissions policies</th>' +
        '<td><p><a href="' + ctx.CurrentItem.AdmissionsPolicyLink + '" target="_blank">' + ctx.CurrentItem["AdmissionsPolicyLink.desc"] + '</a></p></td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Catchment area map</th>' +
        '<td>' +
        '<p><a href="' + ctx.CurrentItem.CatchmentAreaMap + '" target="_blank">' + ctx.CurrentItem["CatchmentAreaMap.desc"] + '</a></p>' +
        '<p><a href="https://forms.leeds.gov.uk/SchoolCatchment">Check if you live in a catchment area</a></p>' +
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';

        var previousYears = '<h2>How places were allocated in previous years</h2>' + 
        '<div class="table-responsive">' +
        '<table>' +
        '<caption class="sr-only"></caption>' +
        '<tbody>' +
        '<tr>' +
        '<th scope="row">How many children got a place by priority</th>' +
        '<td>' + STSHtmlDecode(ctx.CurrentItem.OffersLastYear) + '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '<h3>Last child offered a place</h3>' +
        '<p>Find out which admissions priority the last child met and how far they lived from the school (if applicable) in previous years. All distances are measured as a straight line.</p>' +
        '<div class="table-responsive">' +
        '<table>' +
        '<caption class="sr-only">Last child offered a place at ' + ctx.CurrentItem.SchoolName + '</caption>' +
        '<tbody>' +
        '<tr>' +
        '<th scope="row">Offer day ' + yearOne + '</th>' +
        '<td>' + 
        '<p><strong>Distance in miles: </strong>' + ctx.CurrentItem.FurthestDistance1 + '</p>' + 
        '<p><strong>Priority admitted: </strong>' + ctx.CurrentItem.CriteriaAdmittedUnder1 + '</p>' + 
        '<p><strong>Priority summary: </strong>' + ctx.CurrentItem.CriteriaDescription1 + '</p>' + 
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Offer day ' + yearTwo + '</th>' +
        '<td>' + 
        '<p><strong>Distance in miles: </strong>' + ctx.CurrentItem.FurthestDistance2 + '</p>' + 
        '<p><strong>Priority admitted: </strong>' + ctx.CurrentItem.CriteriaAdmittedUnder2 + '</p>' + 
        '<p><strong>Priority summary: </strong>' + ctx.CurrentItem.CriteriaDescription2 + '</p>' + 
        '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Offer day ' + yearThree + '</th>' +
        '<td>' + 
        '<p><strong>Distance in miles: </strong>' + ctx.CurrentItem.FurthestDistance3 + '</p>' + 
        '<p><strong>Priority admitted: </strong>' + ctx.CurrentItem.CriteriaAdmittedUnder3 + '</p>' + 
        '<p><strong>Priority summary: </strong>' + ctx.CurrentItem.CriteriaDescription3 + '</p>' + 
        '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '<h3>How many people applied (offer day ' + yearOne + ')</h3>' +
        '<div class="table-responsive">' +
        '<table>' +
        '<caption class="sr-only">How many people applied last year at ' + ctx.CurrentItem.SchoolName + '</caption>' +
        '<tbody>' +
        '<tr>' +
        '<th scope="row">Put as 1st preference</th>' +
        '<td>' + ctx.CurrentItem.FirstPreference + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Put as 2nd preference</th>' +
        '<td>' + ctx.CurrentItem.SecondPreference + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Put as 3rd preference</th>' +
        '<td>' + ctx.CurrentItem.ThirdPreference + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Put as 4th preference</th>' +
        '<td>' + ctx.CurrentItem.ForthPreference + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Put as 5th preference</th>' +
        '<td>' + ctx.CurrentItem.FifthPreference + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Total applications (preferences)</th>' +
        '<td>' + ctx.CurrentItem.TotalApplications + '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';

        var moreInformation = '<h2>More information</h2>' + 
        '<p>Visit the school’s website to find out about performance, uniforms and after school clubs.</p>' +
        '<h3>Travel information</h3>' +
        '<div class="table-responsive">' +
        '<table>' +
        '<caption class="sr-only">Travel information for ' + ctx.CurrentItem.SchoolName + '</caption>' +
        '<tbody>' +
        '<tr>' +
        '<th scope="row">20 mph outside school</th>' +
        '<td>' + ctx.CurrentItem.TwentyMph + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">School crossing patrol</th>' +
        '<td>' + ctx.CurrentItem.SchoolCrossingPatrol + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Parent waiting shelter</th>' +
        '<td>' + ctx.CurrentItem.ParentWaitingShelter + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Cycle storage</th>' +
        '<td>' + ctx.CurrentItem.CycleStorage + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Scooter storage</th>' +
        '<td>' + ctx.CurrentItem.ScooterStorage + '</td>' +
        '</tr>' +
        '<tr>' +
        '<th scope="row">Cycle routes</th>' +
        '<td>' + ctx.CurrentItem.CycleRoutes + '</td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>';

        var item = title + contactDetails + schoolDetails + admissionsPolicy + previousYears + moreInformation;
        return item;
    }

})()