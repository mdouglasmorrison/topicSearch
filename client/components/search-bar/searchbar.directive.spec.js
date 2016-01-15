(function() {
  'use strict';

  describe('directive searchBar', function() {
    // var $window;
    var ctrl;
    var el;
    var _$cookies;

    beforeEach(module ('topicSearchApp'));

    beforeEach(module('components/search-bar/searchbar.html'));

    beforeEach(inject(function($compile, $rootScope, $cookies) {
      _$cookies = $cookies;
      _$cookies.put('query', 'baseball');
      el = angular.element('<search-bar></search-bar>');
      $compile(el)($rootScope.$new());
      $rootScope.$digest();
      ctrl = el.isolateScope().ctrl;
    }));

    it('should be compiled', function() {
      expect(el.html()).not.toEqual(null);
    });

    it('should have a controller', function(){
      expect(ctrl).not.toEqual(null);
    });

    it('should initialize with an empty string for wikipedia', function(){
      expect(ctrl.wiki).toEqual('');
    });

    it('should initialize with an empty array for twitter', function(){
      expect(ctrl.tweets).toEqual([]);
    });

    it('should not geofence by default', function(){
      expect(ctrl.query.geofence).toEqual(false);
    });

    it('should look for cookies', function(){
      expect(_$cookies.get('query')).toEqual('baseball');
    });
  });
})();
