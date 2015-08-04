(function() {
  'use strict';
  angular
    .module('leaderboard')
    .factory('LeaderboardService', function($http){

      var getAllUsers = function(){
        return $http.get('/api/allUsers');
      };

      return{
        getAllUsers: getAllUsers
      };
    })
})();
