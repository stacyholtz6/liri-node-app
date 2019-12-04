require("dotenv").config();
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
console.log(keys);

var inputString = process.argv;

var operand = inputString[2];
var data1 = inputString[3];
var data2 = inputString[4];

switch (operand) {
  case 'concert-this':
    break;
  case 'spotify-this-song':
    spotifyFunction(data1);
    break;
}

function spotifyFunction(songToSearch) {
  console.log(' songToSearch', songToSearch);
  spotify.search({ type: 'track', query: songToSearch }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    console.log(data);
    console.log(data.tracks.items[0]);
    console.log(data.tracks.items[0].album.images);
    console.log(JSON.stringify(data.tracks.items[0].album, null, 4))
  });
};