const mongoose = require('mongoose');

const forwardLineupSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  gameDate: {
    type: String,
    required: true,
  },
  playerLineup: {
    type: [String],
    required: true,
  },
});

const ForwardLineup = mongoose.model('ForwardLineup', forwardLineupSchema);

module.exports = ForwardLineup;
