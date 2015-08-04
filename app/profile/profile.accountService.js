angular.module('profile')
  .factory('Account', function($http) {
    
    var getProfile = function(){
      return $http.get('/api/me');
    };

    var updateProfile = function(profileData){
      return $http.put('/api/me', profileData);
    };

    return {
      getProfile: getProfile,
      updateProfile: updateProfile
    };
  });
