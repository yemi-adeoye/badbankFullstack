const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactedAt: {
    type: Date,
    default: Date.now,
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
  },
  transactedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
});

module.exports = mongoose.model('transaction', TransactionSchema);
