angular.module('profile', ['ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
  .config(function($routeProvider, $authProvider) {
    $routeProvider
      .when('/profile', {
        templateUrl: 'profile/views/profile.html',
        controller: 'ProfileController',
        resolve: {
          authenticated: function($q, $location, $auth) {
            var deferred = $q.defer();

            if (!$auth.isAuthenticated()) {
              $location.path('/login');
            } else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        }
      })

      .when('/myRuns', {
        templateUrl: 'profile/views/myRuns.html',
        controller: 'ProfileController',
        resolve: {
          authenticated: function($q, $location, $auth) {
            var deferred = $q.defer();

            if (!$auth.isAuthenticated()) {
              $location.path('/login');
            } else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        }
      })

      .when('/individualRun/:id', {
        templateUrl: 'profile/views/individualRun.html',
        controller: 'ProfileController',
        resolve: {
          authenticated: function($q, $location, $auth) {
            var deferred = $q.defer();

            if (!$auth.isAuthenticated()) {
              $location.path('/login');
            } else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        }
      })

      .when('/begin', {
        templateUrl: 'profile/views/begin.html',
        controller: 'ProfileController',
        resolve: {
          authenticated: function($q, $location, $auth) {
            var deferred = $q.defer();

            if (!$auth.isAuthenticated()) {
              $location.path('/login');
            } else {
              deferred.resolve();
            }

            return deferred.promise;
          }
        }
      });

  });
