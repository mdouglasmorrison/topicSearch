'use strict';

angular.module('topicSearchApp', [
  'ngCookies',
  'ngSanitize',
  'ngMessages',
  'ui.router',
  'ngMaterial'
])
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('light-blue')
      .accentPalette('blue-grey');
  })
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });




