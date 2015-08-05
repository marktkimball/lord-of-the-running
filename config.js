module.exports = {
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'A hard to guess string',
  MONGO_URI: process.env.MONGOLAB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/test',
  STRAVA_SECRET: process.env.STRAVA_SECRET || 'Strava Secret',
};
