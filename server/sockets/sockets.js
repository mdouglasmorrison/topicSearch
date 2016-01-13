var Twitter = require('twitter');
var wikipedia = require('node-wikipedia');

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
      getWikipedia(query, function(result){
        io.emit('wiki', result);
      });
      getTweets(query, function(result){
        io.emit('tweet', result);
      });
    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
      if(ctrl.stream){
        ctrl.stream.destroy();
      }
    });
  });

  function getWikipedia(query, callback){
    wikipedia.page.data(query, { content: true }, function(response) {
      callback(response)
    });
  }

  function getTweets(query, callback){
    if(ctrl.stream){
      ctrl.stream.destroy();
    }

    client.stream('statuses/filter', {track: query},  function(stream){
      ctrl.stream = stream;
      stream.on('data', function(tweet) {
        callback(tweet);
      });

      stream.on('error', function(error) {
        console.log(error);
      });
    });
  }
};


