//= require google-analytics
//= require handlebars





//removes top margin frpm right hand column if empty
function isEmpty( el ){
      return !$.trim(el.html())
  }
  if (isEmpty($('aside.col-md-4'))) {
      $('aside.col-md-4').addClass('empty');
  }
  
//input block label
$('input:radio').click(function() {
    $('input:radio[name='+$(this).attr('name')+']').parent().removeClass('active');
        $(this).parent().addClass('active');
});

//input block label
$('input:checkbox').click(function() {
    	$(this).parent().toggleClass('active');
});

//random image for hero-lcc
function randomImage(){
  var images = [
   '/_catalogs/masterpage/public/images/hero-image-1.jpg',
   '/_catalogs/masterpage/public/images/hero-image-2.jpg',
   '/_catalogs/masterpage/public/images/hero-image-3.jpg',
   '/_catalogs/masterpage/public/images/hero-image-4.jpg',
   '/_catalogs/masterpage/public/images/hero-image-5.jpg',
   '/_catalogs/masterpage/public/images/hero-image-6.jpg'];
  var size = images.length;
  var x = Math.floor(size * Math.random());
  console.log(x);
  var element = document.getElementsByClassName('hero-lcc-wrapper');
  console.log(element);
  if(element.length > 0)
  {
    element[0].style["background-image"] = "url("+ images[x] + ")";
  }
}

document.addEventListener("DOMContentLoaded", randomImage);

// hide site button on domestic violence subsite
$(document).ready(function(){
    
    $("#hide-site").on("click", function() {
      window.open("http://bbc.co.uk", "_newtab");
      window.location.replace('http://google.com');
    });
    
});

var subsite = window.location.pathname.split("/")[1]; 
	(function (global) {
	    "use strict";

	    var LCC = global.LCC || {};
	    LCC.Modules = LCC.Modules || {};
		LCC.Settings = LCC.Settings || {};

	    LCC.Modules.NewsArchiveFilter = function () {
	        this.start = function (element) {

				getArchiveMonths();
			
	            element.on('click', '.js-news-archive-filter-submit', function () {

	                var year = $(this).data('year');
	                var month = $(this).data('month');

	                var d = new Date(year, month, 0);
	                var start = year + "/" + month + "/1";
	                var end = year + "/" + month + "/" + d.getDate();

	                var queryString = "?startdate=" + start + "&enddate=" + end;
	                var newsUrl = ( LCC.Settings.NewsUrl !== undefined ) ? LCC.Settings.NewsUrl : "/"+subsite+"/Pages/NewsSearch.aspx";                   
                	window.location = newsUrl + queryString;


	            });	            

	            function getArchiveMonths() {
	                var source = $("#archive-template").html();
	                var template = Handlebars.compile(source);

					var today = new Date();
					var newsContentType = ( LCC.Settings.NewsContentType !== undefined ) ? LCC.Settings.NewsContentType : "LCC Gov News Article Page";
                    $.ajax({
	                    url: _spPageContextInfo.webAbsoluteUrl + "/_api/lists/getbytitle('pages')/items?$select=LCCMonthYear&$filter=NewsReleaseDate le '" + today.toISOString() + "' and OData__ModerationStatus eq 0 and ContentType eq '" + newsContentType + "'",
	                    type: "GET",
	                    dataType: 'json',
	                    headers: {
	                        "accept": "application/json;odata=verbose"
	                    },
	                    success: function (data) {

	                        var prevYear;
	                        var prevMonth;
	                        var years = [];
	                        var monthsString = ['None', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

							data.d['results'].sort(function (a, b) {
								return b.LCCMonthYear - a.LCCMonthYear;
							});
	                        $.each(data.d.results, function (index, item) {
								if (item.LCCMonthYear)
								{
									if (typeof prevMonth === 'undefined' || prevMonth != item.LCCMonthYear) {

										var itemYear = item.LCCMonthYear.substring(0, 4);
										var itemMonth = parseInt(item.LCCMonthYear.substring(4),10);
										var monthAsString = monthsString[itemMonth];

										if (typeof prevYear === 'undefined' || prevYear != itemYear) {
											years.push({ 'year': itemYear, 'months': [{ 'month': itemMonth, 'monthAsString': monthAsString }] });
											prevYear = itemYear;
										}
										else {
											years[years.length - 1].months.push({ 'month': itemMonth, 'monthAsString': monthAsString });
										}
										prevMonth = item.LCCMonthYear;
									}
								}
	                        });

	                        var html = template({ Years: years });
	                        $("#archive").html(html);

							LCC.modules.start($("#newsAccordion"));

	                    },
	                    error: function (err) {
	                        var html = "<p>Sorry, there is an error with this filter</p>";
	                        $("#archive").html(html);
	                    }
	                });
	            }			
				
	        }
	    };

	    global.LCC = LCC;
	})(window);


  (function (global) {
    "use strict";

    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    LCC.Settings = LCC.Settings || {};

    LCC.Modules.KeywordFilter = function () {
        this.start = function (element) {
            element.on('click', '.js-keyword-submit', function () {
                var queryString = "?k=" + element.find('.js-keyword').val();
                var newsUrl = ( LCC.Settings.NewsUrl !== undefined ) ? LCC.Settings.NewsUrl : "/"+subsite+"/Pages/NewsSearch.aspx";                   
                window.location = newsUrl + queryString;
            });

        }
    };

    global.LCC = LCC;
})(window);


(function (global) {
    "use strict";

    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    LCC.Settings = LCC.Settings || {};

    LCC.Modules.DateRangeFilter = function () {
        this.start = function (element) {
            element.on('click', '.js-date-range-submit', function () {

                var startdate = element.find('.js-date-range-start').val();
                var enddate = element.find('.js-date-range-end').val();
                //moment.js
                var d = new Date();
                var mm = d.getMonth() + 1;
                var dd = d.getDate();
                var yyyy = d.getFullYear();
                var today = yyyy + "/" + mm + "/" + dd;
                var start = startdate || "1900/1/1";
                var end = enddate || today;

                var queryString = "?startdate=" + start + "&enddate=" + end;
                var newsUrl = ( LCC.Settings.NewsUrl !== undefined ) ? LCC.Settings.NewsUrl :  "/"+subsite+"/Pages/NewsSearch.aspx";                   
                window.location = newsUrl + queryString;
            });

        }
    };

    global.LCC = LCC;
})(window);




$(document).ready(function () {
    var checkURL = ['visit/', 'discoverycentre', 'abbeyhouse','thwaitemills','kirkstallabbey','leedsartgallery','armleymills','templenewsamhouse','leedscitymuseum','lothertonhall'];

    for (var i = 0; i < checkURL.length; i++) {
        if(window.location.href.indexOf(checkURL[i]) > -1) {
            $('.masterhead').after('<div class="backto"><div class="container-fluid"><a href="/museumsandgalleries/home" class="link-back">Back to Museums and Galleries</a></div></div>');
        }
    }
});