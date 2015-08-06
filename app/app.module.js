angular.module('MyApp', [
  'ngMessages',
  'ngRoute',
  'ngSanitize',
  'mgcrea.ngStrap',
  'auth',
  'profile',
  'ngMap',
  'map',
  'leaderboard',
  'moment'
])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'auth/views/login.html'
    })
    .when('/map', {
      templateUrl: 'map/views/map.html',
      controller: 'MapTypeImageController'
    })
    .when('/leaderboard', {
      templateUrl: 'leaderboard/views/leaderboard.html',
      controller: 'LeaderboardController'
    })
    .when('/404', {
      template: '<h1>Sorry, page not found</h1>'
    })
    .otherwise({
      redirectTo: '/404'
    });
})

.filter('secondsToDateTime', function() {
  return function(seconds) {
    var d = new Date(0,0,0,0,0,0,0);
    d.setSeconds(seconds);
    return d;
  };
});

angular
  .module('lodash', [])
  .factory('_', function($window){
    return $window._;
  });

angular
  .module('moment', [])
  .factory('moment', function($window){
    return $window.moment;
  });
