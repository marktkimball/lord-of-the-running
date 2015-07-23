(function() {
  'use strict';
  angular
    .module('map')
    .controller('MiddleEarthMapController', function($scope, MapService){

      // $scope.$on('mapInitialized', function(event, map) {
      //
      // });

      function getNormalizedCoord(coord, zoom) {
        var y = coord.y;
        var x = coord.x;
        var tileRange = 1 << zoom;

        if (y < 0 || y >= tileRange) {
          return null;
        }

        return {
          x: x,
          y: y
        };
      };

      var middleEarthTypeOptions = {
        getTileUrl: function(coord, zoom) {
            var normalizedCoord = getNormalizedCoord(coord, zoom);
            if (!normalizedCoord) {
              return null;
            }
            var bound = Math.pow(2, zoom);
            return 'assets/middle_earth_map' +
                '/' + zoom + '/' + normalizedCoord.x + '/' +
                normalizedCoord.y + '.png';
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: 4,
        minZoom: 2,
        name: 'MiddleEarth'
      };

      var middleEarthMapType = new google.maps.ImageMapType(middleEarthTypeOptions);

      $scope.mapTypeChanged = function() {
        var showStreetViewControl = this.getMapTypeId() != 'coordinate';
        this.setOptions({'streetViewControl': showStreetViewControl});
      };

    });
})();
