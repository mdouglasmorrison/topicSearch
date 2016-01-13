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
    function SearchBarController($rootScope) {
      var ctrl = this;
      var socket = io();
      console.log(ctrl.wiki);

      ctrl.search = function(){
        ctrl.loading = {
          twitter: true,
          wikipedia: true
        };
        socket.emit('query', ctrl.query);

      };

      socket.on('wiki', function(result){
        ctrl.wiki = result.text['*'];
        ctrl.loading.wikipedia = false;
        $rootScope.$apply();
      });

      socket.on('tweet', function(tweet){
        if(ctrl.tweets.length > 10){
          ctrl.tweets.pop();
        }
        ctrl.tweets.unshift(tweet);
        ctrl.loading.twitter = false;
        $rootScope.$apply();
      });

    }
  }

})();
