const mongoose = require('mongoose');

const forwardPlayerSchema = new mongoose.Schema({
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

const ForwardPlayer = mongoose.model('ForwardPlayer', forwardPlayerSchema);

module.exports = ForwardPlayer;

