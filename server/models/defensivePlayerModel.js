const mongoose = require('mongoose');

const defensivePlayerSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
  },
  teamName: {
    type: String,
    required: true,
  },
  playerPosition: {
    type: String,
  },
  goals: {
    type: Number,
  },
  assists: {
    type: Number,
  },
  shots: {
    type: Number,
  },
  gameDate: {
    type: String,
  },
  PIM: {
    type: Number,
  },
});

const DefensivePlayer = mongoose.model('DefensivePlayer', defensivePlayerSchema);

module.exports = DefensivePlayer;