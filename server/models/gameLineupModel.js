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
          
          return Array.isArray(lineup) && lineup.length === 2;
        } else if (this.position === 'forward') {
          
          return Array.isArray(lineup) && lineup.length === 3;
        } else {
          
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

