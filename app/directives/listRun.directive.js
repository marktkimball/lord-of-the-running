(function() {
  'use strict';
  angular
    .module('MyApp')
    .directive('listRun', function(){
      return{
        restrict: 'E',
        templateUrl: 'directives/listRun.html',
        scope: {
          i: '='
        },
        link: function(scope, element, attributes){
          element.on('mouseenter', function(){
            element.children().addClass('backgroundChange');
          });
          element.on('mouseleave', function(){
            element.children().removeClass('backgroundChange');
          });
        }
      }
    });
})();
