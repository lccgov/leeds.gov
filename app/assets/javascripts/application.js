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
//= require contact-us-form
//= require survey
//= require component.related.pages
//= require services.sharepoint
//= require component.ongoing.incidents
//= require component.dead.animals

//removes top margin frpm right hand column if empty
function isEmpty( el ){
      return !$.trim(el.html())
  }
  if (isEmpty($('aside.col-md-4'))) {
      $('aside.col-md-4').addClass('empty');
  }
  
// //input block label
// $('input:radio').click(function() {
//     $('input:radio[name='+$(this).attr('name')+']').parent().removeClass('active');
//         $(this).parent().addClass('active');
// });

// //input block label
// $('input:checkbox').click(function() {
//     	$(this).parent().toggleClass('active');
// });

//random image for hero-lcc
function randomImage(){
  var images = [
   '/_catalogs/masterpage/public/images/home-hero-images/1.jpg',
   '/_catalogs/masterpage/public/images/home-hero-images/2.jpg',
   '/_catalogs/masterpage/public/images/home-hero-images/3.jpg',
   '/_catalogs/masterpage/public/images/home-hero-images/4.jpg',
   '/_catalogs/masterpage/public/images/home-hero-images/5.jpg'];
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

$(document).ready(function () {
    var checkURL = ['visit/', 'discoverycentre', 'abbeyhouse','thwaitemills','kirkstallabbey','leedsartgallery','armleymills','templenewsamhouse','leedscitymuseum','lothertonhall'];

    for (var i = 0; i < checkURL.length; i++) {
        if(window.location.href.indexOf(checkURL[i]) > -1) {
            $('.masterhead').after('<div class="backto"><div class="container-fluid"><a href="/museumsandgalleries/home" class="link-back">Back to Museums and Galleries</a></div></div>');
        }
    }
});