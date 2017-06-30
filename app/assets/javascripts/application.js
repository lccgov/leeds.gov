//sticky-nav
function sticky_relocate() {
    var window_top = $(window).scrollTop();
    var div_top = $('#sticky-anchor').offset().top;
    if (window_top > div_top) {
        $('#sticky').addClass('stick');
        $('#sticky-anchor').height($('#sticky').outerHeight());
    } else {
        $('#sticky').removeClass('stick');
        $('#sticky-anchor').height(0);
    }
}

$(function() {
    $(window).scroll(sticky_relocate);
    sticky_relocate();
});

var dir = 1;
var MIN_TOP = 200;
var MAX_TOP = 350;

$('main').scrollspy({ target: '#sidebar-nav' })

//random image for hero-lcc
function randomImage(){
  var images = [
   '/public/images/hero-image-1.jpg',
   '/public/images/hero-image-2.jpg',
   '/public/images/hero-image-3.jpg',
   '/public/images/hero-image-4.jpg',
   '/public/images/hero-image-5.jpg',
   '/public/images/hero-image-6.jpg'];
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

//search auto complete configuration
    var options = {
    url: "/public/javascripts/site-search.json",

    getValue: "page",

    template: {
        type: "description",
        fields: {
            description: "service"
        }
    },

    list: {
        maxNumberOfElements: 10,
        match: {
            enabled: true
        }
    },

    theme: "square"
};

$("#hero-site-search").easyAutocomplete(options);

