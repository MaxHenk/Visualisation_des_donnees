let data = [], width = 600, height = 400, numPoints = 100;
//définition des variables

//var data;
var premier_tour;
var deuxieme_tour;
var cmnes; 
var cantons; // TODO: appeler départements

// TODO centrer carte
const scaleX = 430 / 1160000;
const scaleY = 600 / 1070000;
//const elem = document.getElementById("chloropleth");
//const rectan = elem.getBoundingClientRect();

//Size of bar plot
var margin_graph = {top: 10, right: 30, bottom: 30, left: 40};
var width_graph = 330 - margin_graph.left - margin_graph.right;
var height_graph = 300 - margin_graph.top - margin_graph.bottom;
//const scaleX =  rectan.width/ 1400000;
//const scaleY = rectan.height/ 1310000;

function changeStyle(value){
    var element = document.getElementById(value);
    element.style.fontWeight = "700";
}
//set a zoom

//const zoom = d3.zoom().on('zoom', handle_zoom)
var scale = Math.min(scaleX, scaleY);

var xmin = 84334; 
var ymin = 6046258; 
var dx = -1 * scale * xmin;
var dy = scale * ymin + 600;

const geoPath = d3.geoPath();

const candidat_to_hide = ["arthaud", "roussel","lasalle","zemmour","melenchon","hidalgo","jadot","pecresse","poutou","dupontaignan"]

var display_tour = 1;
var display_cand = "lepen"


//fonctions appelée par les boutons
function set_tour (value){
    display_tour = value

    if(display_tour == 2){ 
        for(let i=0; i< candidat_to_hide.length; i++){
            var elem = document.getElementById(candidat_to_hide[i])
            elem.style.display = "none"
        } 
    }else{
        for(let i=0; i< candidat_to_hide.length; i++){
            var elem = document.getElementById(candidat_to_hide[i])
            elem.style.display = "block"
        } 
    }  

    update_carte_tour()
}

function set_cand (value){
   
    display_cand = value

    console.log(display_cand)
    console.log(display_tour)

    update_carte_tour()
}

let zoom = d3.zoom()
  .on('zoom', handleZoom);

function handleZoom(e) {
  d3.select('svg g')
    .attr('transform', e.transform);
}

function initZoom() {
  d3.select('svg')
    .call(zoom);
}

function updateData() {
  data = [];
  for(let i=0; i<numPoints; i++) {
    data.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height
  	});
  }
}

function dessine_carte(){

  d3.select('#com')
      .attr('transform', 
          `matrix(${scale} 0 0 ${-1 * scale} ${dx} ${dy})`)
      .selectAll('path')
      .data(cmnes.features)
      .enter()
      .append('path')
      .attr('d', geoPath)

  d3.select('svg').call(zoom)

}

//initialisation et chargement des données
function prepare_document(){ //function main(){}
  Promise.all([
      d3.json('Data/communes-cantons-quant-topo.json'),
      d3.csv('Data/premier.csv', d3.autoType),
      d3.csv('Data/deuxieme.csv', d3.autoType),
  ]).then(function (result) {
      data = result[0]
      premier_tour = result[1]
      deuxieme_tour = result[2]

      cmnes = topojson.feature(data, data.objects.communes)
      cantons = topojson.feature(data, data.objects.departements)
      
      dessine_carte()
     // update_carte_tour()
      //zoom_carte()
      //clique_carte(premier_tour)
  })
  
}

/*function update() {
  d3.select('svg g')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 3);*/

    function update_carte_tour(){

      d3.select("#com")
          .attr('transform', 
          `matrix(${scale} 0 0 ${-1 * scale} ${dx} ${dy})`)
          .selectAll('path')
          .data(cmnes.features)
          .attr('fill', function(feature){
              if(display_tour == 1){
                  votes_commune = premier_tour.find(el => el.CodeInsee == feature.properties.codgeo)
              } else {
                  votes_commune = deuxieme_tour.find(el => el.CodeInsee == feature.properties.codgeo)
              }
              try{
                  let p = votes_commune[display_cand] / votes_commune.Votants   
                  const c = p * 255
                  return `rgb(${c} 0 0)`  // TODO: changer les couleurs       
              }catch (error){
                return `rbg(0 0 0)`
              }
  
          })
  
      console.log(display_cand, display_tour)
  
  }   


initZoom();
prepare_document();
update_carte_tour();