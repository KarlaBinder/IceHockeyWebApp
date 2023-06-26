const mongoose = require('mongoose');

const forwardLineupStatsSchema = new mongoose.Schema({
  gameDate: {
    type: String,
    required: true,
  },
  
});

const ForwardLineupStats = mongoose.model('ForwardLineupStats', forwardLineupStatsSchema);

module.exports = ForwardLineupStats;
