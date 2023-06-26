const mongoose = require('mongoose');

const forwardSchema = new mongoose.Schema({
    gameDate: {
      type: Date,
      required: true,
    },
    lineup: {
      type: [String],
      required: true,
    },
  });
  

const Forward = mongoose.model('Forward', forwardSchema);


module.exports = Forward;