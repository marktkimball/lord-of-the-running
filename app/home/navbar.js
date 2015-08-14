angular.module('MyApp')
  .controller('NavbarCtrl', function($scope, $auth) {
    $scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };

    $scope.toggleMenu = function() {
      var subMenu = angular.element(document.getElementsByClassName('smallMainMenuOptions'));
      var menuIcon = angular.element(document.getElementsByClassName('fa-bars'));
      subMenu.toggleClass('showMenu');
      menuIcon.toggleClass('rotatedMenu');
    };

  });
