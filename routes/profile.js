var express = require('express');
var router = express.Router();
var User = require('../entities/User');
var config = require('../config');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;
var _ = require('lodash');

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
router.route('/me')
  .all(ensureAuthenticated)
  .get(function(req, res) {
    User.findById(req.user, function(err, user) {
      res.send(user);
    });
  })
  .put(function(req, res) {
    User.findById(req.user, function(err, user) {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      // add any new user properties here as well as entities/User.js and routes/profile.js
      // user.newProperty = req.body.newProperty || user.newProperty
      user.displayName = req.body.displayName || user.displayName;
      user.email = req.body.email || user.email;
      user.name = req.body.name || user.name;
      user.picture = req.body.picture || user.picture;
      user.location = req.body.location || user.location;
      user.runs = req.body.runs || user.runs;
      user.currentJourney = req.body.currentJourney || user.currentJourney;
      user.achievements = req.body.achievements || user.achievements;
      user.joinDate = req.body.joinDate || user.joinDate;
      user.lastVisitDate = req.body.lastVisitDate || user.lastVisitDate;
      user.totalMiles = req.body.totalMiles || user.totalMiles;
      user.currentPosition = req.body.currentPosition || user.currentPosition;
      user.save(function(err) {
        res.status(200).end();
      });
    });
  });

  router.route('/leaders')
    .all(ensureAuthenticated)
    .get(function(req, res){
      User.find({}, function(err, users){
        var usersAchievements = _.chain(users)
          .map(function(user){
            var timesCompleted = 0;
            var fastestCompletedDifficulty = null;
            var fastestCompletedTime = null;

            if(user.achievements.timesCompletedWizard || user.achievements.timesCompletedElf || user.achievements.timesCompletedMan || user.achievements.timesCompletedDwarf || user.achievements.timesCompletedHobbit){
              timesCompleted = user.achievements.timesCompletedWizard + user.achievements.timesCompletedElf + user.achievements.timesCompletedMan + user.achievements.timesCompletedDwarf + user.achievements.timesCompletedHobbit;
              fastestCompletedDifficulty = "Wizard";
              fastestCompletedTime = user.achievements.fastestWizardTime;
            }

            //Check for fastest completed time
            if(user.achievements.fastestElfTime && user.achievements.fastestElfTime <= fastestCompletedTime || (fastestCompletedTime === null && user.achievements.fastestElfTime)){
              fastestCompletedTime = user.achievements.fastestElfTime;
              fastestCompletedDifficulty = "Elf";
            }else if(user.achievements.fastestManTime && user.achievements.fastestManTime <= fastestCompletedTime || (fastestCompletedTime === null && user.achievements.fastestManTime)){
              fastestCompletedTime = user.achievements.fastestManTime;
              fastestCompletedDifficulty = "Man";
            }else if(user.achievements.fastestDwarfTime && user.achievements.fastestDwarfTime <= fastestCompletedTime || (fastestCompletedTime === null && user.achievements.fastestDwarfTime)){
              fastestCompletedTime = user.achievements.fastestDwarfTime;
              fastestCompletedDifficulty = "Dwarf";
            }else if(user.achievements.fastestHobbitTime && user.achievements.fastestHobbitTime <= fastestCompletedTime || (fastestCompletedTime === null && user.achievements.fastestHobbitTime)){
              fastestCompletedTime = user.achievements.fastestHobbitTime;
              fastestCompletedDifficulty = "Hobbit";
            }

            //Return mapped user
            return {displayName: user.displayName,
              fastestWizardTime: user.achievements.fastestWizardTime,
              fastestElfTime: user.achievements.fastestElfTime,
              fastestManTime: user.achievements.fastestManTime,
              fastestDwarfTime: user.achievements.fastestDwarfTime,
              fastestHobbitTime: user.achievements.fastestHobbitTime,
              timesCompletedWizard: user.achievements.timesCompletedWizard,
              timesCompletedElf: user.achievements.timesCompletedElf,
              timesCompletedMan: user.achievements.timesCompletedMan,
              timesCompletedDwarf: user.achievements.timesCompletedDwarf,
              timesCompletedHobbit: user.achievements.timesCompletedHobbit,
              fastestCompletedTime: fastestCompletedTime,
              fastestCompletedDifficulty: fastestCompletedDifficulty,
              timesCompleted: timesCompleted
            }
          })
          .value();

        //Initialize empty leaderboard
        var leaders = {
          fastestWizardTime: null,
          fastestElfTime: null,
          fastestManTime: null,
          fastestDwarfTime: null,
          fastestHobbitTime: null,
          timesCompletedWizard: null,
          timesCompletedElf: null,
          timesCompletedMan: null,
          timesCompletedDwarf: null,
          timesCompletedHobbit: null,
          fastestCompletedTime: null,
          fastestCompletedDifficulty: null,
          timesCompleted: null
        };

        //CHECK FOR NEW LEADERS
        _.forEach(usersAchievements, function(el){
          if(el.fastestWizardTime && leaders.fastestWizardTime === null){
            leaders.fastestWizardTime = {displayName: el.displayName, fastestWizardTime: el.fastestWizardTime};
          }else if(el.fastestWizardTime && (el.fastestWizardTime < leaders.fastestWizardTime.fastestWizardTime)){
            leaders.fastestWizardTime = {displayName: el.displayName, fastestWizardTime: el.fastestWizardTime};
          }
          if(el.fastestElfTime && leaders.fastestElfTime === null){
            leaders.fastestElfTime = {displayName: el.displayName, fastestElfTime: el.fastestElfTime};
          }else if(el.fastestElfTime && (el.fastestElfTime < leaders.fastestElfTime.fastestElfTime)){
            leaders.fastestElfTime = {displayName: el.displayName, fastestElfTime: el.fastestElfTime};
          }
          if(el.fastestManTime && leaders.fastestManTime === null){
            leaders.fastestManTime = {displayName: el.displayName, fastestManTime: el.fastestManTime};
          }else if(el.fastestManTime && (el.fastestManTime < leaders.fastestManTime.fastestManTime)){
            leaders.fastestManTime = {displayName: el.displayName, fastestManTime: el.fastestManTime};
          }
          if(el.fastestDwarfTime && leaders.fastestDwarfTime === null){
            leaders.fastestDwarfTime = {displayName: el.displayName, fastestDwarfTime: el.fastestDwarfTime};
          }else if(el.fastestDwarfTime && (el.fastestDwarfTime < leaders.fastestDwarfTime.fastestDwarfTime)){
            leaders.fastestDwarfTime = {displayName: el.displayName, fastestDwarfTime: el.fastestDwarfTime};
          }
          if(el.fastestHobbitTime && leaders.fastestHobbitTime === null){
            leaders.fastestHobbitTime = {displayName: el.displayName, fastestHobbitTime: el.fastestHobbitTime};
          }else if(el.fastestHobbitTime && (el.fastestHobbitTime < leaders.fastestHobbitTime.fastestHobbitTime)){
            leaders.fastestHobbitTime = {displayName: el.displayName, fastestHobbitTime: el.fastestHobbitTime};
          }
          if(el.timesCompletedWizard && leaders.timesCompletedWizard === null){
            leaders.timesCompletedWizard = {displayName: el.displayName, timesCompletedWizard: el.timesCompletedWizard};
          }else if(el.timesCompletedWizard && (el.timesCompletedWizard > leaders.timesCompletedWizard.timesCompletedWizard)){
            leaders.timesCompletedWizard = {displayName: el.displayName, timesCompletedWizard: el.timesCompletedWizard};
          }
          if(el.timesCompletedElf && leaders.timesCompletedElf === null){
            leaders.timesCompletedElf = {displayName: el.displayName, timesCompletedElf: el.timesCompletedElf};
          }else if(el.timesCompletedElf && (el.timesCompletedElf > leaders.timesCompletedElf.timesCompletedElf)){
            leaders.timesCompletedElf = {displayName: el.displayName, timesCompletedElf: el.timesCompletedElf};
          }
          if(el.timesCompletedMan && leaders.timesCompletedMan === null){
            leaders.timesCompletedMan = {displayName: el.displayName, timesCompletedMan: el.timesCompletedMan};
          }else if(el.timesCompletedMan && (el.timesCompletedMan > leaders.timesCompletedMan.timesCompletedMan)){
            leaders.timesCompletedMan = {displayName: el.displayName, timesCompletedMan: el.timesCompletedMan};
          }
          if(el.timesCompletedDwarf && leaders.timesCompletedDwarf === null){
            leaders.timesCompletedDwarf = {displayName: el.displayName, timesCompletedDwarf: el.timesCompletedDwarf};
          }else if(el.timesCompletedDwarf && (el.timesCompletedDwarf > leaders.timesCompletedDwarf.timesCompletedDwarf)){
            leaders.timesCompletedDwarf = {displayName: el.displayName, timesCompletedDwarf: el.timesCompletedDwarf};
          }
          if(el.timesCompletedHobbit && leaders.timesCompletedHobbit === null){
            leaders.timesCompletedHobbit = {displayName: el.displayName, timesCompletedHobbit: el.timesCompletedHobbit};
          }else if(el.timesCompletedHobbit && (el.timesCompletedHobbit > leaders.timesCompletedHobbit.timesCompletedHobbit)){
            leaders.timesCompletedHobbit = {displayName: el.displayName, timesCompletedHobbit: el.timesCompletedHobbit};
          }
          if(el.fastestCompletedTime && leaders.fastestCompletedTime === null){
            leaders.fastestCompletedTime = {displayName: el.displayName, fastestCompletedTime: el.fastestCompletedTime};
            leaders.fastestCompletedDifficulty = el.fastestCompletedDifficulty;
          }else if(el.fastestCompletedTime && (el.fastestCompletedTime < leaders.fastestCompletedTime.fastestCompletedTime)){
            leaders.fastestCompletedTime = {displayName: el.displayName, fastestCompletedTime: el.fastestCompletedTime};
            leaders.fastestCompletedDifficulty = el.fastestCompletedDifficulty;
          }
          if(el.timesCompleted && leaders.timesCompleted === null){
            leaders.timesCompleted = {displayName: el.displayName, timesCompleted: el.timesCompleted};
          }else if(el.timesCompleted && (el.timesCompleted > leaders.timesCompleted.timesCompleted)){
            leaders.timesCompleted = {displayName: el.displayName, timesCompleted: el.timesCompleted};
          }
        });

        res.send(leaders);
      });
    });

module.exports = router;
