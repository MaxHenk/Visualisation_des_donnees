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

// function onEachFeature(feature, layer) {
//   if (feature.properties && feature.properties.libgeo){
//     layer.bindPopup(feature.properties.libgeo);
//   }
// }
L.geoJSON(communes).addTo(mymap);


// Papa.parse("https://raw.githubusercontent.com/MaxHenk/Visualisation_des_donnees/main/Data/premier_tour_clean.csv", {
//     download: true,
//     header: true,
//     complete: function(results) { 
//       console.log("Finished:", results.data);
//     }
// });

Papa.parse("https://raw.githubusercontent.com/MaxHenk/Visualisation_des_donnees/main/Data/premier_tour_clean.csv", {
    download: true,
    header: true,
    complete: function(results) { //everything below runs only after the CSV has been loaded and processed.
        communesHolder = L.geoJson(communes, { //defining the leaflet overlay layer that will house this data; polygons with location data is are already loaded in PuneElectoralWards variable.
                //style: areastyle,
                onEachFeature: function PBpopulate(feature, layer) { //below code will be executed for each item in the layer
                    var popupText = "";
                    var labelText = "";
                    if (feature.properties && feature.properties.libgeo) {
                        popupText += "<b>" + feature.properties.libgeo.toString() + "</b>";
                        labelText = feature.properties.libgeo.toString();
                        //Here it comes! The part where we look up the CSV data for a row having the same name as the map item's name
                        var filtered = results.data.filter(function(data){return data.Commune == this;}, feature.properties.libgeo.toString());
                        console.log(JSON.stringify(filtered));
                        popupText += "<br>" + JSON.stringify(filtered);
                        }
                    if (feature.properties && feature.properties.description) {
                        popupText += "<br>" + feature.properties.description.toString();
                        }
                    layer.bindPopup(popupText); //.bindLabel(labelText)
                }   //closing onEachFeature function
            }).addTo(mymap); //map layer created, added to "wards" overlay layer
    }   //Papa.parse's complete: section over
}); // Papa.parse function over.


