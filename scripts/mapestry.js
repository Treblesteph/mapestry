var viewerWidth = $(document).width()
var viewerHeight = $(document).height()

var width = viewerWidth / 2
var height = viewerHeight

var sec = 0

var selected_continent = 'none'
var selected_game = 'none'
var selected_difficulty = 'easy'

var timer = null

function startPauseTimer(continent, game) {
  // function that updates the timer with elapsed seconds
  // accounting for any pause time
  var timerFn = function () {
    if (!timer || !timer.started) return
    var now = new Date().getTime()
    var elapsed = (now - timer.started) / 1000 + timer.lastpause
    $('#seconds-' + game).html('' + Math.floor(elapsed, 0))
  }

  // If the button is showing a play symbol:
  if ($('#go-' + game).html() === 'play_arrow') {
    if (!timer || timer.game !== game) {
      // create the timer and start it
      timer = {
        state: 'running',
        started: new Date().getTime(),
        lastpause: 0,
        interval: window.setInterval(timerFn, 200),
        game: game
      }
    } else if (timer.state === 'paused') {
      // the timer paused - restart it
      timer.interval = window.setInterval(timerFn, 200)
      timer.state = 'running'
      timer.started = new Date().getTime()
    }
    $('#go-' + game).html('pause')
  } else {
    // pause the timer

    // stop the interval loop
    window.clearInterval(timer.interval)

    // save the pause time
    var now = new Date().getTime()
    var elapsed = (now - timer.started) / 1000 + timer.lastpause
    timer.lastpause = elapsed

    timer.state = 'paused'
    $('#go-' + game).html('play_arrow')
  }
}

var svg = d3.select('#map-container').append('div')
                                     .classed('svg-container', true)
                                     .append('svg')
                                     .attr('preserveAspectRatio', 'xMinYMin meet')
                                     .attr('viewBox', '0 0 600 800')
                                     .classed('svg-content-responsive', true)

var northamericaprojection = d3.geo.conicConformal()
                                   .rotate([98, 2])
                                   .center([37, 53])
                                   .parallels([29.5, 45.5])
                                   .scale(370)
                                   .precision(.1)

var southamericaprojection = d3.geo.azimuthalEqualArea()
                                   .center([-25, -15])
                                   .scale(400)

var europeprojection = d3.geo.azimuthalEqualArea()
                             .center([47, 55])
                             .scale(640)

var africaprojection = d3.geo.azimuthalEqualArea()
                             .scale(440)
                             .center([37, 5])

var asiaprojection =  d3.geo.patterson()
                        	  .center([22,94])
                            .scale(210)
                            .translate([0,0])
                            .precision(.1)


var oceaniaprojection = d3.geo.conicConformal()
                              .rotate([-132, 0])
                              .center([60, -10])
                              .parallels([-18, -36])
                              .scale(356)
                              .precision(0.1)

var currentMap = 'world'

// Open continent map (and toggle clicked class) on click of continent button
var continents_list = ['northamerica', 'southamerica', 'europe', 'africa', 'asia', 'oceania']

continents_list.forEach(function(c) {
  var continent1 = c + '1'
  var continent2 = c + '2'
  document.getElementById(continent1).onclick = function() {
    selected_continent = c
    showInGameOptions(c, selected_game, selected_difficulty)
    showcontinent(c)
    toggleclicked(continent1)
  }
  document.getElementById(continent2).onclick = function() {
    selected_continent = c
    showInGameOptions(c, selected_game, selected_difficulty)
    showcontinent(c)
    toggleclicked(continent2)
  }
})

var games_list = ['country', 'capital', 'flag', 'leader', 'dialing', 'currency', 'language', 'timezone', 'demonym', 'area']

games_list.forEach(function(g) {
  var gameid = g + '-game'
  document.getElementById(gameid).onclick = function() {
    selected_game = g
    showInGameOptions(selected_continent, g, selected_difficulty)
  }
})

var game_descriptions = {
  'none': {
    'easy': '',
    'medium': '',
    'hard': ''
  },
  'country': {
    'easy': 'Easy: Which of the countries shown below is highlighted on the map to the left?',
    'medium': 'Medium: On the map to the left, click on:',
    'hard': 'Hard: What is the name of the country highlighted on the map?'
  },
  'capital': {
    'easy': 'Easy: From the options on the map to the left, select the country with the capital city:',
    'medium': 'Medium: Which of the capital cities shown below is in the country shown on the map?',
    'hard': 'Hard: What is the name of the capital city of the country shown on the map?'
  },
  'flag': {
    'easy': 'Easy: From the four options on the map to the left, select the country which has the flag shown below',
    'medium': 'Medium: Select the flag from the four options below that belongs to the country shown on the map',
    'hard': 'Hard: Select the flag from the 20 options below that belongs to the country shown on the map'
  },
  'leader': {
    'easy': 'Easy: Which of the following leaders are present in the country shown on the map to the left?',
    'medium': 'Medium: From the options on the map to the left, select the country with the leader:',
    'hard': 'Hard: Who is the leader of the country shown on the map?'
  },
  'dialing': {
    'easy': 'Easy: From the options on the map to the left, select the country with the dialing code:',
    'medium': 'Medium: Which of the dialing codes shown below is for the country shown on the map?',
    'hard': 'Hard: What is the dialing code of the country shown on the map?'
  },
  'currency': {
    'easy': 'Easy: From the options on the map to the left, select the country with the currency:',
    'medium': 'Medium: Which of the currencies shown below is for the country shown on the map?',
    'hard': 'Hard: What is the currency of the country shown on the map?'
  },
  'language': {
    'easy': 'Easy: Which of the Languages shown below is spoken in the country shown on the map?',
    'medium': 'Medium: Name a national Language of the country shown on the map',
    'hard': 'Hard: Name all of the national Languages of the country shown on the map'
  },
  'timezone': {
    'easy': 'Easy: Which of the timezones shown below is for the country shown on the map?',
    'medium': 'Medium: Which of the timezones shown below is for the country shown on the map?',
    'hard': 'Hard: What is the timezone(s) for the country shown on the map?'
  },
  'demonym': {
    'easy': 'Easy: From the options on the map to the left, select the country with the demonym:',
    'medium': 'Medium: Which of the demonyms shown below is for the country shown on the map?',
    'hard': 'Hard: What is the name of the demonym of the country shown on the map?'
  },
  'area': {
    'easy': 'Easy: Which of the areas (in square KM) shown below is for the country shown on the map?',
    'medium': 'Medium: Which of the areas (in square KM) shown below is for the country shown on the map?',
    'hard': 'Hard: What is the area of the country shown on the map?'
  }
}

var difficulty_levels = ['easy', 'medium', 'hard']

// Toggle difficulty and time mode button actions:

document.getElementById('toggle-difficulty').onclick = function() {
  changeDifficultyMode(selected_difficulty, selected_game, selected_continent)
}

function changeDifficultyMode(difficulty, game, continent) {
  // Set new difficulty level
  var curr_diff_index = difficulty_levels.findIndex(function(level) { return level === selected_difficulty })
  selected_difficulty = difficulty_levels[(1 + curr_diff_index) % 3]
  // Chnage button icon
  $('#toggle-difficulty').html('<img id="difficulty-icon" src="assets/icons/games/' + selected_difficulty + '.png">')
  // Change game text
  if ((selected_game !== 'none') && (selected_continent !== 'none')) {
    var description_selector = $('#' + game + ' .game-play > p')
    var this_game = game_descriptions[game]
    var description = this_game[selected_difficulty]
    description_selector.html(description)
  }
}

function showInGameOptions(continent, game, difficulty) {
  var gameplay = $('#' + game + ' .game-play')
  if (continent === 'none' || game === 'none') {
    if (gameplay) gameplay.html('<p class="flow-text"> Choose a continent from the buttons above to start playing!</p>')
  } else {
    var this_game = game_descriptions[game]
    var description = this_game[difficulty]
    var htmlcontent = '<p class="flow-text">' + description + '</p>' +
                      '<div class="in-game-options ' + continent + ' valign-wrapper">' +
                        '<a id="play-pause-' + game + '" class="valign btn-floating btn-large waves-effect waves-light">' +
                          '<i id="go-' + game + '" class="material-icons">play_arrow</i>' +
                        '</a>' +
                        '<span id="seconds-' + game + '" class="=valign thin">00</span>' +
                        '<a href="#" class="valign skip-this-item tooltipped" data-position="top" data-delay="50" data-tooltip="skip this question">SKIP</a>' +
                        '<a href="#" class="valign quit-this-game tooltipped" data-position="top" data-delay="50" data-tooltip="quit this game">' +
                          '<i class="material-icons">clear</i>' +
                        '</a>' +
                      '</div>'
    $('.in-game-options btn-floating').remove()
    gameplay.html(htmlcontent)

    var this_id = 'play-pause-' + game
    var btn = document.getElementById(this_id)
    btn.onclick = function () {
      startPauseTimer(selected_continent, game)
    }
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

    // Merging paths for countries with multiple paths.
    var multi_paths = {
      'northamerica': {'oldISOs': [d3.set(['USB', 'USK']), d3.set(['ACA', 'ACB']), d3.set(['TTD', 'TTG'])],
                       'newISOs': ['USA', 'ATG', 'TTO']},
      'southamerica': {'oldISOs': [d3.set(['ECG', 'ECD'])],
                       'newISOs': ['ECU']},
      'europe': {'oldISOs': [d3.set(['ALD', 'FIN']), d3.set(['BCR', 'BFR', 'BWR']), d3.set(['BHB', 'BIS', 'BHF']),
                             d3.set(['DNB', 'FRO', 'DNK']),
                             d3.set(['ENG', 'GGA', 'GGG', 'GGH', 'GGS', 'IMN', 'JEY', 'NIR', 'SCT', 'WLS']),
                             d3.set(['ESI', 'ESX']), d3.set(['FXC', 'FXX']),
                             d3.set(['ITD', 'ITI', 'ITP', 'ITY', 'ITX']), d3.set(['NJM', 'NSV', 'NOW']),
                             d3.set(['RUK', 'RUE']), d3.set(['SRV', 'SRS'])],
                 'newISOs': ['FIL', 'BEL', 'BOS', 'DEN', 'GBR', 'ESP', 'FRA', 'ITA', 'NOR', 'RUS', 'SER']},
      'africa': {'oldISOs': [d3.set(['GNA', 'GNK', 'GNR']), d3.set(['SOL', 'SOP', 'SOX']),
                             d3.set(['TZZ', 'TZA']), d3.set(['STS', 'STP'])],
                 'newISOs': ['GNQ', 'SOM', 'TAN', 'STP']},
      'asia': {'oldISOs': [d3.set(['CHH', 'HKG', 'MAC', 'PFA', 'CHI']), d3.set(['GAZ', 'WEB']),
                           d3.set(['GEA', 'GEG']), d3.set(['IRK', 'IRR']),
                           d3.set(['JPB', 'JPH', 'JPI', 'JPK', 'JPO', 'JPS', 'JPV', 'JPY', 'JPX']),
                           d3.set(['KAB', 'KAZ']), d3.set(['KAS', 'INX']),
                           d3.set(['KOB', 'KOJ', 'KOU', 'KNX', 'KXI', 'KOX']), d3.set(['KNZ', 'PRK']),
                           d3.set(['PGA', 'PHL']), d3.set(['TLP', 'TLX']), d3.set(['YES', 'YEM'])],
               'newISOs': ['CHN', 'PSE', 'GEO', 'IRQ', 'JAP', 'KZS', 'IND', 'KOR', 'NKO', 'PHI', 'TIM', 'YMN']},
      'oceania': {'oldISOs': [],
                  'newISOs': []},
    }

    var counter = 0
    var this_continent = multi_paths[continentname]
    var selected = this_continent['oldISOs']
    var newISOs = this_continent['newISOs']

    selected.forEach(function (codes) {
      var access_thiscontinent = continent.objects[geofilename]
      svg.append('path')
         .datum(topojson.merge(continent, access_thiscontinent.geometries.filter(function(d) {
           return codes.has(d.id)
         })))
         .attr('class', 'country ' + continentname + ' ' + newISOs[counter])
         .attr('d', path)
         counter += 1
    })
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
