(function() {
  'use strict';
  angular
    .module('leaderboard')
    .factory('LeaderboardService', function($http){

      var getLeaders = function(){
        return $http.get('/api/leaders');
      };

      return{
        getLeaders: getLeaders
      };
    })
})();
