(function() {
  'use strict';
  angular
    .module('leaderboard')
    .controller('LeaderboardController', function($scope, LeaderboardService){

      var getLeaders = function(){
        LeaderboardService.getLeaders()
          .success(function(data){
            $scope.leaders = data;
            if(data.fastestCompletedTime){
              $scope.fastestCompletedTime = moment.duration(data.fastestCompletedTime.fastestCompletedTime).humanize();
            }
            if(data.fastestHobbitTime){
              $scope.fastestHobbitTime = moment.duration(data.fastestHobbitTime.fastestHobbitTime).humanize();
            }
            if(data.fastestDwarfTime){
              $scope.fastestDwarfTime = moment.duration(data.fastestDwarfTime.fastestDwarfTime).humanize();
            }
            if(data.fastestManTime){
              $scope.fastestManTime = moment.duration(data.fastestManTime.fastestManTime).humanize();
            }
            if(data.fastestElfTime){
              $scope.fastestElfTime = moment.duration(data.fastestElfTime.fastestElfTime).humanize();
            }
            if(data.fastestWizardTime){
              $scope.fastestWizardTime = moment.duration(data.fastestWizardTime.fastestWizardTime).humanize();
            }

          })
      }

      getLeaders();

    })
})();
