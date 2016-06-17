

//  code reference - http://stackoverflow.com/questions/8746882/jquery-contains-selector-uppercase-and-lower-case-issue


// on document html load fire containing javascript
$(function(){
  // on button press in search input field
  $('#searchField').on('keyup', function(){

    var searchTerm = $(this).val();

    jQuery.expr[':'].contains = function(a, i, m) {
      return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
    };

    // if searchTerm has value hide all .media except ones containing search term... else if searchTerm empty display all .media elements
    if ( searchTerm ) {
      console.log(searchTerm);
      $('.media').css( "display", "none" );
      $('.media-title:contains("'+searchTerm+'")').parent().parent().css( "display", "block" );
      if($('.media-title:contains("'+searchTerm+'")').length === 0){
        // no results found possibly notify user here!
      }
    }else if(searchTerm == ""){
      console.log(searchTerm);
      $('.media').css( "display", "block" );
    }
  });

  // on click of image a route image
  $('.route-link').on('click', function(e){
      e.preventDefault();// stops the jumpin to the top of the page onclick

      //if map is not already active, else remove map and assosciate data
      if(!$(this).hasClass('active')){

        // here we start by getting the containing route wrap to the image clicked upon
        // the information for each route can be found on each .media element in the form of data- attributes location, start, end
        // then we are retreiving the center point of the map that will encompass both the start point and the end this will be in the form of latitude and longitude coordinates
        // then we retrieve the starting location and attatch them to a global variable so the map has access
        var $thisMedia = $(this).parent().parent();
        thisLocation = $thisMedia.attr('data-location');
        thisStart = $thisMedia.attr('data-start');
        thisEnd = $thisMedia.attr('data-end');
        
        // removing any active maps/classes
        $('.route-link').removeClass('active');
        $('#map-routes').remove();
        map = null;

        // append map element to clicked .media element
        $thisMedia.append('<div id="map-routes"></div>');

        // add google maps to page and initiate
        setTimeout(function(){
          $('head').append('<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBsWdxJi-Tx-nDXtuEb2CnIpRMHk8OW32I&callback=initMap" async defer></script>');
        }, 150);

        // add class to .media element so we know its active
        $(this).addClass('active');
      }else{
        $('#map-routes').remove();
        map = null;
        directionsDisplay = null;
        directionsService = null;
        $(this).removeClass('active');
      }
  });
});


var directionsDisplay;
var directionsService;
var map;
var thisLocation;
var thisStart;
var thisEnd;

// initiate google maps function
function initMap() {
  
  // first slip lat and longitude by their separating coma
  var LatLong = thisLocation.split(',');

  // setup for adding directions to map
  directionsDisplay = new google.maps.DirectionsRenderer({ draggable: true });
  directionsService = new google.maps.DirectionsService();

  // starting normal map and setting up the options for it
  // for different styling options for the map visit https://snazzymaps.com/ and replace styling options in the styles: field below
  map = new google.maps.Map(document.getElementById('map-routes'), {
    center: {lat: parseFloat(LatLong[0]), lng: parseFloat(LatLong[1])},
    zoom: 8,
    disableDefaultUI: false,
    styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
  });

  // more directional setup
  directionsDisplay.setMap(map);
  //add details (step by step instructions) of the route
  /*directionsDisplay.setPanel(document.getElementById("directions"));*/

  // route details
  var request = {
      origin: thisStart,
      destination: thisEnd,
      travelMode: google.maps.TravelMode['BICYCLING']
  };

  // apply directions if request for them was successful
  directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
      }
  })

}



var App=(function(){
	var $navList;
	var $contentDiv;
	var $location;
	var $describle;
	var $routemiles;
    
	function createHandler(route)
	{
		return function(){
			/*contentDiv.classList.remove("hide");
			location.innerHTML=route.location;
			describle.innerHTML=route.describle;
			routemiles.innerHTML=route.routemiles;*/
            $contentDiv.removeClass("hide");
            $location.text(route.location);
            $describle.text(route.describle);
            $routemiles.text(route.routesmiles);
		}
	}

	function populateList(routes)
	{
		/*navList=document.getElementById("nav");

		routes.forEach(function(route){
			
			var newLi=document.createElement("li");
			newLi.innerHTML=route.name;
		    newLi.addEventListener("click", createHandler(route), false)
			navList.appendChild(newLi);
		})*/
        $.each(routes, function(index,route){
            //thats fine beause it's a different variable for each route in the array
			var $newLi = $('<li>'+route.name+ ' ' + route.location + route.routemiles+ '</li>').click(createHandler(route))
			$("#nav").append($newLi);
		})
	}

	
	function init(){
		/*$navList=document.getElementById("nav");*/
        $navList=$("#nav");
        $contentDiv=$("#content");
        $location=$("#location");
		$describle=$("#describle");
        $routemiles=$("#routemiles");
        $.getJSON("js/data.json",populateList).fail(function(err) { console.log(err); });
		//first problem was - json file had error
        
		/*ajax.makeRequest("js/data.json",populateList);*/
	}
	return{
		init:init
	}
    
})();

$(document).ready(function(){
    App.init();
});





//Contact - Comment then sumbit//
$('#contact-submit').on('click', function(){
    var formTag = $('.form-inline');
     $.ajax( {
      type: "POST",
      url: formTag.attr( 'action' ),
      data: formTag.serialize(),
      success: function( response ) {
        console.log( response );
          
      }
         
    });
});





