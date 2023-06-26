const mongoose = require('mongoose');

const forwardPlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const ForwardPlayer = mongoose.model('ForwardPlayer', forwardPlayerSchema);

module.exports = ForwardPlayer;
