// Initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoibGw2ZmQiLCJhIjoiY2pkMTM4aTFyM2VoMjJ4cnh1dDk5MHRjOCJ9.LcGOwp-8CuNgdTrFn80UcQ'; // replace this value with your own access token from Mapbox Studio

var map = new mapboxgl.Map({
	container: 'map', // this is the ID of the div in index.html where the map should go
    center: [-78.474205,38.031331], // set the centerpoint of the map programatically. Note that this is [longitude, latitude]!
    zoom: 13, // set the default zoom programatically
	style: 'mapbox://styles/ll6fd/cjpifdap911h02ss0a3n7m9v1', // replace this value with the style URL from Mapbox Studio
	customAttribution: 'City of Charlottesville Open Data Portal (http://opendata.charlottesville.org/)' // Custom text used to attribute data source(s)
});

// Show modal when About button is clicked
$("#about").on('click', function() { // Click event handler for the About button in jQuery, see https://api.jquery.com/click/
    $("#screen").fadeToggle(); // shows/hides the black screen behind modal, see https://api.jquery.com/fadeToggle/
    $(".modal").fadeToggle(); // shows/hides the modal itself, see https://api.jquery.com/fadeToggle/
});

$(".modal>.close-button").on('click', function() { // Click event handler for the modal's close button
    $("#screen").fadeToggle();
    $(".modal").fadeToggle();
});


// Legend
var layers = [ // an array of the possible values you want to show in your legend
    'Exsisting Parking',
    'Vehicle Parking',
    'Permit Parking',
    'Parking Exempt'
];

var colors = [ // an array of the color values for each legend item
    '#4848cb',
    '#93e6d0',
    '#dad2d2',
    '#f0783c'
];

// for loop to create individual legend items
for (i=0; i<layers.length; i++) {
    var layer =layers[i]; // name of the current legend item, from the layers array
    var color =colors[i]; // color value of the current legend item, from the colors array 
    
    var itemHTML = "<div><span class='legend-key'></span><span>" + layer + "</span></div>"; // create the HTML for the legend element to be added
    var item = $(itemHTML).appendTo("#legend"); // add the legend item to the legend
    var legendKey = $(item).find(".legend-key"); // find the legend key (colored circle) for the current item
    legendKey.css("background", color); // change the background color of the legend key
}

// 10.25 starts here----------------------------------------------
// 
// INFO WINDOW CODE 
    
    // Replace contents of info window when user hovers over a park
    map.on('mousemove', function(e) {   // Event listener to do some code when the mouse moves, see https://www.mapbox.com/mapbox-gl-js/api/#events. For a list of event types, see 

      var parks = map.queryRenderedFeatures(e.point, {
        layers: ['cville-parks']    // replace 'cville-parks' with the name of the layer you want to query (from your Mapbox Studio map, the name in the layers panel)
      });

      if (parks.length > 0) {   // if statement to make sure the following code is only added to the info window if the mouse moves over a state
        $('#info-window-body').innerHTML = '<h3><strong>' + parks[0].properties.PARKNAME + '</strong></h3><p>' + parks[0].properties.PARK_TYPE + ' PARK</p><p>URL: <a href="' + parks[0].properties.WEBURL + '">' 
            + parks[0].properties.WEBURL + '</a></p>';
      } else {
        $('#info-window-body').innerHTML = '<p>A webmap about Parking in Cville.</p>';
      }
    
    });


// POPUPS CODE

    // Create a popup on click 
    map.on('click', function(e) { // Event listener to do some code when user clicks on the map
      

      var stops = map.queryRenderedFeatures(e.point, { // Query the map at the clicked point. See https://www.mapbox.com/mapbox-gl-js/example/queryrenderedfeatures/ for an example on how queryRenderedFeatures works and https://www.mapbox.com/mapbox-gl-js/api/#map#queryrenderedfeatures for documentation
        layers: ['cville-bus-stops'] // replace this with the name of the layer
      });


      // if the layer is empty, this if statement will return NULL, exiting the function (no popups created) -- this is a failsafe to avoid endless loops
      if (!stops.length) {
        return;
      }

      // Sets the current feature equal to the clicked-on feature using array notation, in which the first item in the array is selected using arrayName[0]. The event listener above ("var stops = map...") returns an array of clicked-on bus stops, and even though the array might only have one item, we need to isolate it by using array notation as follows below.
      var stop = stops[0];
      
      // Initiate the popup
      var popup = new mapboxgl.Popup({ 
        closeButton: true, // If true, a close button will appear in the top right corner of the popup. Default = true
        closeOnClick: true, // If true, the popup will automatically close if the user clicks anywhere on the map. Default = true
        anchor: 'bottom', // The popup's location relative to the feature. Options are 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left' and 'bottom-right'. If not set, the popup's location will be set dynamically to make sure it is always visible in the map container.
        offset: [0, -15] // A pixel offset from the centerpoint of the feature. Can be a single number, an [x,y] coordinate, or an object of [x,y] coordinates specifying an offset for each of the different anchor options (e.g. 'top' and 'bottom'). Negative numbers indicate left and up.
      });

      // Set the popup location based on each feature
      popup.setLngLat(stop.geometry.coordinates);

      // Set the contents of the popup window
      popup.setHTML('<h3>Stop ID: ' + stop.properties.stop_id   // 'stop_id' field of the dataset will become the title of the popup
                           + '</h3><p>' + stop.properties.stop_name // 'stop_name' field of the dataset will become the body of the popup
                           + '</p>');

      // Add the popup to the map
      popup.addTo(map);  // replace "map" with the name of the variable in line 28, if different
    });

