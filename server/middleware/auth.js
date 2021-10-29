const express = require('express');

const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    res.status(401).json({ msg: 'Not Authorized' });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    console.log(decoded.user._id);
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Not Authorized' });
    return;
  }
};
