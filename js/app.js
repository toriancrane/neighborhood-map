$(document).ready(function() {
 	$('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});

function googleMapError(){
  alert("Google Maps API is not loading...");
}

var map;
var resMarker;
var markers = [];

var resLocations = [];
var ViewModel;
var cStr;

// Constructor creates a new map - only center and zoom are required.
function initMap() {
	map = new google.maps.Map($('#map')[0], {
	center: {lat:33.609525, lng: -112.161325},
	zoom: 14
	});

	// Limits the map to display all the locations on the screen
    var bounds = new google.maps.LatLngBounds();
    viewModel.google(!!window.google);
}

//My list model that calls the info from my json file
function ResListModel(restaurants){
	$.ajax({
		method: 'get',
		dataType: 'json',
		url: '/js/reslocations.json'
	}).done(function(data){
		var resLocations = data.resLocations;
		console.log(resLocations);
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
	self.position = coordinates.coordinates;

	self.createMarker = ko.computed(function(){
		if (viewModel.google()){
			self.resMarker = new google.maps.Marker({
				position: self.position,
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
				  // Adding Wikipedia API
			        var wikiUrl = 'https://en.wikipedia.org/w/api.php?'+
			                      'action=opensearch&search=' + self.title +
			                      '&format=json&callback=wikiCallback';

                   $.ajax({
			          url: wikiUrl,
			          dataType: "jsonp"
			        }).done(function(response){
			          var resInfo = response[3][0];
			          if (resInfo === undefined){
			          var errorURL = 'Wikipedia Article unavailabe for ' + self.title;
			          viewModel.largeInfoWindow.setContent(self.cStr() + errorURL);
			          } else {
			          var successURL = '<div><a href="' + resInfo + '" target="_blank">' + self.title + '</a></div>';
			          //Set infowindow content
			          viewModel.largeInfoWindow.setContent(self.cStr() + successURL);}
			          // Open LargeInfoWindow
			          viewModel.largeInfoWindow.open(map, self.resMarker);
			        }).fail(function(){
			          //Set infowindow content
			          viewModel.largeInfoWindow.setContent(self.cStr() + "<em><br>Wikipedia data has failed to load.</em>");
			          // Open LargeInfoWindow
			          viewModel.largeInfoWindow.open(map, self.resMarker);
			        });
			        // Marker Animations
			        self.resMarker.setAnimation(google.maps.Animation.BOUNCE);
			        setTimeout (function(){self.resMarker.setAnimation(null);}, 750);
			      });
				}
			})
		};

// My ViewModel
var ViewModel = function(LocationModel) {
  var self = this;
  self.restaurants = ko.observableArray();
  self.google = ko.observable(!!window.google);

  ResListModel(self.restaurants);

  self.infoWindowCreation = ko.computed(function(){
    if (self.google()){
      self.largeInfoWindow = new google.maps.InfoWindow();
    }
  });

  // Search Filter
  self.resSearch = ko.observable("");

  self.resLocations = ko.computed(function(){
    var filter = self.resSearch().toLowerCase();
    return ko.utils.arrayFilter(self.restaurants(), function(coordinates){
      var resResults = coordinates.title.toLowerCase().indexOf(filter) >= 0;
      if(coordinates.resMarker){
        coordinates.resMarker.setVisible(resResults);
      }
      return resResults;
    });
  });


  // Click binding for markers
  self.markerAnimator = function(coordinates) {
    google.maps.event.trigger(coordinates.resMarker, 'click');
  };


};

viewModel = new ViewModel();
ko.applyBindings(viewModel);