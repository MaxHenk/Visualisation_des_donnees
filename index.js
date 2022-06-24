//définition des variables

let data;
let premier_tour;
let deuxieme_tour;
let cmnes; // supprimer
let chargement;
let d = 255


const scaleX = document.getElementById('chloropleth').clientWidth/1200000;
const scaleY = document.getElementById('chloropleth').clientHeight/1070000;


//Size of bar plot
let margin_graph = {top: 10, right: 30, bottom: 30, left: 40};
let width_graph = 330 - margin_graph.left - margin_graph.right;
let height_graph = 360 - margin_graph.top - margin_graph.bottom;


//fonction pour mettre le bouton en gras qui ne fonctionne pas 
function changeStyle(value){
    let element = document.getElementById(value);
    element.style.fontWeight = "700";
}

let scale = Math.min(scaleX, scaleY);

let xmin = 84334; 
let ymin = 6046258; 
let dx = -1 * scale * xmin;
let dy = scale * ymin + document.getElementById('chloropleth').clientHeight;

const geoPath = d3.geoPath();

//initialisation des varibales pour l'interactivité
const candidat_to_hide = ["arthaud", "roussel","lasalle","zemmour","melenchon","hidalgo","jadot","pecresse","poutou","dupontaignan"]

let display_tour = 1
let display_cand = "macron"

// function found on stackoverflo
function capitalizeFirstLetter(str) {

    // converting first letter to uppercase
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

    return capitalized;
}

//fonctions appelées par les boutons
//pour l'interactivité du tour
function set_tour(value){
    display_tour = value
    let elem

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

//pour l'interactivité du choix du candidat
function set_cand (value){
    display_cand = value
    update_carte_tour()
}

//cette fonction part du principe que tous les datasets sont complets
function update_carte_tour(){
    document.getElementById("progress").innerHTML = `Chargement en cours...`

    let counter = 0

    //Représentation en d3 de la carte 
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
                    return `rgb(${d} ${c} ${c} )`   
                }
                return `rgb(255 ${c} ${c} )`    
            }catch (error){
                // do nothing
            }
        })
    //intéraction pour se représenter le chargement des informations
    document.getElementById("progress").innerHTML = `Chargement terminé`
    console.log("candidat:", display_cand, "   tour:", display_tour)
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


        //transformation en topojson
        cmnes = topojson.feature(data, data.objects.communes)

        dessine_carte()
        update_carte_tour()
        clique_carte()
    })
    
}

//Initialisation de la carte de base
function dessine_carte(){
    
    d3.select('#com')
        .attr('transform', 
            `matrix(${scale} 0 0 ${-1 * scale} ${dx} ${dy})`)
        .selectAll('path')
        .data(cmnes.features)
        .enter()
        .append('path')
        .attr('d', geoPath)

}

   
function clique_carte(){
    communes = d3.selectAll('path')
    communes.data(cmnes.features)
    communes.on("click", function(d) {
        d3.select('#Name_commune').remove();

        d3.select('#barplot').remove();
        if (display_tour == 1){
            liste_candidat = ["arthaud","roussel","macron","lassale","lepen","zemmour","melenchon","hidalgo","jadot","pecresse","poutou","dupontaignan"]
        } else {
            liste_candidat = ["macron", "lepen"]
        }
        let marqueur = d.target //créer un objet unique après chaque clic
        let props = marqueur.__data__ //variable contenant les les propriétés de la commune
        let prop_commune;
        if (display_tour == 1){
            prop_commune = premier_tour.find(el => el.CodeInsee == props.properties.codgeo)
        } else {
            prop_commune = deuxieme_tour.find(el => el.CodeInsee == props.properties.codgeo)
        } //lien entre json et csv
        let results_com = []
        for(let i = 0; i < liste_candidat.length; i++) {
            results_com.push(prop_commune[liste_candidat[i]])
        }
    
        //Variables du graphique infobox-communes
        
        

        //Top element of the bar plot
        let svg = d3.select("#infobox-communes")
                    .append("svg")
                    .attr("width", width_graph + margin_graph.left + margin_graph.right)
                    .attr("height", height_graph + margin_graph.top + margin_graph.bottom)
                    .attr("id", "barplot")
                    .append("g")
                    .attr("transform",
                        "translate(" + margin_graph.left + "," + margin_graph.top + ")");

        //X scale 
        let x = d3.scalePoint()
                .domain(liste_candidat)
                .range([0, width_graph])
                .padding(0.4);
        //Y scale 
        let y = d3
           .scaleLinear()
           .range([height_graph, 0])
           .domain([0, d3.max(results_com)])
           


        // Création des rectangles
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

        // ajouter axe X
        svg.append("g")
           .attr("transform", "translate(0," + height_graph + ")")
           .call(d3.axisBottom(x))
           .selectAll("text")
           .attr("transform", "translate(-10,0)rotate(-45)")
           .style("text-anchor", "end");
        // ajouter axe Y
        svg.append("g")
           .call(d3.axisLeft(y))
           .attr("id", "Yaxis");
        
        // ajouter titre 
        svg.append("text")
           .attr("x", width_graph/2)
           .attr("y", 0-(margin_graph.top/2))
           .attr("text-anchor", "left")
           .style("font-size", "16px")
           .style("text-decoration", "underline")
           .text(marqueur.__data__.properties.libgeo)


        svg
           .selectAll("rect")
           .data(results_com)
           .transition()
           .duration(100)
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

        svg
            .selectAll("rect")
            .data(results_com)
            .exit()
            .transition()
            .duration(100)
            .remove();

    })
}


prepare_document() //equivalent main()