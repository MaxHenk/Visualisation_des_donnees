

//définition des variables

var data;
var premier_tour;
var deuxieme_tour;
var cmnes; 
var cantons; // TODO: appeler départements

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
function prepare_document(){
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
    .on('click', function(){
        console.log("cmnes", cmnes.features.libgeo)
    })
};

document.getElementById("MyBody").onload = function() {prepare_document()}
console.log("com", cmnes)
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
