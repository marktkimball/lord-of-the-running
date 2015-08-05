var qs = require('querystring');
var express = require('express');
var router = express.Router();
var request = require('request');
var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('../config');
var strava = require('strava-v3');
var mongoose = require('mongoose');
var User = require('../entities/User');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createToken(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(14, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */

router.route('/login')
  .post(function(req, res, next) {
    User.findOne({ email: req.body.email }, '+password', function(err, user, next) {
      if (err) return next(err);
      if (!user) {
        return res.status(401).send({ message: 'Wrong email and/or password' });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ message: 'Wrong email and/or password' });
        }

        if(user.runs.length === 0){
          var lastRunDate = user.joinDate;
        }else{
          var lastRunPosition = user.runs.length - 1;
          var lastRunDate = moment(user.runs[lastRunPosition].date).valueOf();
        }

        if(user.strava){
          strava.athlete.listActivities({id : user.strava, access_token : user.stravaToken, after: Math.floor(lastRunDate / 1000)}, function(err, payload){
            console.log("Err: " , err);
            user.lastVisitDate = moment().valueOf();
            var runData = payload;
            if(runData.length > 0){
              for(var i = 0; i < runData.length; i++){
                user.totalMiles += runData[i].distance * 0.000621371;
                if(user.currentJourney.difficulty){
                  user.currentJourney.totalMiles += runData[i].distance * 0.000621371;
                }
                if(runData[i].type === 'Run'){
                  var run = {
                    id: runData[i].id,
                    date: runData[i].start_date,
                    distance: runData[i].distance * 0.000621371,
                    time: runData[i].elapsed_time,
                    pace: runData[i].elapsed_time / (runData[i].distance * 0.000621371),
                    title: runData[i].name,
                    elevation: runData[i].total_elevation_gain * 3.28084,
                    location: runData[i].location_city
                  };
                  user.runs.push(run);
                  if(user.currentJourney.difficulty){
                    user.currentJourney.runs.push(run);
                  }
                };
              };
            };
            user.save(function(err) {
              res.send({token: createToken(user), user: user});
            });
          });
        } else{
          res.send({ token: createToken(user) });
        }
      });
    });
  });

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
 router.route('/signup')
  .post(function(req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ message: 'Email is already taken' });
      }
      var user = new User({
        // add new propertied for user here as well as entities/user.js and routes/profile.js
        // newProperty: req.body.newProperty,
        displayName: req.body.displayName,
        email: req.body.email,
        password: req.body.password,
        joinDate: moment().valueOf(),
        totalMiles : 0,
        currentJourney : {},
        achievements : {
          fastestCompletionTime: null,
          fastestCompletionDifficulty: null,
          highestCompletionDifficulty: null,
          timesCompleted: 0,
          fastestWizardTime: null,
          fastestElfTime: null,
          fastestManTime: null,
          fastestDwarfTime: null,
          fastestHobbitTime: null,
          timesCompletedWizard: 0,
          timesCompletedElf: 0,
          timesCompletedMan: 0,
          timesCompletedDwarf: 0,
          timesCompletedHobbit: 0
        },
        name: "",
        currentPosition: ""
      });
      user.save(function() {
        res.send({ token: createToken(user) });
      });
    });
  });

/*
 |--------------------------------------------------------------------------
 | Login in Strava
 |--------------------------------------------------------------------------
 */
 router.route('/strava')
  .post(function(req, res){
    var url = strava.oauth.getRequestAccessURL({scope: "public"});
    request.post({url: url}, function(err, httpResponse, body){
      var code = req.param('code');

      strava.oauth.getToken(code, function(err, athlete) {
        // Step 3a. Link user accounts.
        if (req.headers.authorization) {
          User.findOne({ strava: athlete.athlete.id }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Strava account that belongs to you' });
            }
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.strava = athlete.athlete.id;
              user.stravaToken = athlete.access_token;
              user.picture = user.picture || athlete.athlete.profile.replace('sz=50', 'sz=200');
              user.displayName = user.displayName;
              user.name = athlete.athlete.firstname.concat(" ").concat(athlete.athlete.lastname);
              user.location = athlete.athlete.city.concat(", ").concat(athlete.athlete.state);
              user.save(function() {
                var token = createToken(user);
                res.send({ token: token });
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          User.findOne({ strava: athlete.athlete.id }, function(err, existingUser) {
            if (existingUser) {
              return res.send({ token: createToken(existingUser) });
            }
            var user = new User();
            user.strava = athlete.athlete.id;
            user.stravaToken = athlete.access_token;
            user.picture = athlete.athlete.profile.replace('sz=50', 'sz=200');
            user.displayName = user.displayName || athlete.athlete.firstname.concat(athlete.athlete.lastname);
            user.name = athlete.athlete.firstname.concat(" ").concat(athlete.athlete.lastname);
            user.save(function(err) {
              var token = createToken(user);
              res.send({ token: token });
            });
          });
        }

        });
    })
  });

/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
 router.route('/unlink/:provider')
  .all(ensureAuthenticated)
  .get(function(req, res) {
    var provider = req.params.provider;
    User.findById(req.user, function(err, user) {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      user[provider] = undefined;
      user.save(function() {
        res.status(200).end();
      });
    });
  });

module.exports = router;
