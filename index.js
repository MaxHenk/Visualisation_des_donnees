

//définition des variables

var data;
var premier_tour;
var deuxieme_tour;
var cmnes; 
var cantons; // TODO: appeler départements

//Variables du graphique infobox-communes
var margin_graph = {top: 10, right: 30, bottom: 30, left: 40};
var width_graph = 330 - margin_graph.left - margin_graph.right;
var height_graph = 300 - margin_graph.top - margin_graph.bottom;

// TODO centrer carte
const scaleX = 430 / 1160000;
const scaleY = 600 / 1070000;
//const elem = document.getElementById("chloropleth");
//const rectan = elem.getBoundingClientRect();

//const scaleX =  rectan.width/ 1400000;
//const scaleY = rectan.height/ 1310000;

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
            elem.style.display = "inline-block"
        } 
    }  

    update_carte_tour()
}

function set_cand (value){
    //if (display_cand != "lepen" || "macron") ; //DISABLE POUR NE PAS ALLER DANS LE DEUXIEME

    display_cand = value

    console.log(display_cand)
    console.log(display_tour)
}

//cette fonction part du principe que tous les datasets sont complets
function update_carte_tour(){
    d3.select('#com')
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
        
        console.log(cmnes.features)
        dessine_carte()
        update_carte_tour()
        clique_carte(premier_tour)
    })
    
}

function dessine_carte(){

    let votes_commune 

    d3.select('#com')
        .attr('transform', 
            `matrix(${scale} 0 0 ${-1 * scale} ${dx} ${dy})`)
        .selectAll('path')
        .data(cmnes.features)
        .enter()
        .append('path')
        .attr('d', geoPath)
};


function clique_carte(){
    communes = d3.selectAll('path')
    communes.data(cmnes.features)
    communes.on("click", function(d) {
        var marqueur = d.target //créer un objet unique après chaque clic
        var props = marqueur.__data__ //variable contenant les les propriétés de la commune

        console.log(marqueur.__data__.properties.libgeo)

        // //Histogram in infobox communes
        // //Setup size etc of graph
        // var svg = d3.select("#infobox-communes")
        //     .append("svg")
        //     .attr("width", width + margin.left + margin.right)
        //     .attr("height", height + margin.top + margin.bottom)
        //     .append("g")
        //     .attr("transform",
        //         "translate(" + margin.left + "," + margin.top + ")");

        // function histo(){
        //     var x = d3.scaleOrdinal()
        //         .domain(candidat_to_hide)     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        //         .range([0, width_graph]);
        //     svg.append("g")
        //        .attr("transform", "translate(0," + height + ")")
        //        .call(d3.axisBottom(x));

        //     // set the parameters for the histogram
        //     var histogram = d3.histogram()
        //         .value(function(d) { return d.price; })   // I need to give the vector of value
        //         .domain(x.domain())  // then the domain of the graphic
        //         .thresholds(x.ticks(70)); // then the numbers of bins

        //     // And apply this function to data to get the bins
        //     var bins = histogram(data);

        //     // Y axis: scale and draw:
        //     var y = d3.scaleLinear()
        //         .range([height, 0]);
        //         y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        //     svg.append("g")
        //         .call(d3.axisLeft(y));

        //     // append the bar rectangles to the svg element
        //     svg.selectAll("rect")
        //         .data(bins)
        //         .enter()
        //         .append("rect")
        //         .attr("x", 1)
        //         .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        //         .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        //         .attr("height", function(d) { return height - y(d.length); })
        //         .style("fill", "#69b3a2")
        // }

    }
};


document.getElementById("MyBody").onload = function() {prepare_document()} //equivalent main()
 /*
Promise.all([
    d3.json('Data/communes-cantons-quant-topo.json'),
    d3.csv('Data/premier.csv', d3.autoType),
    d3.csv('Data/deuxieme.csv', d3.autoType),
]).then(function (result) {
        data = result[0]
        premier_tour = result[1]
        deuxieme_tour = result[2]

        const cmnes = topojson.feature(data, data.objects.communes)
        const cantons = topojson.feature(data, data.objects.departements)
        console.log(premier_tour)

        const geoPath = d3.geoPath()

        const scaleX = 430 / 1160000 
        const scaleY = 600 / 1070000

        var scale = Math.min(scaleX, scaleY)

        var xmin = 84334
        var ymin = 6046258
        var dx = -1 * scale * xmin
        var dy = scale * ymin + 600
        let votes_commune

        d3.select('#com')
        .attr('transform', 
            `matrix(${scale} 0 0 ${-1 * scale} ${dx} ${dy})`)
          .selectAll('path')
          .data(cmnes.features)
          .enter()
          .append('path')
          .attr('d', geoPath)
          .attr('fill', function(feature){
            try{
                votes_commune = premier_tour.find(el => el.CodeInsee == feature.properties.codgeo);
                let p = votes_commune["ARTHAUD" ]/ votes_commune.Votants
                const c = p * 255
                //var p = premier_tour.
                return `rgb(${c} 0 0)`                
            }catch (error){
                console.log(feature.properties)
                console.log(votes_commune)
                console.log(error)
            }

             

          /*.on('click', function(evt){
            const feature = evt.target._data_
            console.log('feature', feature)
          })*/

        /*d3.select('#ct')
        .attr('transform', 
            `matrix(${scale} 0 0 ${-1 * scale} ${dx} ${dy})`)
          .selectAll('path')
          .data(cantons.features)
          .enter()
          .append('path')
          .attr('d', geoPath)*/
