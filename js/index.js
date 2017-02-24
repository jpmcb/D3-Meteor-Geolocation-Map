var meteorData;

d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json', function(error,data) {
    if(error) throw error;  
    meteorData = data;

  d3.json('https://d3js.org/world-50m.v1.json', function(error,data) {
    if(error) throw error;
    
    var w = (window.innerWidth * 0.95); 
    var h = 800;
    
    var r = d3.scaleSqrt()
              .domain([d3.min(meteorData.features, function(d) { return Number(d.properties.mass); }), 
                       d3.max(meteorData.features, function(d) { return Number(d.properties.mass); })])
              .range([1, 25]);

    var zoom = d3.zoom().on('zoom', zoomed);  
    
    var toolTip = d3.select('body')
                    .append('div')
                    .attr('class', 'toolTip')
                    .style('opacity', '0')
                    .style('position', 'absolute');

    var svg = d3.select('.root')
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .call(zoom);
    
    var mapProjection = d3.geoMercator()
                          .translate([820,500])
                          .scale(260);
    
    var mapPath = d3.geoPath()
                    .projection(mapProjection);
    
    var map = svg.append('g')
      .selectAll('path')
        .data(topojson.feature(data, data.objects.countries).features)
        .enter().append('path')
          .attr('fill', '#fff')
          .attr('stroke', '#ccc')
          .attr('d', mapPath);
      
    var meteor = svg.append('g')
      .selectAll('circle')
        .data(meteorData.features)
        .enter().append('circle')
          .attr('cx', function(d,i) { return mapProjection([d.properties.reclong, d.properties.reclat])[0]; })
          .attr('cy', function(d,i) { return mapProjection([d.properties.reclong, d.properties.reclat])[1]; })
          .attr('r', function(d,i) { return r(Number(d.properties.mass)); })
          .on('mouseover', function(d) {
            console.log(d);
            toolTip.style('opacity', '0.8')
              .style('left', (d3.event.pageX + 15) + 'px')
              .style('top', (d3.event.pageY + 15) + 'px')
              .html('<h3>' + d.properties.name + '</h3>' +
                    '<p><b>Mass of Meteor:</b> ' + d.properties.mass + ' grams<br>' +
                    '<b>Year:</b> ' + new Date(d.properties.year).getFullYear() + '</p>')
          }).on('mouseout', function() {
            toolTip.style('opacity', '0');
          });
    
    var mapText = svg.append('text')
      .text('Hover a meteor impact site to see details')
      .attr('x', 100)
      .attr('y', 500)
    
    var mapText2 = svg.append('text')
      .text('Zoom in to get a closer look')
      .attr('x', 100)
      .attr('y', 520);
    
    var mapText3 = svg.append('text')
      .text('Click and drag to get a different vantage')
      .attr('x', 100)
      .attr('y', 540);
    
    function zoomed() {
      map.attr('transform', d3.event.transform);
      meteor.attr('transform', d3.event.transform);
      mapText.attr('transform', d3.event.transform);
      mapText2.attr('transform', d3.event.transform);
      mapText3.attr('transform', d3.event.transform);
    }
    
    })
})