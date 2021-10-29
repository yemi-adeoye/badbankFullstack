const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const UserModel = require('../models/User');
const AccountModel = require('../models/Account');
/**
 * @swagger
 * paths:
 *  /api/account/create/:
 *   post:
 *     summary: create a new badbank account
 *     tags:
 *       - Account
 *     description: The user's credentials are collected and  a new account is created
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Account'
 *     responses:
 *       "200":
 *         description: returns an object containing a single user's information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "401":
 *         description: returns an empty object, object not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 */
Router.post(
  '/create/:id',
  [
    auth,
    check('accountType', 'Account type is required').not().isEmpty(),
    check('accountNumber', 'Account numberis required').not().isEmpty(),
  ],
  async (req, res) => {
    if (req.user._id === req.params.id || req.user.role === 'Admin') {
      // get errors
      const errors = validationResult(req);

      console.log(req.body);
      // if errors return bad request
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      let { userId, accountType, accountNumber } = req.body;

      UserModel.findById(accountForUser, (err, user) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: 'Server Error' });
          return;
        }
        if (user) {
          // create the account as the user exists
          const balance = 0;
          const disabled = false;

          // first check if that account exists
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

            account = new AccountModel({
              accountType,
              accountNumber,
              balance,
              disabled,
              user: accountForUser,
            });

            account.save((err, account) => {
              if (err) {
                console.log(err);
                res.status(500).json({ msg: 'Server Error' });
                return;
              }

              if (account) {
              }
            });
          });
        }
      });
    }
  }
);

/*
  
          
      
    }
  });
      */

Router.get('/:id', auth, (req, res) => {
  res.send('get an account by id');
});

/**
 * @swagger
 * paths:
 *  /api//account/deposit/{id}/{amount}/{account}:
 *   put:
 *     summary: deposit an amount into a given account
 *     tags:
 *       - Account
 *     description: When an id is provided the api returns a single user if the id exists else returns an empty object if the user doesnt exist
 *     parameters:
 *       -  in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *       -  in: path
 *          name: amount
 *          required: true
 *          schema:
 *            type: float
 *       -  in: path
 *          name: account
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       "200":
 *         description: returns an object containing a single user's information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "401":
 *         description: returns an empty object, object not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 */
Router.put('/deposit/:userId/:amount/:accountId', (req, res) => {
  //
  res.send('get an account by id');
});

/**
 * @swagger
 * paths:
 *  /api/account/withdraw/{id}/{amount}/{account}:
 *   put:
 *     summary: withdraw an amount from a given account
 *     tags:
 *       - Account
 *     description:  Withdraws a given amount from an account
 *     parameters:
 *       -  in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *       -  in: path
 *          name: amount
 *          required: true
 *          schema:
 *            type: float
 *       -  in: path
 *          name: account
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *       "200":
 *         description: returns an object containing a single user's information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "401":
 *         description: returns an empty object, object not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 */
Router.put('/withdraw/:userId/:amount/:accountId', (req, res) => {
  res.send('get an account by id');
});

module.exports = Router;
