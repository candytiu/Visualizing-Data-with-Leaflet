// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
    });
   
// Define the color of the marker based on the magnitude of the earthquake.
function color(magnitude) {
switch (true) {
    case magnitude > 5:
    return "#ea2c2c";
    case magnitude > 4:
    return "#ea822c";
    case magnitude > 3:
    return "#ee9c00";
    case magnitude > 2:
    return "#eecc00";
    case magnitude > 1:
    return "#d4ee00";
    default:
    return "#98ee00";
}}

// Define the radius of the marker based on the magnitude of the earthquake.
function markerSize(magnitude) {
    return magnitude * 4;
};

function styleInfo(feature) {
return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: color(feature.properties.mag),
    color: "#000000",
    radius: markerSize(feature.properties.mag),
    stroke: true,
    weight: 0.5
};}

function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3> Magnitude: " + feature.properties.mag + "<br> Location: " + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, place) {
            return L.circleMarker(place);
          },
        style: styleInfo,
        onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
    }

function createMap(earthquakes) {
    // Define lightmap, satellitemap, and outdoor
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets-satellite",
        accessToken: API_KEY
    });
    var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Grayscale": lightmap,
        "Satellite Map": satellitemap,
        "Outdoors": outdoorsmap
    };
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map-id", {
    center: [
    37.09, -95.71
    ],
    zoom: 3,
    layers: [lightmap, earthquakes]
    });
    // Create a layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create a legend to display information about our map
    var legend = L.control({
    position: "bottomright"
    });

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0, 1, 2, 3, 4, 5],
        labels = [];

    div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"
    
    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<span style="background:' + color(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+') + '</span>';
    }
    return div;
    };
    legend.addTo(myMap);
}


