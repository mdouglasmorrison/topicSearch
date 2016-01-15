'use strict';

angular.module('topicSearchApp')
  .controller('MainCtrl', function ($scope, $http) {
    var ctrl = this;

    ctrl.loading = {
      twitter: false,
      wikipedia: false
    };

    ctrl.clean = true;

  });
