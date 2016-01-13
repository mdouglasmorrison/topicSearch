(function() {
  'use strict';

  angular
    .module('topicSearchApp')
    .directive('searchBar', searchBar);

  /** @ngInject */
  function searchBar($state) {
    var directive = {
      restrict: 'E',
      templateUrl: 'components/search-bar/searchbar.html',
      scope: {
          tweets: '=',
          wiki: '=',
          loading: '='
      },
      controller: SearchBarController,
      controllerAs: 'ctrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function SearchBarController($rootScope, $cookies) {
      var ctrl = this;
      var socket = io();
      console.log(ctrl.wiki);

      if ($cookies.get('topicSearch')) {
        alert("hello again");

        ctrl.query = $cookies.get('topicSearch');
        ctrl.loading = {
          twitter: true,
          wikipedia: true
        };
        socket.emit('query', ctrl.query);
      }

      ctrl.search = function(){
        ctrl.loading = {
          twitter: true,
          wikipedia: true
        };
        ctrl.wiki = '';
        ctrl.tweets = [];

        socket.emit('query', ctrl.query);
        $cookies.put('topicSearch', ctrl.query);
      };

      socket.on('wiki', function(result){
        ctrl.loading.wikipedia = false;
        console.log(result);
        if(result === 'error' || result.text == null){
          ctrl.wiki = null;
        }else{
          ctrl.wiki = result.text['*'];
          ctrl.loading.wikipedia = false;
        }

        $rootScope.$apply();
      });

      socket.on('tweetSearch', function(result){
        console.log(result);
        ctrl.tweets = result.statuses.slice(0,9);
        ctrl.loading.twitter = false;
        $rootScope.$apply();
      });

      socket.on('tweetStream', _.throttle(function(result){
        console.log(result);
        if(ctrl.tweets.length < 10){
          ctrl.tweets.push(result);
        }else{
          ctrl.tweets.pop();
          ctrl.tweets.unshift(result);
        }
        $rootScope.$apply();
      }, 2000));

    }
  }

})();
