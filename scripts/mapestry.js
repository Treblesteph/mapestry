var viewerWidth = $(document).width()
var viewerHeight = $(document).height()

var width = viewerWidth / 2
var height = viewerHeight

var svg = d3.select("#map-container").append("div")
                                     .classed("svg-container", true)
                                     .append("svg")
                                     .attr("preserveAspectRatio", "xMinYMin meet")
                                     .attr("viewBox", "0 0 600 800")
                                     .classed("svg-content-responsive", true)

d3.json("africa.json", function(error, africa) {
  if (error) return console.error(error)

  var countries = topojson.feature(africa, africa.objects.continenttest)

  var projection = d3.geo.azimuthalEqualArea()
                         .scale(350)
                         .translate([width / 5, height / 4])

  var path = d3.geo.path().projection(projection)

  svg.append("path")
     .datum(countries)
     .attr("d", path)

console.log(svg.selectAll(".subunit")
     .data(topojson.feature(africa, africa.objects.continenttest).features)
     .enter().append("path")
     .attr("class", function(d) { return "africa " + d.id; })
     .attr("d", path))

})
