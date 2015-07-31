angular.module('auth')
  .controller('LogoutCtrl', function($auth, $alert, $window) {
    if (!$auth.isAuthenticated()) {
      return;
    }
    $auth.logout()
      .then(function() {
        $alert({
          content: 'You have been logged out',
          animation: 'fadeZoomFadeDown',
          type: 'material',
          duration: 3
        });
      });

    $window.onbeforeunload = $auth.logout();
  });
