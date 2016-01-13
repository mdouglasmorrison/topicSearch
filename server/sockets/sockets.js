var Twitter = require('twitter');
var wikipedia = require('node-wikipedia');
var Promise = require('bluebird');

var client = new Twitter({
  consumer_key: 'T0tLFHfRyiaLz773luhuTQJ8L',
  consumer_secret: 'jz1OcMfggBy6cvplxJiPt5VxgcIxkhd7phs0vJCisGJeWC1XEb',
  access_token_key: '271535668-L7II203iifaZWcTfPpbkDoUqscoxg0AtoakTjRQ1',
  access_token_secret: 'QHHOmF4Ik9tJynd1aZ5p9FHFDT0bGExVH39kMKWxMRQTs'
});

module.exports = function(app, io) {
  var ctrl = this;

  io.on('connection', function(socket){
    socket.on('query', function(query){
      getWikipedia(query)
        .then(function (response) {
          io.emit('wiki', response);
        })
        .catch(function(){
          io.emit('wiki', 'error');
        });
      twitterSearch(query)
        .then(function(response){
          io.emit('tweetSearch', response);
          twitterStream(query, io);
        })
        .catch(function(){
          io.emit('tweetSearch', 'error');
        });
    });

    socket.on('disconnect', function(){
      if(ctrl.stream){
        ctrl.stream.destroy();
      }
    });
  });

  function getWikipedia(query){
    return new Promise(function(resolve, reject) {
      wikipedia.page.data(query, { content: true }, function(response) {
        if(response == null || response.text['*'] == null){
          reject(new Error('There was an error'));
        }else{
          resolve(response);
        }
      });
    });
  }

  function twitterSearch(query, type){
    return new Promise(function(resolve, reject) {
      client.get('search/tweets', {q: query, geolocation:'37.781157,-122.398720,100mi'}, function(error, tweets, response){
        if(error){
          reject(new Error('There was an error'));
        }else{
          resolve(tweets);
        }
      });
    });
  }

  function twitterStream(query, io){
    if(ctrl.stream){
      ctrl.stream.destroy();
    }
    client.stream('statuses/filter', {track: query},  function(stream){
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


