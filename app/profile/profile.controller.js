angular.module('profile')
  .controller('ProfileController', function($scope, $auth, $alert, Account, $routeParams, $rootScope, moment, $modal) {
    /**
     * Get user's profile information.
     */
     $scope.achievements = {'farthestRun' : 0, 'fastestPace' : undefined, 'longestRun' : '', 'untilMountDoom' : 1800};

     $scope.getProfile = function() {
       Account.getProfile()
       .success(function(data) {
         $scope.user = data;
         $scope.runs = data.runs;
         $rootScope.user = data;
         $rootScope.runData = data.runs;
         if(data.achievements){
           $scope.fastestCompletionTime = moment.duration(data.achievements.fastestCompletionTime).humanize();
         }

         //Set difficultyMultipler
         var difficultyMultipler;
         if(data.currentJourney){
            if(data.currentJourney.difficulty === "Wizard"){
              difficultyMultipler = 10;
            }else if(data.currentJourney.difficulty === "Elf"){
              difficultyMultipler = 5;
            }else if(data.currentJourney.difficulty === "Man"){
              difficultyMultipler = 3;
            }else if(data.currentJourney.difficulty === "Dwarf"){
              difficultyMultipler = 2;
            }else{
              difficultyMultipler = 1;
            };
            $scope.currentJourneyTotalMiles = $scope.user.currentJourney.totalMiles;
            $scope.totalMEMiles = $scope.currentJourneyTotalMiles * difficultyMultipler;
            $rootScope.totalMEMiles = $scope.totalMEMiles;
          };

          $scope.totalMiles = $rootScope.user.totalMiles;

          // achievementCheck();
          if($scope.totalMEMiles >= 1800){
            completedCheck();
          }
          if($scope.user.currentJourney){
            $scope.currentPositionInfo = getCurrentPositionInfo();
          }
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
      return $scope.user.displayName + "";
    }

    /**
     * Update user's profile information.
     */
    $scope.updateProfile = function() {
      Account.updateProfile({
        displayName: $scope.user.displayName,
        email: $scope.user.email,
        location: $scope.user.location
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

    $scope.updateDifficulty = function(newDifficulty){
      var currentJourney = {
        difficulty: newDifficulty,
        startDate: moment().valueOf(),
        runs: [],
        totalMiles: 0
      };
      Account.updateProfile({
        currentJourney : currentJourney
      });
    };

    $scope.tab = false;

    $scope.selectTab = function(value){
      this.tab = value;
    };

    $scope.sortSelected = "-date";

    $scope.selectSort = function(newSorter){
      $scope.sortSelected = newSorter;
    };

    if($routeParams.id){
      for(var i = 0; i < $rootScope.runData.length; i++){
        if($rootScope.runData[i].id == $routeParams.id){
          $scope.run = $rootScope.runData[i];
        }
      }
    };

    var achievementCheck = function(){
      var currentAchievements = $rootScope.user.achievements;

      if(currentAchievements.fastestHobbitTime !== null){
        $scope.achievements.highestCompletionDifficulty = "Hobbit";
      }else if(currentAchievements.fastestDwarfTime !== null){
        $scope.achievements.highestCompletionDifficulty = "Elf";
      }else if(currentAchievements.fastestManTime !== null){
        $scope.achievements.highestCompletionDifficulty = "Man";
      }else if(currentAchievements.fastestElfTime !== null){
        $scope.achievements.highestCompletionDifficulty = "Elf";
      }else if (currentAchievements.fastestWizardTime !== null){
        $scope.achievements.highestCompletionDifficulty = "Wizard";
      }

      $scope.achievements.timesCompleted = currentAchievements.timesCompletedWizard + currentAchievements.timesCompletedElf + currentAchievements.timesCompletedMan + currentAchievements.timesCompletedDwarf + currentAchievements.timesCompletedHobbit;
      var fastestCompletionTime = null;

      if(currentAchievements.fastestHobbitTime && fastestCompletionTime === null){
        fastestCompletionTime = currentAchievements.fastestHobbitTime;
        $scope.achievements.fastestCompletionDifficulty = "Hobbit";
      }else if(currentAchievements.fastestHobbitTime && (currentAchievements.fastestHobbitTime <= fastestCompletionTime)){
        fastestCompletionTime = currentAchievements.fastestHobbitTime;
        $scope.achievements.fastestCompletionDifficulty = "Hobbit";
      }
      if(currentAchievements.fastestDwarfTime && fastestCompletionTime === null){
        fastestCompletionTime = currentAchievements.fastestDwarfTime;
        $scope.achievements.fastestCompletionDifficulty = "Dwarf";
      }else if(currentAchievements.fastestDwarfTime && (currentAchievements.fastestDwarfTime <= fastestCompletionTime)){
        fastestCompletionTime = currentAchievements.fastestDwarfTime;
        $scope.achievements.fastestCompletionDifficulty = "Dwarf";
      }
      if(currentAchievements.fastestManTime && fastestCompletionTime === null){
        fastestCompletionTime = currentAchievements.fastestManTime;
        $scope.achievements.fastestCompletionDifficulty = "Man";
      }else if(currentAchievements.fastestManTime && (currentAchievements.fastestManTime <= fastestCompletionTime)){
        fastestCompletionTime = currentAchievements.fastestManTime;
        $scope.achievements.fastestCompletionDifficulty = "Man";
      }
      if(currentAchievements.fastestElfTime && fastestCompletionTime === null){
        fastestCompletionTime = currentAchievements.fastestElfTime;
        $scope.achievements.fastestCompletionDifficulty = "Elf";
      }else if(currentAchievements.fastestElfTime && (currentAchievements.fastestElfTime <= fastestCompletionTime)){
        fastestCompletionTime = currentAchievements.fastestElfTime;
        $scope.achievements.fastestCompletionDifficulty = "Elf";
      }
      if(currentAchievements.fastestWizardTime && fastestCompletionTime === null){
        fastestCompletionTime = currentAchievements.fastestWizardTime;
        $scope.achievements.fastestCompletionDifficulty = "Wizard";
      }else if(currentAchievements.fastestWizardTime && (currentAchievements.fastestWizardTime <= fastestCompletionTime)){
        fastestCompletionTime = currentAchievements.fastestWizardTime;
        $scope.achievements.fastestCompletionDifficulty = "Wizard";
      }
      if(fastestCompletionTime !== null){
        $scope.achievements.fastestCompletionTime = moment.duration(fastestCompletionTime).humanize()
      }

      for(var j = 0; j < $rootScope.runData.length; j++){
        if($scope.achievements.farthestRun < $rootScope.runData[j].distance){
          $scope.achievements.farthestRun = $rootScope.runData[j].distance;
        };
        if($scope.achievements.fastestPace > $rootScope.runData[j].pace || $scope.achievements.fastestPace === undefined){
          $scope.achievements.fastestPace = $rootScope.runData[j].pace;
        };
        if($scope.achievements.longestRun < $rootScope.runData[j].time){
          $scope.achievements.longestRun = $rootScope.runData[j].time;
        };
      };
      $scope.achievements.untilMountDoom = (1800 - $scope.totalMEMiles);
    };

    var getCurrentPositionInfo = function(){
      var userMiles = $scope.totalMEMiles;

      if(userMiles >= 1800){
        var currentPositionInfo = {
          landmark: "The Sammath Naur at Mount Doom",
          landmarkMiles: 1800,
          nextLandmark: "",
          nextLandmarkMiles: 0,
          description: "Cast the ring into Mount Doom",
          landmarkImage: ""
        };
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if(userMiles >= 1796){
        var currentPositionInfo = {
          landmark: "The Slopes of Mount Doom",
          landmarkMiles: 1796,
          nextLandmark: "The Sammath Naur at Mount Doom",
          nextLandmarkMiles: 1800,
          description: "Climbing the slopes of Mount Doom, the final steps",
          landmarkImage: ""
        };
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if(userMiles >= 1730){
        var currentPositionInfo = {
          landmark: "The Road to Barad-dûr",
          landmarkMiles: 1730,
          nextLandmark: "The Slopes of Mount Doom",
          nextLandmarkMiles: 1796,
          description: "The final stages of the quest, run along the road to Barad-dûr",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if(userMiles >= 1720){
        var currentPositionInfo = {
          landmark: "The Isenmouthe",
          landmarkMiles: 1720,
          nextLandmark: "The Road to Barad-dûr",
          nextLandmarkMiles: 1730,
          description: "You are overtaken by Orcs on the road from Durthang to Udûn but escape.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if(userMiles >= 1650){
        var currentPositionInfo = {
          landmark: "The Morgai",
          landmarkMiles: 1650,
          nextLandmark: "The Isenmouthe",
          nextLandmarkMiles: 1720,
          description: "You run northward along the Morgai.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if(userMiles >= 1620){
        var currentPositionInfo = {
          landmark: "The Tower of Cirith Ungol",
          landmarkMiles: 1620,
          nextLandmark: "The Morgai",
          nextLandmarkMiles: 1650,
          description: "You are stabbed by Shelob and subsequently captured by the Orcs of Cirith Ungol.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if(userMiles >= 1600){
        var currentPositionInfo = {
          landmark: "Shelob's Lair",
          landmarkMiles: 1600,
          nextLandmark: "The Tower of Cirith Ungol",
          nextLandmarkMiles: 1620,
          description: "Gollum leads you into Shelob's Lair.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if(userMiles >= 1590){
        var currentPositionInfo = {
          landmark: "The Straight Stair",
          landmarkMiles: 1590,
          nextLandmark: "Shelob's Lair",
          nextLandmarkMiles: 1600,
          description: "You ascend the Straight Stair near Minas Morgul.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 1560){
        var currentPositionInfo = {
          landmark: "The Crossroads",
          landmarkMiles: 1560,
          nextLandmark: "The Straight Stair",
          nextLandmarkMiles: 1590,
          description: "The Dawnless Day. You pass the Cross-roads, and see the Morgul-host set forth towards Minas Tirith.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 1530){
        var currentPositionInfo = {
          landmark: "Henneth Annûn",
          landmarkMiles: 1530,
          nextLandmark: "The Crossroads",
          nextLandmarkMiles: 1560,
          description: "Faramir takes you to Henneth Annûn.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 1480){
        var currentPositionInfo = {
          landmark: "The Blackgate",
          landmarkMiles: 1480,
          nextLandmark: "Henneth Annûn",
          nextLandmarkMiles: 1530,
          description: "Attempting to enter Mordor through the Morannon is too dangerous, so Gollum leads you towards Ithilien",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 1370){
        var currentPositionInfo = {
          landmark: "The Dead Marshes",
          landmarkMiles: 1370,
          nextLandmark: "The Blackgate",
          nextLandmarkMiles: 1480,
          description: "You begin the passage of the Dead Marshes.  Don't follow the lights.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 1340){
        var currentPositionInfo = {
          landmark: "Emyn Muil",
          landmarkMiles: 1340,
          nextLandmark: "The Dead Marshes",
          nextLandmarkMiles: 1370,
          description: "After the Fellowship is broken, you proceed into Emyn Muil alone.  Your loneliness is not for long as you soon meet Gollum.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 1300){
        var currentPositionInfo = {
          landmark: "Parth Galen",
          landmarkMiles: 1300,
          nextLandmark: "Emyn Muil",
          nextLandmarkMiles: 1340,
          description: "The Fellowship of the Ring is broken and you must go on alone to Mordor.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 1280){
        var currentPositionInfo = {
          landmark: "Argonath",
          landmarkMiles: 1280,
          nextLandmark: "Parth Galen",
          nextLandmarkMiles: 1300,
          description: "The Fellowship of the Ring passes the Argonath and reaches Nen Hithoel.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 930){
        var currentPositionInfo = {
          landmark: "The River Anduin",
          landmarkMiles: 930,
          nextLandmark: "Argonath",
          nextLandmarkMiles: 1280,
          description: "The Fellowship travels south on the river Anduin.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 890){
        var currentPositionInfo = {
          landmark: "Lothlórien",
          landmarkMiles: 890,
          nextLandmark: "The River Anduin",
          nextLandmarkMiles: 930,
          description: "You rest in Lorien and are giving gifts from Galadriel to help on your journey.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 850){
        var currentPositionInfo = {
          landmark: "Dimrill Dale",
          landmarkMiles: 850,
          nextLandmark: "Lothlórien",
          nextLandmarkMiles: 890,
          description: "Despite your hurry, you look into Mirrormere and see Durin's crown.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 840){
        var currentPositionInfo = {
          landmark: "Bridge of Khazad-dûm",
          landmarkMiles: 840,
          nextLandmark: "Dimrill Dale",
          nextLandmarkMiles: 850,
          description: "The Fellowship of the Ring find the Chamber of Mazarbul and Balin's Tomb. You are attacked by Orcs and a Balrog and Gandalf falls with Durin's Bane.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 800){
        var currentPositionInfo = {
          landmark: "Moria",
          landmarkMiles: 800,
          nextLandmark: "Bridge of Khazad-dûm",
          nextLandmarkMiles: 840,
          description: "You reach the West-gate of Moria at nightfall where you and the Fellowship are attacked by the Watcher. Gandolf opens the gate and your proceed through Moria.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 720){
        var currentPositionInfo = {
          landmark: "Redhorn Pass",
          landmarkMiles: 720,
          nextLandmark: "Moria",
          nextLandmarkMiles: 800,
          description: "The Fellowship of the Ring camps at the foot of the Redhorn Pass. You try to cross the pass but are unsuccessful. The Fellowship returns to Hollin and in the night are attacked by a pack of Wargs.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 490){
        var currentPositionInfo = {
          landmark: "The Misty Mountains",
          landmarkMiles: 490,
          nextLandmark: "Redhorn Pass",
          nextLandmarkMiles: 720,
          description: "The Fellowship of the Ring travels south along the Misty Mountains towards Caradhras.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 450){
        var currentPositionInfo = {
          landmark: "Rivendale",
          landmarkMiles: 450,
          nextLandmark: "The Misty Mountains",
          nextLandmarkMiles: 490,
          description: "You rest in Rivendale. The Council of Elrond is held and it is decided that the One Ring must be destroyed in Mordor. The Fellowship of the Ring is formed.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 440){
        var currentPositionInfo = {
          landmark: "The Ford of Bruinen",
          landmarkMiles: 440,
          nextLandmark: "Rivendale",
          nextLandmarkMiles: 450,
          description: "Glorfindel rushes you to the Ford of Bruinen on your way to Rivendale with the Nazgûl in pursuit.  You reach the Ford and Elrond washes the Nazgûl away in the river.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 230){
        var currentPositionInfo = {
          landmark: "Weathertop",
          landmarkMiles: 230,
          nextLandmark: "The Ford of Bruinen",
          nextLandmarkMiles: 440,
          description: "Your camp is raided by the Black Riders at night and you are stabbed with a Morgul Blade by the Witch King.  Strider and your company travel towards Rivendale to seek healing.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 180){
        var currentPositionInfo = {
          landmark: "The Midgewater Marshes",
          landmarkMiles: 180,
          nextLandmark: "Weathertop",
          nextLandmarkMiles: 230,
          description: "Together with Strider you travel towards Weathertop through the Midgewater Marshes. You see flashes from Gandalf's fight with the Black Riders at Weathertop in the night.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 130){
        var currentPositionInfo = {
          landmark: "Bree",
          landmarkMiles: 130,
          nextLandmark: "The Midgewater Marshes",
          nextLandmarkMiles: 180,
          description: "You reach Bree at night and stay at the Prancing Pony.  The Inn at Bree is raided but the Black Riders find only pillows in the your bed. You leave Bree together with Strider.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 80){
        var currentPositionInfo = {
          landmark: "Tom Bombadil's House",
          landmarkMiles: 80,
          nextLandmark: "Bree",
          nextLandmarkMiles: 130,
          description: "In the Old Forest you encounter the evil tree Old Man Willow and are rescued by Tom Bombadil. You spend the night at Tom's house.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 60){
        var currentPositionInfo = {
          landmark: "The Old Forest",
          landmarkMiles: 60,
          nextLandmark: "Tom Bombadil's House",
          nextLandmarkMiles: 80,
          description: "You enter the Old Forest leaving Fredegar Bolger behind to impersonate you.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 40){
        var currentPositionInfo = {
          landmark: "Woody End",
          landmarkMiles: 40,
          nextLandmark: "The Old Forest",
          nextLandmarkMiles: 60,
          description: "You encounter the Nazgûl near Woody End but the chanting of approaching elves scare them away. You meet Gildor and the High Elves and camp with them during the night.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if (userMiles >= 10){
        var currentPositionInfo = {
          landmark: "The Shire",
          landmarkMiles: 10,
          nextLandmark: "Woody End",
          nextLandmarkMiles: 40,
          description: "Leaving Hobbiton you travel through the greater Shire area.  You soon reach Farmer Maggot's property and he guides you along toward Buckland.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }else if ($scope.user.currentJourney.difficulty){
        var currentPositionInfo = {
          landmark: "Hobbiton - Bag End",
          landmarkMiles: 0,
          nextLandmark: "The Shire",
          nextLandmarkMiles: 10,
          description: "The start of a very long journey to destory the One Ring and save Middle Earth. Say farewell to the peace and serenity.",
          landmarkImage: ""
        }
        if($scope.user.currentPosition !== currentPositionInfo.landmark){
          newPositionUpdate(currentPositionInfo);
        }
        return currentPositionInfo;
      }
    };

    function newPositionUpdate(currentPositionInfo){
      setTimeout(function(){
        var newLocationModal = $modal({title: currentPositionInfo.landmark, content: currentPositionInfo.description, show: true});
      }, 2000);
      Account.updateProfile({
        currentPosition : currentPositionInfo.landmark
      });
    };

    var completedCheck = function(){
      var currentAchievements = $rootScope.user.achievements;
      var currentJourney = $rootScope.user.currentJourney;
      var difficultyList = ["Wizard", "Elf", "Man", "Dwarf", "Hobbit"];

      if(difficultyList.indexOf(currentJourney.difficulty) === 0){
        currentAchievements.timesCompletedWizard += 1;
        if(currentAchievements.fastestWizardTime === null){
          currentAchievements.fastestWizardTime = (moment().valueOf() - currentJourney.startDate);
        }else if(currentAchievements.fastestWizardTime > (moment().valueOf() - currentJourney.startDate)){
          currentAchievements.fastestWizardTime = (moment().valueOf() - currentJourney.startDate);
        }
      }else if(difficultyList.indexOf(currentJourney.difficulty) === 1){
        currentAchievements.timesCompletedElf += 1;
        if(currentAchievements.fastestElfTime === null){
          currentAchievements.fastestElfTime = (moment().valueOf() - currentJourney.startDate);
        }else if(currentAchievements.fastestElfTime > (moment().valueOf() - currentJourney.startDate)){
          currentAchievements.fastestElfTime = (moment().valueOf() - currentJourney.startDate);
        }
      }else if(difficultyList.indexOf(currentJourney.difficulty) === 2){
        currentAchievements.timesCompletedMan += 1;
        if(currentAchievements.fastestManTime === null){
          currentAchievements.fastestManTime = (moment().valueOf() - currentJourney.startDate);
        }else if(currentAchievements.fastestManTime > (moment().valueOf() - currentJourney.startDate)){
          currentAchievements.fastestManTime = (moment().valueOf() - currentJourney.startDate);
        }
      }else if(difficultyList.indexOf(currentJourney.difficulty) === 3){
        currentAchievements.timesCompletedDwarf += 1;
        if(currentAchievements.fastestDwarfTime === null){
          currentAchievements.fastestDwarfTime = (moment().valueOf() - currentJourney.startDate);
        }else if(currentAchievements.fastestDwarfTime > (moment().valueOf() - currentJourney.startDate)){
          currentAchievements.fastestDwarfTime = (moment().valueOf() - currentJourney.startDate);
        }
      }else if(difficultyList.indexOf(currentJourney.difficulty) === 4){
        currentAchievements.timesCompletedHobbit += 1;
        if(currentAchievements.fastestHobbitTime === null){
          currentAchievements.fastestHobbitTime = (moment().valueOf() - currentJourney.startDate);
        }else if(currentAchievements.fastestHobbitTime > (moment().valueOf() - currentJourney.startDate)){
          currentAchievements.fastestHobbitTime = (moment().valueOf() - currentJourney.startDate);
        }
      };

        Account.updateProfile({
          achievements: currentAchievements
        });

        Account.updateProfile({
          currentJourney: {
            difficulty: null,
            runs: null,
            startDate: null,
            totalMiles: null
          }
        });
      };

    $scope.getProfile();

  });
