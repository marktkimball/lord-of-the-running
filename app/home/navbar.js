angular.module('MyApp')
  .controller('NavbarCtrl', function($scope, $auth) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.toggleMenu = function() {
      var subMenu = angular.element(document.getElementsByClassName('smallMainMenuOptions'));
      subMenu.toggleClass('showMenu');
    };

  });
