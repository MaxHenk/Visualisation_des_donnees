var mymap = L.map('map').setView([46.704532663131076, 8.75026434659958], 8);

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