var M = {
    bbox: [485000, 75000, 834000, 296000],
    topojson: null,
    data: null,           // the data as array
    data_obj: {},         // the data table as dictionnary aka object for quick access
    data_series: null,    // contains the raw values to be mapped
}

function main(){
  M.svg = d3.select("svg.chloropleth");
  M.width = M.svg.attr('width');
  M.height = M.svg.attr('height');

  M.path = d3.geoPath();
  
  // Load the data
  Promise.all([
    d3.json('Data/communes.json'),
    d3.csv('Data/premier.csv', d3.autoType)
  ])
  .then(function(result){
    M.topojson = result[0];
    M.data = result[1];
    M.data_series = M.data.map(d => d.Votants)

    // Convert the data into an object. We will need to make the link from the
    // geometry to the statistical data. This is formally a join but can be 
    // done efficiently with the use of a dictionnary. We still need a loop
    // over all communes here.
    for (var i=0; i < M.data.length; i++){
      var commune_id = `${M.data[i].CodeInsee}`;
      M.data_obj[commune_id] = M.data[i];
    }

    drawMap();
  });

}


function drawMap(){

  // The TopoJSON contains raw coordinates in CRS CH1903/LV03.
  // As this is already a projected CRS, we can use an SVG transform
  // to fit the map into the SVG view frame.
  // In a first step, we compute the transform parameters.

  // Compute the scale of the transform
  var scaleX = M.width / (M.bbox[2] - M.bbox[0]),
      scaleY = M.height / (M.bbox[3] - M.bbox[1]);
  var scale = Math.min(scaleX, scaleY);

  var dx = -1 * scale * M.bbox[0];
  var dy = scale * M.bbox[1] + parseFloat(M.height);

  M.map = M.svg.append('g')
    .attr('class', 'map')
    .attr(
      'transform', 
      'matrix('+scale+' 0 0 -'+scale+' '+dx+' '+dy+')'
    );

  // Compute the class limits using Jenks.
  // We use Classybrew to do this.
  M.brew = new classyBrew();
  M.brew.setSeries(M.data_series);
  M.brew.setNumClasses(6);
  M.brew.setColorCode('PuBu');
  M.breaks = M.brew.classify('jenks');

  M.color = d3.scaleThreshold()
    .domain(M.breaks.slice(1,6))
    .range(M.brew.getColors());

  // Communes are drawn first
  M.map
    .append('g').attr('class', 'communes')
    .selectAll('path')
    .data(topojson.feature(M.topojson, M.topojson.objects.communes).features)
    .enter()
    .append('path')
    .attr('fill', function(d){
      // This is a bit tricky here because we get the commune and not the data
      // to be mapped.
      var commune_id = `${d.properties.codgeo}`
      var statdata = M.data_obj[commune_id]
      return statdata ? M.color(statdata.p_fem_singl_2034) : '#fff'
    })
    .attr('d', M.path);

  // Limits of the cantons
  // Due to our SVG transform above, stroke-width is in meters!
  M.map
    .append('g').attr('class', 'cantons')
    .selectAll('path')
    .data(topojson.feature(M.topojson, M.topojson.objects.cantons).features)
    .enter()
    .append('path')
    .attr('stroke', '#fff').attr('stroke-width', 200)
    .attr('fill', 'none').attr('d', M.path);

  // Lakes on top
  M.map
    .append('g').attr('class', 'lacs')
    .selectAll('path')
    .data(topojson.feature(M.topojson, M.topojson.objects.lacs).features)
    .enter().append('path')
    .attr('fill', '#777').attr('d', M.path);
}


main()


