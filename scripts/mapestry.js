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

document.getElementById('northamerica').onclick = function() {
  showcontinent('northamerica')
  toggleclicked('northamerica')
}

document.getElementById('southamerica').onclick = function() {
  showcontinent('southamerica')
  toggleclicked('southamerica')
}

document.getElementById('europe').onclick = function() {
  showcontinent('europe')
  toggleclicked('europe')
}

document.getElementById('africa').onclick = function() {
  showcontinent('africa')
  toggleclicked('africa')
}

document.getElementById('asia').onclick = function() {
  showcontinent('asia')
  toggleclicked('asia')
}

document.getElementById('oceania').onclick = function() {
  showcontinent('oceania')
  toggleclicked('oceania')
}

function showcontinent(continentname) {
  svg.selectAll('*').remove()

  var filename = continentname + '.json'
  d3.json(filename, function(error, continent) {
    if (error) return console.error(error)

    var geofilename = 'continent' + continentname
    var countries = topojson.feature(continent, continent.objects[geofilename])

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
  var idselector = '#' + id

  // Remove clicked from other buttons
  $('.clicked').toggleClass('clicked')

  // Add clicked to this button if it doesn't already have it on
  if (!($(idselector).hasClass('clicked'))) {
    $(idselector).toggleClass('clicked')
  }
}
