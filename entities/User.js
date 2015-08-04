var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
  // add any additional properties here as well as routes/auth.js and routes/profile.js
  // newProperty: String,
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  displayName: String,
  name: String,
  picture: String,
  location: String,
  runs: Array,
  currentJourney: {
    totalMiles: Number,
    runs: Array,
    startDate: Number,
    difficulty: String
  },
  achievements: {
    fastestWizardTime: Number,
    fastestElfTime: Number,
    fastestManTime: Number,
    fastestDwarfTime: Number,
    fastestHobbitTime: Number,
    timesCompletedWizard: Number,
    timesCompletedElf: Number,
    timesCompletedMan: Number,
    timesCompletedDwarf: Number,
    timesCompletedHobbit: Number
  },
  totalMiles: Number,
  joinDate: String,
  lastVisitDate: String,
  startQuestDate: String,
  currentPosition: String,
  strava: String,
  stravaToken: String,
  facebook: String,
  foursquare: String,
  google: String,
  github: String,
  linkedin: String,
  live: String,
  yahoo: String,
  twitter: String
});

userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
