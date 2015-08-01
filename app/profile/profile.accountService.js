angular.module('profile')
  .factory('Account', function($http, $q, $cacheFactory) {
    var cacheCreator = $cacheFactory('CacheCreator');

    getProfile = function(){
      return $http.get('/api/me');
    };

    updateProfile = function(profileData){
      return $http.put('/api/me', profileData);
    };

    return {
      getProfile: getProfile,
      updateProfile: updateProfile
    };
  });
