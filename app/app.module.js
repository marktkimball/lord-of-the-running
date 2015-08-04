angular.module('MyApp', [
  'ngMessages',
  'ngRoute',
  'ngSanitize',
  'mgcrea.ngStrap',
  'auth',
  'profile',
  'ngMap',
  'map',
  'moment'
])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home/views/home.html',
      controller: 'MapTypeImageCtrl'
    })
    .when('/upload', {
      templateUrl: 'upload/views/upload.html',
      controller: 'UploadController'
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
