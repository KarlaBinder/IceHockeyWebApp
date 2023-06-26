const mongoose = require('mongoose');

const defensivePlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const DefensivePlayer = mongoose.model('DefensivePlayer', defensivePlayerSchema);

module.exports = DefensivePlayer;