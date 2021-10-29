const express = require('express');

const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const { check, validationResult } = require('express-validator');

const UserModel = require('../models/User');

Router.post(
  '/',
  [
    check('password', 'Password is required').exists(),
    check('email', 'Email is required').isEmail(),
  ],
  (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    console.log(req.body);

    if (!errors.isEmpty()) {
      console.log('object');
      res.status(400).json({ errors: errors.array() });
      return;
    }

    UserModel.findOne({ email }, async (err, user) => {
      console.log('finding user..');
      if (err) {
        res.status(500).send('Server Error');
        return;
      }
      console.log(user);
      if (user) {
        console.log('im here');
      }
      if (!user) {
        res.status(400).send('Invalid Credentials');
        return;
      } else {
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
          const payload = { user };
          jwt.sign(
            payload,
            config.get('jwtSecret'),
            {
              expiresIn: 36000,
            },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
              return;
            }
          );
        }
      }
    });
  }
);

module.exports = Router;
