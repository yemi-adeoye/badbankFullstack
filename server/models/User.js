const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  SSN: {
    type: String,
    required: true,
    unique: true,
  },

  dob: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    default: 'user',
  },
  created: {
    type: Date,
    default: Date.now,
  },
  account: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'account',
      required: true,
    },
  ],
  transaction: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'transaction',
    },
  ],
});

module.exports = mongoose.model('user', UserSchema);
