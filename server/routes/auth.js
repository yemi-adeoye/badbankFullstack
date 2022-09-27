const express = require('express');

const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const faker = require('faker');

const { check, validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');

const UserModel = require('../models/User');
const AccountModel = require('../models/Account');

Router.get('/', auth, async (req, res) => {
  //console.log('req.user._id');
  UserModel.findById(req.user._id, '-password').exec((err, user) => {
    console.log('got here');
    if (err) {
      res.status(400).json({ msg: 'Not Authorized' });
      console.log('error');
      return;
    }
    if (user) {
      res.json({ user });
      console.log('found');
      return;
    } else {
      console.log('not found');
      res.status(400).json({ msg: 'Not Authorized' });
    }
  });
});

Router.post('/login-google', async (req, res) => {
  const id =
    '347436993648-tgdrqu1589ho2j2p1c6q30rb8r67253j.apps.googleusercontent.com';
  const client = new OAuth2Client(id);
  const { token } = req.body;
  console.log(token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,

      audience: id, // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();

    const { email, family_name: lName, given_name: fName } = payload;

    console.log({ payload });

    // find the user if he exists if not register the user
    UserModel.findOne({ email }, async (err, user) => {
      console.log('finding user..');
      if (err) {
        res.status(500).json({ msg: 'Server Error' });
        return;
      }
      console.log(user);

      if (!user) {
        console.log('we shall create the user');
        const accountNumber = faker.finance.account();
        const SSN = faker.finance.account() + '12';
        accountType = 'Savings';

        AccountModel.findOne({ accountNumber }, (err, account) => {
          if (err) {
            console.log(err);
            res.status(500).json({ msg: 'Server Error' });
            return;
          }

          if (account) {
            res.status(400).json({ msg: 'Account exists' });
            return;
          }
          // account doesnt exist create it
          balance = 0; // initialize account balance

          account = new AccountModel({
            accountType,
            accountNumber,
            balance,
            disabled: false,
          });

          // create the account
          account.save(async (err, account) => {
            if (err) {
              res.status(500).json({ msg: 'Server Error' });
              return;
            }
            // if account has been successfully created, insert user
            if (account) {
              console.log(account._id);

              user = new UserModel({
                SSN,
                email,
                fName,
                lName,
                role: 'user',
                password: '*',
                disabled: false,
              });
              user.account = [account._id]; // link to created account

              user.save((err, user) => {
                if (err) {
                  console.log(err);

                  res.status(500).json({ msg: 'Server Error' });

                  return;
                }
                if (user) {
                  // add reference of user to account
                  account.user = user._id;

                  account.save((err, account) => {
                    if (err) {
                      console.log(err);

                      res.status(500).json({ msg: 'Server Error' });

                      return;
                    }
                  });

                  // user has been created, create a jwt token and send
                  const payload = {
                    user: {
                      _id: user.id,
                      email: user.email,
                      password: user.password,
                    },
                  };

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
                  console.log(user);
                }
              });
            }
          });
        });

        return;
      } else {
        console.log('We shall log the user in');
        const payload = {
          user: {
            _id: user.id,
            email: user.email,
            password: user.password,
          },
        };

        jwt.sign(
          payload,
          config.get('jwtSecret'),
          {
            expiresIn: 36000,
          },
          (err, token) => {
            if (err) throw err;
            res.json({ user, token });
            return;
          }
        );
        console.log(user);
      }
    });
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    //res.json({ payload });
  } catch (err) {
    console.log(err);
  }
});

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
      res.status(400).json({ errors: errors.array() });
      return;
    }

    UserModel.findOne({ email }, async (err, user) => {
      if (err) {
        res.status(500).json({ msg: 'Server Error' });
        return;
      }

      if (!user) {
        res.status(400).json({ msg: 'Invalid Credentials' });
        return;
      } else {
        if (user.disabled !== true) {
          const isMatch = await bcrypt.compare(password, user.password);

          if (isMatch) {
            const payload = {
              user: {
                _id: user.id,
                email: user.email,
                password: user.password,
              },
            };
            jwt.sign(
              payload,
              config.get('jwtSecret'),
              {
                expiresIn: 36000,
              },
              (err, token) => {
                if (err) throw err;
                res.json({ user, token });
                return;
              }
            );
          }
        } else {
          res.status(400).json({ msg: 'User disabled' });
          return;
        }
      }
    });
  }
);

module.exports = Router;
