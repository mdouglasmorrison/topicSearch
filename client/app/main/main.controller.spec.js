'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('topicSearchApp'));


  var MainCtrl,
    scope,
    controller;

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    controller = $controller;
  }));

  it("should not be loading on Init", function () {
    var ctrl = controller("MainCtrl", { $scope: scope });
    expect(ctrl.loading.twitter).toBe(false);
    expect(ctrl.loading.wikipedia).toBe(false);
  });

  it("should be clean on init", function () {
    var ctrl = controller("MainCtrl", { $scope: scope });
    expect(ctrl.clean).toBe(true);
  });
});
