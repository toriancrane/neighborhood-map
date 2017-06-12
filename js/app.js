$(document).ready(function() {
 	$('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});

function googleMapError(){
  alert("Google Maps API is not loading...");
}

// var resLocations = [
//         	{title: 'OHYA Sushi, Korean Kitchen & Bar', address: '4920 W Thunderbird Rd, Glendale, AZ 85306', location: {lat: 33.611548, lng: -112.165117}},
//         	{title: "Pullano's Pizza", address: '13848 N 51st Ave, Glendale, AZ 85306', location: {lat: 33.612199, lng: -112.169104}},
//         	{title: 'Bangkok Thai B-B-Q', address: '13828 N 51st Ave, Glendale, AZ 85306', location: {lat: 33.611598, lng: -112.170436}},
//         	{title: 'Rocket Burger', address: '12038 N 35th Ave #2, Phoenix, AZ 85029', location: {lat: 33.595876, lng: -112.134478}},
//         	{title: "Don Ruben's Mexican", address: '4323 W Cactus Rd, Glendale, AZ 85304', location: {lat: 33.595647, lng: -112.152177}}
//         ];

var map;
var resMarker;
var markers = [];

var resLocations = [];
var viewModel;
var cStr;

// Constructor creates a new map - only center and zoom are required.
function initMap() {
	map = new google.maps.Map($('#map')[0], {
	center: {lat:33.609525, lng: -112.161325},
	zoom: 14
	});

	// Limits the map to display all the locations on the screen
    var bounds = new google.maps.LatLngBounds();


}

//My list model that calls the info from my json file
function ResListModel(restaurants){
	$.ajax({
		method: 'get',
		dataType: 'json',
		url: '/js/reslocations.json'
	}).done(function(data){
		var resLocations = data.resLocations;
		resLocations.forEach(function(coordinates, i){
			viewModel.restaurants.push(new LocationModel(coordinates, viewModel));
		});
	}).fail(function(err){
		console.error(err);
	});
}

var LocationModel = function(coordinates, viewModel) {
	var self = this;
	self.title = coordinates.title;
	self.address = coordinates.address;
	self.city = coordinates.city;
	self.state = coordinates.state;
	self.zipcode = coordinates.zipcode;
	self.coordinates = coordinates.coordinates;

	self.createMarker = ko.computed(function(){
		if (viewModel.google()){
			self.resMarker = new google.maps.Marker({
				coordinates: self.coordinates,
				map: map,
				title: self.title,
				visible: true,
				animation: google.maps.Animation.DROP
			});
			self.resMarker.setVisible(true);
			self.cStr = ko.computed(function(){
				return '<div><i>' + self.title + '</i></div>' +
						'<div>' + self.address + '</div>' + 
						'<div>' + self.city + ',' + self.state + self.zipcode + '</div>';
			});
			self.resMarker.addListener('click', function(){
				function removeSpaces(str){
					str.replace(/\s+/g, '-').toLowerCase();
				}
				var yelpURL = 'api.yelp.com/v2/business/' + removedSpaces(self.title)
			})
			www.yelp.com/biz/name-city
		}
	})
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
        



// Creates infowindow object to display restaurant info
    var largeInfoWindow = new google.maps.InfoWindow();

    

 //    // The following uses the location array to create an array of markers on initialize.
	// for (var i = 0; i < resLocations.length; i++) {
	// 	// Get the position from the location array.
	// 	var position = resLocations[i].location;
	// 	var title = resLocations[i].title;
	// 	// Create a marker per location, and put into markers array.
	// 	var marker = new google.maps.Marker({
	// 	map: map,
	// 	position: position,
	// 	title: title,
	// 	animation: google.maps.Animation.DROP,
	// 	id: i
	// 	});
	// 	// Push the marker to our array of markers.
	// 	markers.push(marker);
	// 	// Create an onclick event to open an infowindow at each marker.
	// 	marker.addListener('click', function() {
	// 	populateInfoWindow(this, largeInfowindow);
	// 	});
	// }



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

