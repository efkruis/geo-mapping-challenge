// Store our API endpoint as queryUrl.
var queryUrrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";


// Perform a GET request to the query URL/
d3.json(queryUrl).then(function(data){
   
    // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
    console.log(data.features)
});

function createFeatures(earthquakeData) {
    
    // Define a function that we want to run once for each feature in the features array.
    // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(features, layer){
        layer.bindPopup("<h3>" + features.properties.place + 
        "</h3><hr><p>" + new Date(features.properties.time) + 
        "</h3><hr><p>" + "Magnitude: " + features.properties.mag +"</p>" + 
        "</h3><hr><p>" + "Depth: " + features.geometry.coordinates[2] + "</p>");
    }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    })
  
    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

function createMap(earthquakes){
    
//Create the base layers
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

//create a baseMaps objects
  var baseMaps = {
      "Street Map": street, 
      "Topographic Map": topo
  };

//create an overlay objects to hld our overlay
  var overlayMaps = {
      Earthquakes: earthquakes
  };

//Creatng a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 3,
    layers: [street, topo, earthquakes]
    
});

//create a layer control.
//pass it our baseMaps and overlayMaps
//add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

};
 
