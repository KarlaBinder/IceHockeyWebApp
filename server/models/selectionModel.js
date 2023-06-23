const mongoose = require('mongoose');

const userSelectionSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
  },
  gameDate: {
    type: Date,
    required: true,
  },
  forwardLineup: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        // Add any additional fields for forward player attributes
      },
    ],
    required: true,
    validate: {
      validator: (value) => value.length === 3,
      message: 'Forward lineup must have exactly 3 players',
    },
  },
  defensiveLineup: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        // Add any additional fields for defensive player attributes
      },
    ],
    required: true,
    validate: {
      validator: (value) => value.length === 2,
      message: 'Defensive lineup must have exactly 2 players',
    },
  },
  // Add any additional fields for user selection
});

const UserSelection = mongoose.model('UserSelection', userSelectionSchema);

module.exports = UserSelection;


