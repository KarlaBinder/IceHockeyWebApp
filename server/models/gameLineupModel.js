const mongoose = require('mongoose');

const gameLineupSchema = new mongoose.Schema({
    gameDate: {
      type: Date,
      required: true,
    },
    lineup: {
      type: [String],
      required: true,
    },
  });
  

const GameLineup = mongoose.model('GameLineup', gameLineupSchema);


module.exports = GameLineup;
