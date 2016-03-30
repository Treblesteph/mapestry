var width = 960,
    height = 1160;

var svg = d3.select("#map-container").append("svg")
                                     .attr("width", width)
                                     .attr("height", height);

var subunits = topojson.feature(africa, africa.objects.continenttest);



d3.json("africa.json", function(error, africa) {
  if (error) return console.error(error);

  svg.append("path")
     .datum(topojson.feature(africa, africa.objects.continenttest))
     .attr("d", d3.geo.path().projection(d3.geo.mercator()));
});
