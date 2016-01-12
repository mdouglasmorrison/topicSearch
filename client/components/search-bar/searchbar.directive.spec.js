(function() {
  'use strict';

  /**
   * @todo Complete the test
   * This example is not perfect.
   * Test should check if MomentJS have been called
   */
  describe('directive navbar', function() {
    // var $window;
    var ctrl;
    var el;

    beforeEach(module('topicSearchApp'));
    //beforeEach(inject(function($compile, $rootScope) {
    //
    //  el = angular.element('<acme-navbar></acme-navbar>');
    //
    //  $compile(el)($rootScope.$new());
    //  $rootScope.$digest();
    //  ctrl = el.isolateScope().ctrl;
    //}));

    it('should be compiled', function() {
      expect(el.html()).not.toEqual(null);
    });
  });
})();
