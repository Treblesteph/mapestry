var viewerWidth = $(document).width()
var viewerHeight = $(document).height()

var width = viewerWidth / 2
var height = viewerHeight

var svg = d3.select('#map-container').append('div')
                                     .classed('svg-container', true)
                                     .append('svg')
                                     .attr('preserveAspectRatio', 'xMinYMin meet')
                                     .attr('viewBox', '0 0 600 800')
                                     .classed('svg-content-responsive', true)

var northamericaprojection = d3.geo.conicConformal()
                                   .rotate([98, 2])
                                   .center([25, 12])
                                   .parallels([29.5, 45.5])
                                   .scale(350)
                                   .translate([width / 2, height / 2])
                                   .precision(.1)

var southamericaprojection = d3.geo.azimuthalEqualArea()
                                   .center([-25, -15])
                                   .scale(400)

var europeprojection = d3.geo.azimuthalEqualArea()
                             .center([34, 30])
                             .scale(590)
                             .translate([width / 2, height / 2])

var africaprojection = d3.geo.azimuthalEqualArea()
                             .scale(400)
                             .center([0, 5])
                             .translate([width / 5, height / 4])

var asiaprojection =  d3.geo.patterson()
                        	  .center([22,94])
                            .scale(210)
                            .translate([0,0])
                            .precision(.1);


var oceaniaprojection = d3.geo.conicConformal()
                              .rotate([-132, 0])
                              .center([86, -46])
                              .parallels([-18, -36])
                              .scale(356)
                              .translate([width / 2, height / 2])
                              .precision(0.1);

// Open continent map (and toggle clicked class) on click of continent button

document.getElementById('northamerica1').onclick = function() {
  showcontinent('northamerica')
  toggleclicked('northamerica1')
}

document.getElementById('northamerica2').onclick = function() {
  showcontinent('northamerica')
  toggleclicked('northamerica2')
}

document.getElementById('southamerica1').onclick = function() {
  showcontinent('southamerica')
  toggleclicked('southamerica1')
}

document.getElementById('southamerica2').onclick = function() {
  showcontinent('southamerica')
  toggleclicked('southamerica2')
}

document.getElementById('europe1').onclick = function() {
  showcontinent('europe')
  toggleclicked('europe1')
}

document.getElementById('europe2').onclick = function() {
  showcontinent('europe')
  toggleclicked('europe2')
}

document.getElementById('africa1').onclick = function() {
  showcontinent('africa')
  toggleclicked('africa1')
}

document.getElementById('africa2').onclick = function() {
  showcontinent('africa')
  toggleclicked('africa2')
}

document.getElementById('asia1').onclick = function() {
  showcontinent('asia')
  toggleclicked('asia1')
}

document.getElementById('asia2').onclick = function() {
  showcontinent('asia')
  toggleclicked('asia2')
}

document.getElementById('oceania1').onclick = function() {
  showcontinent('oceania')
  toggleclicked('oceania1')
}

document.getElementById('oceania2').onclick = function() {
  showcontinent('oceania')
  toggleclicked('oceania2')
}

function showcontinent(continentname) {
  svg.selectAll('*').remove()

  var filename = continentname + '.json'
  d3.json(filename, function(error, continent) {
    if (error) return console.error(error)

    var geofilename = 'continent' + continentname

    // Making a hash of country ISO and name string.
    var countries_data = topojson.feature(continent, continent.objects[geofilename])
    var countries = {}

    countries_data["features"].forEach(function(d) {
      var thisISO = d.id
      var thisname = d.properties.name
      countries[thisISO] = thisname
    })

    console.log(countries)

    var projection = d3.geo.robinson()
                           .scale(150)
                           .translate([width / 2, height / 2])
                           .precision(.1)

    if (continentname === 'northamerica') {
      projection = northamericaprojection
    } else if (continentname === 'southamerica') {
      projection = southamericaprojection
    } else if (continentname === 'europe') {
      projection = europeprojection
    } else if (continentname === 'africa') {
      projection = africaprojection
    } else if (continentname === 'asia') {
      projection = asiaprojection
    } else if (continentname === 'oceania') {
      projection = oceaniaprojection
    }

    var path = d3.geo.path().projection(projection)

    console.log(svg.selectAll('.subunit')
           .data(topojson.feature(continent, continent.objects[geofilename]).features)
           .enter().append('path')
           .attr('class', function(d) { return continentname + ' ' + d.id; })
           .attr('d', path))
  })
}

function toggleclicked(id) {

  // Getting rid of id number (for topnav/sidebar button) and adding id # selector
  var idselector1 = '#' + id.slice(0, -1) + '1'
  var idselector2 = '#' + id.slice(0, -1) + '2'

  // Remove clicked from other buttons
  $('.clicked').toggleClass('clicked')

  // Add clicked to this button (both topnav and sidebar) if they don't already have it on
  if (!($(idselector1).hasClass('clicked'))) {
    $(idselector1).toggleClass('clicked')
  }
  if (!($(idselector2).hasClass('clicked'))) {
    $(idselector2).toggleClass('clicked')
  }
}
