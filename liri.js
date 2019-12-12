require("dotenv").config();
// import keys.js file
var keys = require("./keys");

// inquirer
var inquirer = require('inquirer');

// moment
var moment = require("moment");

// fs
var fs = require("fs");

// axios
var axios = require('axios');

// access spotify keys
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

inquirer.prompt([
  {
    type: 'input',
    message: 'Enter a Liri command: concert this, spotify this song, movie this, or do what it says',
    name: 'command'
  }

]).then(answers => {
  console.log(answers.command);
  if (answers.command === 'spotify this song') {
    inquirer.prompt([
      {
        type: 'input',
        message: 'Enter a song title',
        name: 'userInput'
      }
    ]).then(answer => {
      spotifyFunction(answer.userInput)
    })
  } else if (answers.command === 'concert this') {
    inquirer.prompt([
      {
        type: 'input',
        message: 'Enter a band name',
        name: 'userInput'
      }
    ]).then(answer => {
      bandsInTownFunction(answer.userInput)
    });
  } else if (answers.command === 'movie this') {
    inquirer.prompt([
      {
        type: 'input',
        message: 'Enter a movie name',
        name: 'userInput'
      }
    ]).then(answer => {
      movieThisFunction(answer.userInput)
    });
  } else if (answers.command === 'do what it says') {
    doWhatItSaysFunction()
  } else {
    console.log('Pick an option')
  }

});

function spotifyFunction(answerVar) {
  appendLog(answerVar);
  // console.log('Hello', answerVar);
  if (answerVar.userInput === '') {
    answerVar.userInput = "The Sign"
    console.log('answer.userInput', answerVar);
  }
  songToSearch = answerVar;
  console.log('Song To Search', songToSearch);
  spotify.search({
    type: 'track',
    query: songToSearch,
    limit: 10
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    0
    for (var i = 0; i < data.tracks.items.length; i++) {
      console.log("--------------------------------");
      console.log(`Artist: ${data.tracks.items[i].artists[0].name}\nSong Title: ${data.tracks.items[i].name}\nSpotify Preview: ${data.tracks.items[i].preview_url}\nAlbum: ${data.tracks.items[i].album.name}`);
      console.log("--------------------------------");
    }
  });
};

function bandsInTownFunction(bandToSearch) {
  appendLog(bandToSearch)
  console.log('Band to Search', bandToSearch);
  axios.get("https://rest.bandsintown.com/artists/" + bandToSearch + "/events?app_id=codingbootcamp")
    .then(function (response) {
      for (var i = 0; i < response.data.length; i++) {
        console.log('-----------------------------');
        console.log(`Upcoming Concerts: ${bandToSearch}
        Venue Name: ${response.data[i].venue.name}
        Location: ${response.data[i].venue.city + ' ,' + response.data[i].venue.region}
        Concert Date: ${moment(response.headers.date).format('MM/DD/YYYY, hh:00A')}`);
        console.log('-----------------------------');
      };
    });
};

function movieThisFunction(movieToSearch) {
  appendLog(movieToSearch);
  if (movieToSearch === '') {
    movieToSearch = "Mr. Nobody"
  }
  console.log('Movie To Search', movieToSearch);
  axios.get("http://www.omdbapi.com/?apikey=a778d6da&t=" + movieToSearch)
    .then(response => {
      console.log("---------------------------------")
      console.log(`Movie Title: ${response.data.Title}
      Year Released: ${response.data.Year}
      IMDB Rating: ${response.data.imdbRating}
      Rotten Tomatoes Rating: ${response.data.Ratings[0].Value}
      Production Country: ${response.data.Country}
      Movie Language: ${response.data.Language}
      Plot: ${response.data.Plot}
      Actors: ${response.data.Actors}`);
      console.log("---------------------------------")
    }).catch(error => {
      if (error.response) {
        console.log(error.response.data);
      };
    });
};

function doWhatItSaysFunction() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    var dataArr = data.split(",");
    // console.log('dataArr', dataArr);
    if (dataArr[0] === 'spotify this song') {
      spotifyFunction(dataArr[1])
    } else if (dataArr[0] === 'concert this') {
      bandsInTownFunction(dataArr[1]);
    } else if (dataArr[0] === 'movie this') {
      movieThisFunction(dataArr[1]);
    } else if (dataArr[0] === 'do what it says') {
      doWhatItSaysFunction()
    } else {
      console.log('Pick an option')
    }
    if (error) {
      return console.log(error);
    };
    console.log('search', data);
  });
};

function appendLog(data1) {
  fs.appendFile('log.txt', data1 + ', ', function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Search added to log!!');
    }
  })
}


