$(document).ready(function() {
 	$('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});

var resLocations = [
        	{title: 'OHYA Sushi, Korean Kitchen & Bar', address: '4920 W Thunderbird Rd, Glendale, AZ 85306', location: {lat: 33.611548, lng: -112.165117}},
        	{title: "Pullano's Pizza", address: '13848 N 51st Ave, Glendale, AZ 85306', location: {lat: 33.612199, lng: -112.169104}},
        	{title: 'Bangkok Thai B-B-Q', address: '13828 N 51st Ave, Glendale, AZ 85306', location: {lat: 33.611598, lng: -112.170436}},
        	{title: 'Rocket Burger', address: '12038 N 35th Ave #2, Phoenix, AZ 85029', location: {lat: 33.595876, lng: -112.134478}},
        	{title: "Don Ruben's Mexican", address: '4323 W Cactus Rd, Glendale, AZ 85304', location: {lat: 33.595647, lng: -112.152177}}
        ];

var map;
var markers = [];

// Constructor creates a new map - only center and zoom are required.
function initMap() {
	map = new google.maps.Map($('#map')[0], {
	center: {lat:33.609525, lng: -112.161325},
	zoom: 14
	});

	// Creates infowindow object to display restaurant info
    var largeInfoWindow = new google.maps.InfoWindow();

    // Limits the map to display all the locations on the screen
    var bounds = new google.maps.LatLngBounds();

    // The following uses the location array to create an array of markers on initialize.
	for (var i = 0; i < resLocations.length; i++) {
		// Get the position from the location array.
		var position = resLocations[i].location;
		var title = resLocations[i].title;
		// Create a marker per location, and put into markers array.
		var marker = new google.maps.Marker({
		map: map,
		position: position,
		title: title,
		animation: google.maps.Animation.DROP,
		id: i
		});
		// Push the marker to our array of markers.
		markers.push(marker);
		// Create an onclick event to open an infowindow at each marker.
		marker.addListener('click', function() {
		populateInfoWindow(this, largeInfowindow);
		});
	}	
}

// My ViewModel
function ViewModel(){
	var self = this;
	this.searchFilter = ko.observable();
	this.locations = ko.observableArray(resLocations);	

    // Filters the list of restaurants
    this.visibleLocations = ko.computed(function(){
       return this.locations().filter(function(location){
           if(!self.searchFilter() || location.title.toLowerCase().indexOf(self.searchFilter().toLowerCase()) !== -1)
             return location;
       });
   },this);
}
        
ko.applyBindings(new ViewModel());


// $('#show-listings').on('click', showListings);
// $('#hide-listings').on('click', hideListings);

// // This function populates the infowindow when the marker is clicked.
// function populateInfoWindow(marker, infowindow) {
// 	// Check to make sure the infowindow is not already opened on this marker.
// 	if (infowindow.marker != marker) {
// 		infowindow.marker = marker;
// 		infowindow.setContent('<div>' + marker.title + '</div>');
// 		infowindow.open(map, marker);
// 		// Make sure the marker property is cleared if the infowindow is closed.
// 		infowindow.addListener('closeclick',function(){
// 		infowindow.setMarker = null;
// 	});
// }
// }

// // This function will loop through the markers array and display them all.
// function showListings() {
// var bounds = new google.maps.LatLngBounds();
// // Extend the boundaries of the map for each marker and display the marker
// for (var i = 0; i < markers.length; i++) {
//   markers[i].setMap(map);
//   bounds.extend(markers[i].position);
// }
// map.fitBounds(bounds);
// }

// // This function will loop through the listings and hide them all.
// function hideListings() {
// for (var i = 0; i < markers.length; i++) {
//   markers[i].setMap(null);
// }
// }

