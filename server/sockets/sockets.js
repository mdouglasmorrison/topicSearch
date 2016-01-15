var Twitter = require('twitter');
var wikipedia = require('node-wikipedia');
var promise = require('bluebird');

//Twitter config
var client = new Twitter({
  consumer_key: 'T0tLFHfRyiaLz773luhuTQJ8L',
  consumer_secret: 'jz1OcMfggBy6cvplxJiPt5VxgcIxkhd7phs0vJCisGJeWC1XEb',
  access_token_key: '271535668-L7II203iifaZWcTfPpbkDoUqscoxg0AtoakTjRQ1',
  access_token_secret: 'QHHOmF4Ik9tJynd1aZ5p9FHFDT0bGExVH39kMKWxMRQTs'
});

module.exports = function(app, io) {
  var ctrl = this;

  //Open the socket
  io.on('connection', function(socket){

    //When the query is made, start making queries
    socket.on('query', function(query){

      //Search the topic in wikipedia
      getWikipedia(query.value)
        .then(function (response) {
          io.emit('wiki', response);
        })
        .catch(function(){
          io.emit('wiki', 'error');
        });

      //Search the Twitter search endpoint first, then add streaming tweets as applicable
      twitterSearch(query)
        .then(function(response){
          io.emit('tweetSearch', response);
          twitterStream(query, io);
        })
        .catch(function(){
          io.emit('tweetSearch', 'error');
        });
    });

    //When the client disconnects, destroy the stream
    socket.on('disconnect', function(){
      if(ctrl.stream){
        ctrl.stream.destroy();
      }
    });
  });

  //Uses the Wikipedia API NPM package with Bluebird promises
  function getWikipedia(query){
    return new promise(function(resolve, reject) {
      wikipedia.page.data(query, { content: true }, function(response) {
        if(response === null || response === undefined || response.text['*'] === null || response.text['*'] === undefined){
          reject(new Error('There was an error'));
        }else{
          resolve(response);
        }
      });
    });
  }

  //Uses the Twitter API NPM package with Bluebird promises to return a series of Tweets
  function twitterSearch(query){
    var config = {
      q: query.value
    };

    //Add geolocation details if applicable
    if(query.geofence && query.location){
      config.geolocation = query.location;
    }

    //Return promise
    return new promise(function(resolve, reject) {
      client.get('search/tweets', config, function(error, tweets, response){
        if(error){
          reject(new Error('There was an error'));
        }else{
          resolve(tweets);
        }
      });
    });
  }

  //Uses the Twitter API NPM package to return a stream of Tweets
  //Accepts the IO channel as second param to allow for constant push of new Tweets
  function twitterStream(query, io){
    //Kills existing streams
    if(ctrl.stream){
      ctrl.stream.destroy();
    }

    var config = {
      track: query.value
    };

    //Add geolocation details if applicable
    if(query.geofence && query.location){
      config.geolocation = query.location;
    }

    client.stream('statuses/filter', config,  function(stream){
      ctrl.stream = stream;
      stream.on('data', function(tweet) {
        io.emit('tweetStream', tweet);
      });
      stream.on('error', function(error) {
        io.emit('tweetStream', 'error');
      });
    });
  }
};


