'use strict';

angular.module('topicSearchApp')
  .controller('MainCtrl', function () {
    var ctrl = this;

    ctrl.loading = {
      twitter: false,
      wikipedia: false
    };

    ctrl.clean = true;
  });
