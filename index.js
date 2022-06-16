//définition des variables

var data;
var premier_tour;
var deuxieme_tour;
var cmnes; // supprimer
var cantons; // TODO: appeler départements
let chargement;
let d = 255

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

//fonction pour mettre le bouton en gras qui ne fonctionne pas 
function changeStyle(value){
    var element = document.getElementById(value);
    element.style.fontWeight = "700";
}
//set a zoom

const zoom = d3.zoom().on('zoom', handle_zoom)
var scale = Math.min(scaleX, scaleY);

var xmin = 84334; 
var ymin = 6046258; 
var dx = -1 * scale * xmin;
var dy = scale * ymin + 600;

const geoPath = d3.geoPath();

const candidat_to_hide = ["arthaud", "roussel","lasalle","zemmour","melenchon","hidalgo","jadot","pecresse","poutou","dupontaignan"]

var display_tour = 1
var display_cand = "macron"


//fonctions appelée par les boutons
function set_tour(value){
    display_tour = value
    var elem

    for(let i=0; i< candidat_to_hide.length; i++){
        elem = document.getElementById(candidat_to_hide[i])
        if(display_tour == 2){
            if(display_cand !== "macron" && display_cand !== "lepen"){
                display_cand = "macron"
                document.getElementById("macron").setAttribute("selected", true)
            }
            elem.setAttribute("disabled", true)
            elem.style.display = "none"
            document.getElementById("second_tour").style.fontWeight = "bold";
            document.getElementById("tour").style.fontWeight = "normal";

        }else{
            elem.setAttribute("disabled", true)
            elem.style.display = "block"
            document.getElementById("second_tour").style.fontWeight = "normal";
            document.getElementById("tour").style.fontWeight = "bold";
        } 

    }  

    update_carte_tour()
}

function set_cand (value){
   
    display_cand = value
    update_carte_tour()
}

function handle_zoom(e){
    d3.select("#com").attr('transform', e.transform)
}

//cette fonction part du principe que tous les datasets sont complets
function update_carte_tour(){
    document.getElementById("progress").innerHTML = `Chargement en cours...`

    let counter = 0
    d3.select("#com")
        .attr('transform', 
        `matrix(${scale} 0 0 ${-1 * scale} ${dx} ${dy})`)
        .selectAll('path')
        .data(cmnes.features)
        .attr('fill', function(feature){
            counter += 1
            if(display_tour == 1){
                votes_commune = premier_tour.find(el => el.CodeInsee == feature.properties.codgeo)
            } else {
                votes_commune = deuxieme_tour.find(el => el.CodeInsee == feature.properties.codgeo)
            }
            try{
                let p = votes_commune[display_cand] / votes_commune.Votants   
                const c = 255-(p * 255)
                if (p < 0.05) { 
                    d = p* 100 * 255
                    return `rgb(${d} ${c} ${c} )` // TODO: changer les couleurs  
                }
                return `rgb(255 ${c} ${c} )`    
            }catch (error){
                // do nothing
            }
        })

    document.getElementById("progress").innerHTML = `Chargement terminé`
    console.log("candidat:", display_cand, "   tour:", display_tour)
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
        update_carte_tour()
        //zoom_carte()
        clique_carte(premier_tour)
    })
    
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

/*
function zoom_carte(){

var zoom = d3.zoom()
      .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
      .on("zoom", update_carte_tour());
       .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);

    var svg = d3.select('svg');
    var g = svg.append('g');

    g.append('path')
      .attr('d', geoPath)

    svg.call(zoom().on('zoom', () => {
          g.attr('transform', event.transform);
        }));



    svg.append("rect")
      .attr("width", dx)
      .attr("height", dy)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .call(zoom);
      
    communes = d3.selectAll('path')
    communes.data(cmnes.features)
      .call(d3.zoom().on("zoom", function () {
                svg .attr("transform", d3.event.transform)
                }))
              .append("g")
} */

   
function clique_carte(){
    communes = d3.selectAll('path')
    communes.data(cmnes.features)
    communes.on("click", function(d) {
        if (display_tour == 1){
            liste_candidat = ["arthaud","roussel","macron","lassale","lepen","zemmour","melenchon","hidalgo","jadot","pecresse","poutou","dupontaignan"]
        } else {
            liste_candidat = ["macron", "lepen"]
        }
        var marqueur = d.target //créer un objet unique après chaque clic
        var props = marqueur.__data__ //variable contenant les les propriétés de la commune
        var prop_commune;
        if (display_tour == 1){
            prop_commune = premier_tour.find(el => el.CodeInsee == props.properties.codgeo)
        } else {
            prop_commune = deuxieme_tour.find(el => el.CodeInsee == props.properties.codgeo)
        } //lien entre json et csv
        var results_com = []
        for(var i = 0; i < liste_candidat.length; i++) {
            results_com.push(prop_commune[liste_candidat[i]])
        }
        console.log("resultats", results_com)
        console.log("res", prop_commune)

        console.log(marqueur.__data__.properties.libgeo)
        console.log(prop_commune["arthaud"])
        //Histogram in infobox communes
        //Basic elements of graph
        //Variables du graphique infobox-communes
        

        //X scale for the graphic
        var x = d3.scalePoint()
                .domain(liste_candidat)
                .range([0, width_graph])
                .padding(0.4);

        var y = d3
           .scaleLinear()
           .range([height_graph, 0])
           .domain([0, d3.max(results_com)]);

        //Top element of the bar plot
        var svg = d3.select("#infobox-communes")
                    .append("svg")
                    .attr("width", width_graph + margin_graph.left + margin_graph.right)
                    .attr("height", height_graph + margin_graph.top + margin_graph.bottom)
                    .attr("id", "barplot")
                    .append("g")
                    .attr("transform",
                        "translate(" + margin_graph.left + "," + margin_graph.top + ")");

        svg.append("g")
           .attr("transform", "translate(0," + height_graph + ")")
           .call(d3.axisBottom(x))
           .selectAll("text")
           .attr("transform", "translate(-10,0)rotate(-45)")
           .style("text-anchor", "end");
        svg.append("g")
           .call(d3.axisLeft(y));
        
        svg
           .selectAll("rect")
           .data(results_com)
           .enter()
           .append("rect")
           .attr("x", function(d,i){
            return x(liste_candidat[i])
           })
           .attr("y", function(d){
            return y(d)
           })
           //.attr("transform", function(d) {
           //  return "translate(" + x(d.x0) + "," + y(d.length) + ")";
           //})
           .attr("width", 10)
           .attr("height", function(d){
            return height_graph - y(d)
           })
           .style("fill", "#69b3a2");
        svg.exit().remove()
    })
}

prepare_document() //equivalent main()