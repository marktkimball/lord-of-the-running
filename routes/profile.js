var express = require('express');
var router = express.Router();
var User = require('../entities/User');
var config = require('../config');
var ensureAuthenticated = require('./helpers').ensureAuthenticated;

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
router.route('/me')
  .all(ensureAuthenticated)
  .get(function(req, res) {
    User.findById(req.user, function(err, user) {
      console.log(user);
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
      console.log('acheivements: ', user.achievements);
      user.save(function(err) {
        res.status(200).end();
      });
    });
  });

module.exports = router;
