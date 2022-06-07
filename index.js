
  Promise.all([
  d3.json('Data/communes-cantons-quant-topo.json'),
  d3.csv('Data/premier.csv', d3.autoType)
]).then(function (result) {
        const data = result[0]
        const csv = result[1]
        console.log(data, csv)
        console.log('data', data.objects)
        const cmnes = topojson.feature(data, data.objects.communes)
        const cantons = topojson.feature(data, data.objects.departements)

        const geoPath = d3.geoPath()

        const scaleX = 800 / 350000
        const scaleY = 600 / 220000

        var scale = Math.min(scaleX, scaleY)

        var xmin = 485000
        var ymin = 75000
        var dx = -1 * scale * xmin
        var dy = scale * ymin + 600

        d3.select('#cmnes')
        .attr('transform', 
            `matrix(${scale} 0 0 ${-1 * scale} ${dx} ${dy})`)
          .selectAll('path')
          .data(cmnes.features)
          .enter()
          .append('path')
          .attr('d', geoPath)
          .attr('fill', function(feature){
            const c = feature.properties.dep * 9
            return `rgb(${c} 0 0)`
          })
          .attr('stroke', '#fff')
          .attr('stroke-width', 300)
          .on('click', function(evt){
            const feature = evt.target._data_
            console.log('feature', feature)
          })

        d3.select('#ct')
        .attr('transform', 
            `matrix(${scale} 0 0 ${-1 * scale} ${dx} ${dy})`)
          .selectAll('path')
          .data(cantons.features)
          .enter()
          .append('path')
          .attr('d', geoPath)
          .attr('fill', 'grey')
  })




