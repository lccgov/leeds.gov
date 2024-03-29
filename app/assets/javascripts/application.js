//= require knockout-3.4.0
//= require knockout.validation
//= require google-analytics
//= require handlebars
//= require date-range-filter
//= require news-archive-filter
//= require keyword-filter
//= require bins-print
//= require street-register
//= require highways-maintenance
//= require nearest-school
//= require contact-us-form
//= require survey
//= require details-polyfill
//= require alert-cookie
//= require forms
//= require component-related-pages
//= require decision-tree
//= require_directory compiled

//removes top margin frpm right hand column if empty
function isEmpty( el ){
    return !$.trim(el.html())
}

if (isEmpty($('aside.col-md-4'))) {
    $('aside.col-md-4').addClass('empty');
}

//random image for hero-lcc
function randomImage(){
    var images = [
        "/_catalogs/masterpage/public/images/home-hero-images/1.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/2.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/3.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/4.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/5.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/6.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/7.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/8.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/9.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/10.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/11.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/12.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/13.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/14.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/15.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/16.jpg",
        "/_catalogs/masterpage/public/images/home-hero-images/17.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/18.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/19.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/20.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/21.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/22.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/19.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/20.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/21.jpg", 
        "/_catalogs/masterpage/public/images/home-hero-images/22.jpg"];
    var size = images.length;
    var x = Math.floor(size * Math.random());
    var element = document.getElementsByClassName('hero-lcc-wrapper-home-leedsgov');
    if(element.length > 0) {
        element[0].style["background-image"] = "url("+ images[x] + ")";
    }
}

document.addEventListener("DOMContentLoaded", randomImage);


$(document).ready(function() {

    // hide site button on domestic violence subsite
    $("#hide-site").on("click", function() {
        window.open("http://bbc.co.uk", "_newtab");
        window.location.replace('http://google.com');
    });

    //input block label
    if($('.form-group--radio').length > 0) {
        $('.form-group--radio > input').on('click', function() {
            $('.form-group--radio').removeClass('display');
            $(this).parent().addClass('display');
        });

        $('.option--sub > input').on('click', function() {
            $('.option--sub').removeClass('display');
            $(this).parent().addClass('display');
        });

    } else {
        $('input:radio').click(function() {
            $('input:radio[name='+$(this).attr('name')+']').parent().removeClass('active');
                $(this).parent().addClass('active');
        });
    }
});

var subsite = window.location.pathname.split("/")[1]; 

$(document).ready(function () {
    var checkURL = ['visit/', 'discoverycentre', 'abbeyhouse','thwaitemills','kirkstallabbey','leedsartgallery','armleymills','templenewsamhouse','leedscitymuseum','lothertonhall'];
    for (var i = 0; i < checkURL.length; i++) {
        if(window.location.href.indexOf(checkURL[i]) > -1) {
            $('.masterhead').after('<div class="backto"><div class="container-fluid"><a href="/museumsandgalleries/home" class="link-back">Back to Museums and Galleries</a></div></div>');
        }
    }

    if( $('.main-nav').length ) {
        $('li.selected').each(function () {
            var current = $('.ms-hidden').html(),
                spaced = '&nbsp;'+ current;
            $('li.selected .ms-hidden').html(spaced);
        });
    }
});

// Details print styling
$(document).ready(function () {

    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener( printTest );

    function printTest(mql) {
        dt = $( 'details' )
        if (mql.matches) {
            dt.each( function( index ){
                b = $(this).attr('open');
                if ( !b ){
                    $(this).attr('open','');
                    $(this).attr('print','');
                }
            });
        } else {
            dt.each( function( index ){
                b = $(this).attr('print');
                if ( !b ){
                    $(this).removeAttr('open');
                    $(this).removeAttr('print');
                }
            });
        }
    }
});

$(document).ready(function () {

    //Skip link
    $('.skip').on('click', function(e) {
        e.preventDefault();
        $('#main').attr('tabindex', '-1').focus();
    });

    $('#main').on('click', '.btn--print', function(){
        $('details').attr('open', '');
        window.print();
    });

    //if( !$('div').hasClass('home-page') || !$('div').hasClass('groupPromo') ) {
    if( !$('div.home-page, div.groupPromo, div.campaign, #restSearch').length ) {
        // console.log('promoboxes not present');
        $( '<div class="container-fluid container--print"><button class="btn btn-primary btn--print"><img src="/PublishingImages/printer.svg" alt="" />Print page</button></div>' ).appendTo( '#main' );
    }

    // Smooth anchor links
    $(document).on('click', 'a[href^="#"]', function (event) {
        event.preventDefault();
    
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top
        }, 500);
    });

});

//Twitter A11y stying
$('.container-fluid').delegate('#twitter-widget-0', 'DOMSubtreeModified propertychange', function () {
    customizeTweetMedia();
});

var customizeTweetMedia = function () {
    // CSS Overrides
    $('.container-fluid').find('.twitter-timeline').contents().find('.Identity-screenName').css('color', '#667580');
    $('.container-fluid').find('.twitter-timeline').contents().find('.timeline-Tweet-retweetCredit').css('color', '#667580');
    $('.container-fluid').find('.twitter-timeline').contents().find('.timeline-Tweet-timestamp').css('color', '#667580');
    $('.container-fluid').find('.twitter-timeline').contents().find('.TwitterCard .SummaryCard-destination').css('color', '#667580');

    
    // Call the function on dynamic updates in addition to page load
    $('.container-fluid').find('.twitter-timeline').contents().find('.timeline-TweetList').bind('DOMSubtreeModified propertychange', function () {
        customizeTweetMedia(this);
    });
}


$(document).ready(function () {
    "use strict";
    var el = document.querySelector('.toggletip-bubble');
    //additional
    var checkPositioning = function () {
        var bounding = document.querySelector('.toggletip-bubble').getBoundingClientRect();

        if (bounding.bottom > window.innerHeight) {
            document.querySelector('.toggletip-bubble').classList.add('push-up');
        }

        if (bounding.right > window.innerWidth) {
            document.querySelector('.toggletip-bubble').classList.add('push-right');
        }
    };


    // Get all the toggletip buttons
    var toggletips = document.querySelectorAll('[data-toggletip-content]');

    // Iterate over them
    Array.prototype.forEach.call(toggletips, function (toggletip) {
        // Get the message from the data-content element
        var message = toggletip.getAttribute('data-toggletip-content');

        // Get the live region element
        var liveRegion = toggletip.nextElementSibling;

        // Toggle the message
        toggletip.addEventListener('click', function () {
            liveRegion.innerHTML = '';
            window.setTimeout(function () {
                liveRegion.innerHTML = '<span class="toggletip-bubble">' + message +
                    '</span>';
            }, 100);
            window.setTimeout(function () {
                checkPositioning();
            }, 100);
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (toggletip !== e.target) {
                liveRegion.innerHTML = '';
            }
        });

        // Remove toggletip on ESC
        toggletip.addEventListener('keydown', function (e) {
            if ((e.keyCode || e.which) === 27)
                liveRegion.innerHTML = '';
        });
    });
}());

//ARIA accordion
!function(t,e,a){"use strict";var r={};t.ARIAaccordion=r,r.NS="ARIAaccordion",r.AUTHOR="Scott O'Hara",r.VERSION="2.1.0",r.LICENSE="https://github.com/scottaohara/accessible-components/blob/master/LICENSE.md";var i="accordion__trigger",n="accordion__heading";r.create=function(){var t,a,l,o,u,c,d="none",s=e.querySelectorAll("[data-aria-accordion]");for(c=0;c<s.length;c++){var A;if((t=s[c]).hasAttribute("id")||(t.id="acc_"+Math.floor(999*Math.random())+1),e.querySelectorAll("#"+t.id+"> li").length?(a=e.querySelectorAll("#"+t.id+" li > .accordion__panel"),l=e.querySelectorAll("#"+t.id+" li > ."+n)):(a=e.querySelectorAll("#"+t.id+" > .accordion__panel"),l=e.querySelectorAll("#"+t.id+" > ."+n)),t.hasAttribute("data-default")&&(d=t.getAttribute("data-default")),u=t.hasAttribute("data-constant"),t.hasAttribute("data-multi"),t.hasAttribute("data-transition")){var g=t.querySelectorAll(".accordion__panel");for(A=0;A<g.length;A++)g[A].setAttribute("style","transition: "+t.getAttribute("data-transition")+"s ease-in-out")}for(r.setupPanels(t.id,a,d,u),r.setupHeadingButton(l,u),o=e.querySelectorAll("#"+t.id+"> li").length?e.querySelectorAll("#"+t.id+" li > ."+n+" ."+i):e.querySelectorAll("#"+t.id+" > ."+n+" ."+i),A=0;A<o.length;A++)o[A].addEventListener("click",r.actions),o[A].addEventListener("keydown",r.keytrolls)}},r.setupPanels=function(t,e,a,r){var i,n,o,u;for(i=0;i<e.length;i++)n=t+"_panel_"+(i+1),o=a,u=r,e[i].setAttribute("id",n),l(e[0],!0),"none"!==o&&NaN!==parseInt(o)&&(o<=1?l(e[0],!1):o-1>=e.length?l(e[e.length-1],!1):l(e[o-1],!1)),(u&&"none"===o||NaN===parseInt(o))&&l(e[0],!1)},r.setupHeadingButton=function(t,a){var r,n,l,u,d,s;for(s=0;s<t.length;s++)n=(r=t[s]).nextElementSibling.id,l=e.getElementById(n).getAttribute("aria-hidden"),u=e.createElement("button"),d=r.textContent,r.innerHTML="",u.setAttribute("type","button"),u.setAttribute("aria-controls",n),u.setAttribute("id",n+"_trigger"),u.classList.add(i),"false"===l?(o(u,!0),c(u,!0),a&&u.setAttribute("aria-disabled","true")):(o(u,!1),c(u,!1)),r.appendChild(u),u.appendChild(e.createTextNode(d))},r.actions=function(t){var a,l=this.id.replace(/_panel.*$/g,""),o=e.getElementById(this.getAttribute("aria-controls"));a=e.querySelectorAll("#"+l.id+"> li").length?e.querySelectorAll("#"+l+" li > ."+n+" ."+i):e.querySelectorAll("#"+l+" > ."+n+" ."+i),t.preventDefault(),r.togglePanel(t,l,o,a)},r.togglePanel=function(t,a,r,i){var n,d,s=t.target;if("true"!==s.getAttribute("aria-disabled")&&(n=s.getAttribute("aria-controls"),c(s,"true"),"true"===s.getAttribute("aria-expanded")?(o(s,"false"),l(r,"true")):(o(s,"true"),l(r,"false"),e.getElementById(a).hasAttribute("data-constant")&&u(s,"true")),e.getElementById(a).hasAttribute("data-constant")||!e.getElementById(a).hasAttribute("data-multi")))for(d=0;d<i.length;d++)s!==i[d]&&(c(i[d],"false"),n=i[d].getAttribute("aria-controls"),u(i[d],"false"),o(i[d],"false"),l(e.getElementById(n),"true"))},r.keytrolls=function(t){if(t.target.classList.contains(i)){var a,r=t.keyCode||t.which,l=this.id.replace(/_panel.*$/g,"");switch(a=e.querySelectorAll("#"+l.id+"> li").length?e.querySelectorAll("#"+l+" li > ."+n+" ."+i):e.querySelectorAll("#"+l+" > ."+n+" ."+i),r){case 35:t.preventDefault(),a[a.length-1].focus();break;case 36:t.preventDefault(),a[0].focus()}}},r.init=function(){r.create()};var l=function(t,e){t.setAttribute("aria-hidden",e)},o=function(t,e){t.setAttribute("aria-expanded",e)},u=function(t,e){t.setAttribute("aria-disabled",e)},c=function(t,e){t.setAttribute("data-current",e)};r.init()}(window,document);