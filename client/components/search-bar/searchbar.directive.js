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
          options: '='
      },
      controller: SearchBarController,
      controllerAs: 'ctrl',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function SearchBarController($rootScope) {
      var ctrl = this;

    }
  }

})();
