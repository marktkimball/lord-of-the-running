(function() {
  'use strict';
  angular
    .module('preview')
    .controller('PreviewController', function($scope){

      $scope.previewPosition = 0;

      $scope.previewClickLeft = function(){
        event.preventDefault();
        if($scope.previewPosition === 0){
          $scope.previewPosition = 13;
        }else{
          $scope.previewPosition -= 1;
        }
      };

      $scope.previewClickRight = function(){
        event.preventDefault();
        if($scope.previewPosition === 13){
          $scope.previewPosition = 0;
        }else{
          $scope.previewPosition += 1;
        }
      };

      $scope.previewData = [
        {
          caption: "Main profile view; users can see current progress, achievements, recent runs, and update profile",
          url: "preview1"
        },
        {
          caption: "Users will need to authorize access to their Strava account to import runs",
          url: "preview2"
        },
        {
          caption: "Users can select from five different difficulty levels",
          url: "preview3"
        },
        {
          caption: "Lord of the Running maintains a list of all runs completed by the user since signing up",
          url: "preview4"
        },
        {
          caption: "Users can view individual run details",
          url: "preview5"
        },
        {
          caption: "When a new landmark in Middle Earth is reached, a notification is displayed",
          url: "preview6"
        },
        {
          caption: "The user's progress is tracked live on a map of Middle Earth",
          url: "preview7"
        },
        {
          caption: "Lord of the Running is also mobile friendly",
          url: "iphonePreview1"
        },
        {
          caption: "Lord of the Running is also mobile friendly",
          url: "iphonePreview2"
        },
        {
          caption: "Lord of the Running is also mobile friendly",
          url: "iphonePreview3"
        },
        {
          caption: "Through responsive web design, Lord of the Running also works on iPads and tablets",
          url: "ipadPreview1"
        },
        {
          caption: "Through responsive web design, Lord of the Running also works on iPads and tablets",
          url: "ipadPreview2"
        },
        {
          caption: "Through responsive web design, Lord of the Running also works on iPads and tablets",
          url: "ipadPreview3"
        },
        {
          caption: "Through responsive web design, Lord of the Running also works on iPads and tablets",
          url: "ipadPreview4"
        }
      ];
    })
})();
