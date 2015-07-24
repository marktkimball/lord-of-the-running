angular.module('profile')
  .controller('ProfileController', function($scope, $auth, $alert, Account) {

    /**
     * Get user's profile information.
     */
    $scope.getProfile = function() {
      Account.getProfile()
        .success(function(data) {
          $scope.user = data;
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
        email: $scope.user.email
      }).then(function() {
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

    $scope.getProfile();

    this.tab = false;

    this.selectTab = function(value){
      this.tab = value;
    };

    $scope.sortSelected = "-date";

     $scope.selectSort = function(newSorter){
       $scope.sortSelected = newSorter;
     };

    $scope.runs = [
      {
        id: '1',
        distance: 4.0,
        time: "32:57",
        pace: "8:04",
        date: "07/25/2015"
      },
      {
        id: '2',
        distance: 5.0,
        time: "40:57",
        pace: "8:04",
        date: "07/22/2015"
      },
      {
        id: '3',
        distance: 10.0,
        time: "01:15:57",
        pace: "10:04",
        date: "07/21/2015"
      },
      {
        id: '4',
        distance: 2.0,
        time: "15:00",
        pace: "7:30",
        date: "07/26/2015"
      },
      {
        id: '5',
        distance: 4.4,
        time: "33:57",
        pace: "8:05",
        date: "07/20/2015"
      },
      {
        id: '6',
        distance: 5.5,
        time: "45:35",
        pace: "9:00",
        date: "06/25/2015"
      },
      {
        id: '7',
        distance: 1.0,
        time: "6:40",
        pace: "6:40",
        date: "01/22/2015"
      },
      {
        id: '8',
        distance: 4.0,
        time: "33:57",
        pace: "8:10",
        date: "02/25/2014"
      },
      {
        id: '9',
        distance: 4.5,
        time: "33:17",
        pace: "7:04",
        date: "07/25/2014"
      },
      {
        id: '10',
        distance: 20.45,
        time: "02:10:31",
        pace: "8:04",
        date: "07/25/2016"
      }
    ];

  });
