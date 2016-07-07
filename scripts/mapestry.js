var viewerWidth = $(document).width()
var viewerHeight = $(document).height()

var width = viewerWidth / 2
var height = viewerHeight

var sec = 0

$('.game-play').html('<p class="flow-text"> Choose a continent from the buttons above to start playing!</p>')

//This needs to be in a function because the play-pause id does not exist to begin with.
function initialiseTimer() {
  //Only show if there is an active (open) game.
  if (($('#game-play li.active')).length !== 0) {
    document.getElementById('play-pause').onclick = startPauseTimer

    var timer = null

    function startPauseTimer() {
      // function that updates the timer with elapsed seconds
      // accounting for any pause time
      var timerFn = function () {
        if (!timer || !timer.started) return
        var now = new Date().getTime()
        var elapsed = (now - timer.started) / 1000 + timer.lastpause
        $('#seconds').html('' + Math.floor(elapsed, 0))
      }

      // If the button is showing a play symbol:
      if ($('#play-pause > i').html() === 'play_arrow') {
        if (!timer) {
          // create the timer and start it
          timer = {
            state: 'running',
            started: new Date().getTime(),
            lastpause: 0,
            interval: window.setInterval(timerFn, 200)
          }
        } else if (timer.state === 'paused') {
          // the timer paused - restart it
          timer.interval = window.setInterval(timerFn, 200)
          timer.state = 'running'
          timer.started = new Date().getTime()
        }
        $('#play-pause > i').html('pause')
      } else {
        // pause the timer

        // stop the interval loop
        window.clearInterval(timer.interval)

        // save the pause time
        var now = new Date().getTime()
        var elapsed = (now - timer.started) / 1000 + timer.lastpause
        timer.lastpause = elapsed

        timer.state = 'paused'
        $('#play-pause > i').html('play_arrow')
      }
    }
  }
}

// Toggle difficulty and time mode button actions:

document.getElementById('toggle-difficulty').onclick = function() {
  var currentdifficulty = toggleDifficultyButton()
  changeDifficultyMode(currentdifficulty)
}

function toggleDifficultyButton() {
  if ($('#toggle-difficulty').hasClass('easy')) {
    $('#toggle-difficulty').removeClass('easy')
    $('#toggle-difficulty').addClass('medium')
    $('#easy-icon').addClass('inactive')
    $('#medium-icon').removeClass('inactive')
    return 'medium'
  } else if ($('#toggle-difficulty').hasClass('medium')) {
    $('#toggle-difficulty').removeClass('medium')
    $('#toggle-difficulty').addClass('hard')
    $('#medium-icon').addClass('inactive')
    $('#hard-icon').removeClass('inactive')
    return 'hard'
  }  else if ($('#toggle-difficulty').hasClass('hard')) {
    $('#toggle-difficulty').removeClass('hard')
    $('#toggle-difficulty').addClass('easy')
    $('#hard-icon').addClass('inactive')
    $('#easy-icon').removeClass('inactive')
    return 'easy'
  }
}

function changeDifficultyMode(difficulty) {

  $('.easy.flow-text').addClass('inactive')
  $('.medium.flow-text').addClass('inactive')
  $('.hard.flow-text').addClass('inactive')
  $('.' + difficulty + '.flow-text').removeClass('inactive')
}

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

var currentMap = 'world'

// Open continent map (and toggle clicked class) on click of continent button

document.getElementById('northamerica1').onclick = function() {
  showInGameOptions('northamerica')
  showcontinent('northamerica')
  toggleclicked('northamerica1')
}

document.getElementById('northamerica2').onclick = function() {
  showInGameOptions('northamerica')
  showcontinent('northamerica')
  toggleclicked('northamerica2')
}

document.getElementById('southamerica1').onclick = function() {
  showInGameOptions('southamerica')
  showcontinent('southamerica')
  toggleclicked('southamerica1')
}

document.getElementById('southamerica2').onclick = function() {
  showInGameOptions('southamerica')
  showcontinent('southamerica')
  toggleclicked('southamerica2')
}

document.getElementById('europe1').onclick = function() {
  showInGameOptions('europe')
  showcontinent('europe')
  toggleclicked('europe1')
}

document.getElementById('europe2').onclick = function() {
  showInGameOptions('europe')
  showcontinent('europe')
  toggleclicked('europe2')
}

document.getElementById('africa1').onclick = function() {
  showInGameOptions('africa')
  showcontinent('africa')
  toggleclicked('africa1')
}

document.getElementById('africa2').onclick = function() {
  showInGameOptions('africa')
  showcontinent('africa')
  toggleclicked('africa2')
}

document.getElementById('asia1').onclick = function() {
  showInGameOptions('asia')
  showcontinent('asia')
  toggleclicked('asia1')
}

document.getElementById('asia2').onclick = function() {
  showInGameOptions('asia')
  showcontinent('asia')
  toggleclicked('asia2')
}

document.getElementById('oceania1').onclick = function() {
  showInGameOptions('oceania')
  showcontinent('oceania')
  toggleclicked('oceania1')
}

document.getElementById('oceania2').onclick = function() {
  showInGameOptions('oceania')
  showcontinent('oceania')
  toggleclicked('oceania2')
}

var game_descriptions = {
  'country': {
    'easy': 'Which of the countries shown below is highlighted on the map to the left?',
    'medium': 'On the map to the left, click on:',
    'hard': 'What is the name of the country highlighted on the map?'
  },
  'capital': {
    'easy': 'From the options on the map to the left, select the country with the capital city:',
    'medium': 'Which of the capital cities shown below is in the country shown on the map?',
    'hard': 'What is the name of the capital city of the country shown on the map?'
  },
  'flag': {
    'easy': 'From the four options on the map to the left, select the country which has the flag shown below',
    'medium': 'Select the flag from the four options below that belongs to the country shown on the map',
    'hard': 'Select the flag from the 20 options below that belongs to the country shown on the map'
  },
  'leader': {
    'easy': 'Which of the following leaders are present in the country shown on the map to the left?',
    'medium': 'From the options on the map to the left, select the country with the leader:',
    'hard': 'Who is the leader of the country shown on the map?'
  },
  'dialing': {
    'easy': 'From the options on the map to the left, select the country with the dialing code:',
    'medium': 'Which of the dialing codes shown below is for the country shown on the map?',
    'hard': 'What is the dialing code of the country shown on the map?'
  },
  'currency': {
    'easy': 'From the options on the map to the left, select the country with the currency:',
    'medium': 'Which of the currencies shown below is for the country shown on the map?',
    'hard': 'What is the currency of the country shown on the map?'
  },
  'language': {
    'easy': 'Which of the Languages shown below is spoken in the country shown on the map?',
    'medium': 'Name a national Language of the country shown on the map',
    'hard': 'Name all of the national Languages of the country shown on the map'
  },
  'timezone': {
    'easy': 'Which of the timezones shown below is for the country shown on the map?',
    'medium': 'Which of the timezones shown below is for the country shown on the map?',
    'hard': 'What is the timezone(s) for the country shown on the map?'
  },
  'demonym': {
    'easy': 'From the options on the map to the left, select the country with the demonym:',
    'medium': 'Which of the demonyms shown below is for the country shown on the map?',
    'hard': 'What is the name of the demonym of the country shown on the map?'
  },
  'area': {
    'easy': 'Which of the areas (in square KM) shown below is for the country shown on the map?',
    'medium': 'Which of the areas (in square KM) shown below is for the country shown on the map?',
    'hard': 'What is the area of the country shown on the map?'
  }
}

function showInGameOptions(continent) {
  //Only show if there is an active (open) game.
  if (($('#game-play li.active')).length !== 0) {
    var game_id = $('#game-play li.active').attr('id')
    var difficulty = $('#difficulty-level').attr('class')
    var this_game = game_descriptions[game_id]
    console.log(difficulty);
    var htmlcontent = '<p class="flow-text">' + this_game[difficulty] + '</p>' +
                      '<div class="in-game-options' + continent + 'valign-wrapper">' +
                        '<a id="play-pause" class="play valign btn-floating btn-large waves-effect waves-light">' +
                          '<i class="material-icons">play_arrow</i>' +
                        '</a>' +
                        '<span class="valign thin" id="seconds">00</span>' +
                        '<a href="#" class="valign skip-this-item tooltipped" data-position="top" data-delay="50" data-tooltip="skip this question">SKIP</a>' +
                        '<a href="#" class="valign quit-this-game tooltipped" data-position="top" data-delay="50" data-tooltip="quit this game">' +
                          '<i class="material-icons">clear</i>' +
                        '</a>' +
                      '</div>'

    $('#' + game_id + ' .game-play').html(htmlcontent)
    initialiseTimer()
  }
}

function showcontinent(continentname) {
  currentMap = continentname
  svg.selectAll('*').remove()

  var filename = continentname + '.json'
  d3.json(filename, function(error, continent) {
    if (error) return console.error(error)

    var geofilename = 'continent' + continentname

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

    svg.selectAll('.subunit')
       .data(topojson.feature(continent, continent.objects[geofilename]).features)
       .enter().append('path')
       .attr('class', function(d) { return 'country ' + continentname + ' ' + d.id; })
       .attr('d', path)
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
