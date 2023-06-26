const mongoose = require('mongoose');

const lineupSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  gameDate: {
    type: String,
    required: true,
  },
  forwardLineup: {
    type: [String], // Update the type to an array of strings
    required: true,
    validate: {
      validator: (value) => value.length === 3,
      message: 'Forward lineup must have exactly 3 players',
    },
  },
  defensiveLineup: {
    type: [String], // Update the type to an array of strings
    required: true,
    validate: {
      validator: (value) => value.length === 2,
      message: 'Defensive lineup must have exactly 2 players',
    },
  },
  // Add any additional fields for user selection
});

const Lineup = mongoose.model('Lineup', lineupSchema);

module.exports = Lineup;




