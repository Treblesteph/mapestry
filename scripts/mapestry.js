var width = 960
var height = 1160

var svg = d3.select("#map-container").append("svg")
                                     .attr("width", width)
                                     .attr("height", height)

d3.json("africa.json", function(error, africa) {
  if (error) return console.error(error)

  var countries = topojson.feature(africa, africa.objects.continenttest)

  var projection = d3.geo.azimuthalEqualArea()
                         .scale(500)
                         .translate([width / 2, height / 2])

  var path = d3.geo.path().projection(projection)

  svg.append("path")
     .datum(countries)
     .attr("d", path)

svg.selectAll(".subunit")
     .data(topojson.feature(africa, africa.objects.continenttest).features)
     .enter().append("path")
     .attr("class", function(d) { return "subunit " + d.id; })
     .attr("d", path)

})
