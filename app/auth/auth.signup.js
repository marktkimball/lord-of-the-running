angular.module('auth')
  .controller('SignupCtrl', function($scope, $alert, $auth, $window) {
    $scope.signup = function() {
      $auth.signup({
        displayName: $scope.displayName,
        email: $scope.email,
        password: $scope.password
      })
      .then(function(){
        $window.location.href= '/#/profile';
      })
      .catch(function(response) {
        if (typeof response.data.message === 'object') {
          console.log("Catch IF function");
          angular.forEach(response.data.message, function(message) {
            $alert({
              content: message[0],
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
          });
        } else {
          $alert({
            content: response.data.message,
            animation: 'fadeZoomFadeDown',
            type: 'material',
            duration: 3
          });
        }
      });
    };
  });
