const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  accountType: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
    required: true,
    index: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  transaction: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transaction',
    },
  ],
});

module.exports = mongoose.model('account', AccountSchema);
