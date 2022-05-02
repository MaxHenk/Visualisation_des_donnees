var mymap = L.map('map').setView([47.003, 1.901], 6);
//Limiter l'emprise de notre carte  A MODIFIER
//mymap.setMaxBounds([[48.52388120259336, 11.524658203125002], [45.1510532655634, 6.591796875000001]])
//mymap.setMinZoom(7);

// Définir les différentes couches de base 
var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
});
var osmNoirBlanc = L.tileLayer(
  'https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', { 
    attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
  }
);
var esriImagery = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/t\ile/{z}/{y}/{x}', {
    attribution: '&copy; <a href="https://www.esri.com">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
);

esriImagery.addTo(mymap);

// Creer le bouton pour changer la couche de base
var baseLayers = {
  "OpenStreetMap": osmLayer,
  "OpenStreetMap noir/blanc": osmNoirBlanc,
  "Images satellites ESRI": esriImagery,
};
var overlays = {};
L.control.layers(baseLayers, overlays).addTo(mymap);

// The svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Load external data
d3.queue()
  .defer(d3.json, "Data/communesFR.geojson")
  .defer(d3.csv, "https://raw.githubusercontent.com/MaxHenk/Visualisation_des_donnees/main/Data/premier_tour_clean.csv", function(d) { data.set(d.code, +d.pop); })
  .await(ready);
