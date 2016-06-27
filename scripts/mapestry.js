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

var northamericaprojection = d3.geo.conicConformal()
                                   .rotate([98, 2])
                                   .center([25, 12])
                                   .parallels([29.5, 45.5])
                                   .scale(350)
                                   .translate([width / 2, height / 2])
                                   .precision(.1)

var southamericaprojection = d3.geo.azimuthalEqualArea()
var europeprojection = d3.geo.conicConformal()
var africaprojection = d3.geo.azimuthalEqualArea()
                             .scale(350)
                             .translate([width / 5, height / 4])
var asiaprojection = d3.geo.conicConformal()
var oceaniaprojection = d3.geo.orthographic()
    // .scale(475)
    // .translate([width / 2, height / 2])
    // .clipAngle(90)
    // .precision(.1)

function showcontinent(continentname) {
  var filename = continentname + ".json"
  d3.json(filename, function(error, continent) {
    if (error) return console.error(error)

    var geofilename = "continent" + continentname
    var countries = topojson.feature(continent, continent.objects[geofilename])

    var projection = d3.geo.robinson()
                           .scale(150)
                           .translate([width / 2, height / 2])
                           .precision(.1)

    if (continentname === "northamerica") {
      projection = northamericaprojection
    } else if (continentname === "southamerica") {
      projection = southamericaprojection
    } else if (continentname === "europe") {
      projection = europeprojection
    } else if (continentname === "africa") {
      projection = africaprojection
    } else if (continentname === "asia") {
      projection = asiaprojection
    } else if (continentname === "oceania") {
      projection = oceaniaprojection
    }

    var path = d3.geo.path().projection(projection)

    console.log(svg.selectAll(".subunit")
           .data(topojson.feature(continent, continent.objects[geofilename]).features)
           .enter().append("path")
           .attr("class", function(d) { return continentname + " " + d.id; })
           .attr("d", path))
  })
}

showcontinent("northamerica")
