const mongoose = require('mongoose');

const gameLineupSchema = new mongoose.Schema({
  teamName:{
    type:String,
    required: true,
  },
  gameDate: {
    type: String,
    required: true,
  },
  lineup: {
    type: [String],
    validate: {
      validator: function (lineup) {
        if (this.position === 'defense') {
          // For defense position, ensure exactly 2 elements in the lineup array
          return Array.isArray(lineup) && lineup.length === 2;
        } else if (this.position === 'forward') {
          // For forward position, ensure exactly 3 elements in the lineup array
          return Array.isArray(lineup) && lineup.length === 3;
        } else {
          // Handle other positions here if needed
          // For now, allow any number of elements for other positions
          return Array.isArray(lineup);
        }
      },
      message: (props) => `${props.path} is invalid for the specified position.`,
    },
    required: true,
  },
  
  type: {
    type: String,
    required: true,
  },

  position: {
    type: String,
    required: true,
  },
});

const GameLineup = mongoose.model('GameLineup', gameLineupSchema);

module.exports = GameLineup;

