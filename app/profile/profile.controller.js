angular.module('profile')
  .controller('ProfileController', function($scope, $auth, $alert, Account, $routeParams, $rootScope) {
    /**
     * Get user's profile information.
     */
   $scope.achievements = {'farthestRun' : 0, 'fastestPace' : undefined, 'longestRun' : '', 'untilMountDoom' : 1800};

    $scope.getProfile = function() {
      Account.getProfile()
        .success(function(data) {
          $scope.user = data;
          $scope.runs = data.runs;
          $rootScope.user = data;
          $rootScope.runData = data.runs;
          $scope.achievementCheck();
        })
        .error(function(error) {
          $alert({
            content: error.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };

    $scope.logProfile = function () {
      console.log($scope.user.displayName);
      return $scope.user.displayName + "";
    }


    /**
     * Update user's profile information.
     */
    $scope.updateProfile = function() {
      Account.updateProfile({
        displayName: $scope.user.displayName,
        email: $scope.user.email,
        location: $scope.user.location
      }).then(function() {
        console.log($scope.user);
        $alert({
          content: 'Profile has been updated',
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        });
      });
    };

    /**
     * Link third-party provider.
     */
    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function() {
          $alert({
            content: 'You have successfully linked ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        })
        .then(function() {
          $scope.getProfile();
        })
        .catch(function(response) {
          $alert({
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };

    /**
     * Unlink third-party provider.
     */
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          $alert({
            content: 'You have successfully unlinked ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        })
        .then(function() {
          $scope.getProfile();
        })
        .catch(function(response) {
          $alert({
            content: response.data ? response.data.message : 'Could not unlink ' + provider + ' account',
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        });
    };

    $scope.updateDifficulty = function(newDifficulty){
      Account.updateProfile({
        difficulty: newDifficulty
      });
    };

    $scope.tab = false;

    $scope.selectTab = function(value){
      this.tab = value;
    };

    $scope.sortSelected = "-date";

    $scope.selectSort = function(newSorter){
      $scope.sortSelected = newSorter;
    };

    if($routeParams.id){
      for(var i = 0; i < $rootScope.runData.length; i++){
        if($rootScope.runData[i].id == $routeParams.id){
          $scope.run = $rootScope.runData[i];
        }
      }
    };

    $scope.achievementCheck = function(){
      for(var j = 0; j < $rootScope.runData.length; j++){
        if($scope.achievements.farthestRun < $rootScope.runData[j].distance){
          $scope.achievements.farthestRun = $rootScope.runData[j].distance;
        };
        if($scope.achievements.fastestPace > $rootScope.runData[j].pace || $scope.achievements.fastestPace === undefined){
          $scope.achievements.fastestPace = $rootScope.runData[j].pace;
        };
        if($scope.achievements.longestRun < $rootScope.runData[j].time){
          $scope.achievements.longestRun = $rootScope.runData[j].time;
        };
      };
      $scope.achievements.untilMountDoom = (1800 - ($rootScope.user.totalMiles * 0.000621371));
    };

    $scope.getProfile();

  });
