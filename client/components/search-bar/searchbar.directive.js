(function() {
  'use strict';

  angular
    .module('topicSearchApp')
    .directive('searchBar', searchBar);

  /** @ngInject */
  function searchBar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'components/search-bar/searchbar.html',
      scope: {
          clean: '=',
          loading: '=',
          tweets: '=',
          wiki: '='
      },
      controller: SearchBarController,
      controllerAs: 'ctrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function SearchBarController($rootScope, $cookies) {
      var socket = window.io(),
      ctrl = this;


      /* ---INITIALIZATION FUNCTION--- */

      function init(){

        ctrl.tweets = [];
        ctrl.wiki = '';
        //Check for geolocation support to show/hide locator switch
        if (navigator.geolocation) {
          ctrl.geofenceSupport = true;
        }

        //Create the query object with geolocation off by default
        ctrl.query = {
          geofence: false
        };

        //Value store for location in progress
        ctrl.disableButton = false;

        //Check to see if the user has a fresh search.
        //If so, get the topic and immediately search it.
        if ($cookies.get('topicSearch')) {
          ctrl.query.value = $cookies.get('topicSearch');
          ctrl.clean = false;
          ctrl.loading = {
            twitter: true,
            wikipedia: true
          };
          socket.emit('query', ctrl.query);
        }
      }




      /* ---FUNCTIONS FOR USER ACTIONS--- */

      //Function to get user location if they toggle
      ctrl.getLocation = function () {
        //Check to see if there is already a location set, if not, get it.
        if(ctrl.query.location ===  null || ctrl.query.location === undefined){
          //Disable the search button and show loading indicator until the location comes back.
          ctrl.disableButton = true;

          //Get the location and create the geolocation string
          navigator.geolocation.getCurrentPosition(function(position) {
            ctrl.query.location = position.coords.latitude + ',' + position.coords.longitude + ',100mi';
            ctrl.disableButton = false;
            ctrl.search();
          });
        }
      };


      //Function to query API's for a given topic and save the query for 5 minutes
      ctrl.search = function(){
        var expireDate;

        ctrl.clean = false;

        //Show loading indicators for each section
        ctrl.loading = {
          twitter: true,
          wikipedia: true
        };

        //Emit the query to the open query socket
        socket.emit('query', ctrl.query);

        //Set a cookie to expire in 5 minutes, to store searches in event of refresh
        expireDate = new Date();
        expireDate.setDate(expireDate.getMinutes() + 5);
        $cookies.put('topicSearch', ctrl.query.value, {'expires': expireDate});
      };





      /* --- SUBSCRIBERS FOR SOCKET CHANNELS --- */

      //Socket subscriber for the wikipedia results.
      socket.on('wiki', function(result){
        ctrl.loading.wikipedia = false;
        if(result === 'error' || result.text === null || result.text === undefined){
          ctrl.wiki = null;
        }else{
          ctrl.wiki = result.text['*'];
          ctrl.loading.wikipedia = false;
        }
        $rootScope.$apply();
      });


      //Socket subscriber for the twitter search results. Only shows the first 10.
      socket.on('tweetSearch', function(result){
        ctrl.tweets = result.statuses.slice(0,9);
        ctrl.loading.twitter = false;
        $rootScope.$apply();
      });


      //Socket subscriber for the twitter stream results. Puts newest at top and removes the last. Always 10 tweets.
      //Uses lodash throttle to only add tweets to the array every two seconds.
      socket.on('tweetStream', _.throttle(function(result){
        if(ctrl.tweets.length < 10){
          ctrl.tweets.push(result);
        }else{
          ctrl.tweets.pop();
          ctrl.tweets.unshift(result);
        }
        $rootScope.$apply();
      }, 2000));


      //Initialize
      init();
    }
  }

})();
