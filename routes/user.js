const express = require('express');

const Router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const validate = require('../helper/validate');

const { check, validationResult } = require('express-validator');

const UserModel = require('../models/User');
const AccountModel = require('../models/Account');

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       accountType: string
 *       properties:
 *         type:
 *           type: string
 *           description: Checking or Saving
 *           example: Checking
 *         accountNumber:
 *           type: string
 *           description: A unique bank account number
 *           example: 2073619978
 *         balance:
 *           type: string
 *           description: A unique bank account number
 *           example: 2073619978
 *         disabled:
 *           type: boolean
 *           description: Tells if account is active or not
 *           example: false
 *         user:
 *           $ref: '#/components/schemas/User'
 *           type: array
 *           description: Account owners info
 *         transaction:
 *           $ref: '#/components/schemas/Transaction'
 *           type: array
 *           description: liost of users transactions ids
 *
 *     User:
 *       type: object
 *       properties:
 *         SSN:
 *           type: string
 *           description: A users social security number
 *           example: 119-65-6567
 *         email:
 *           type: string
 *           description: A user's email address
 *           example: ade@loffli.com
 *         fName:
 *           type: string
 *           description: A user's firstname
 *           example: Gilbert
 *         lName:
 *           type: string
 *           description: A user's firstname
 *           example: Gilbert
 *         dob:
 *           type: date
 *           description: A user's date of birth
 *           example: 04-06-1986
 *         role:
 *           type: string
 *           description: Admin user or customer
 *           example:  Admin
 *         password:
 *           type: string
 *           description: User password
 *           example:  secret
 *         account:
 *           $ref: '#/components/schemas/Account'
 *           type: object
 *           description: Admin user or customer
 *         transaction:
 *           $ref: '#/components/schemas/Transaction'
 *           type: array
 *           description: liost of users transactions ids
 *
 */

/**
 * @swagger
 * paths:
 *  /api/user/:
 *   post:
 *     summary: create a new badbank user
 *     tags:
 *       - Users
 *     description: The user's credentials are collected and  a new user is created
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       "200":
 *         description: returns an object containing a single user's information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "400":
 *         description: bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "500":
 *         description: returns an  object, server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
Router.post(
  '/user',
  [
    check('fName', 'First name is required').not().isEmpty(),
    check('lName', 'Last name is required').not().isEmpty(),
    check('SSN', 'Social Security Number is required').not().isEmpty(),
    check('account', 'Account Details is required').not().isEmpty(),
    check('dob', 'Date of birth is required').not().isEmpty(),
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      /**
       * find out if user exists first
       * if user does not exist go ahead and find out if accounts exist
       * if accounts do not exist, create accounts
       * collect ref of accouint and add to user model
       * create user
       */

      let { accountType, accountNumber, balance, disabled } = req.body.account;
      // user does not exist create the user
      const { SSN, email, fName, lName, dob, role, password } = req.body;

      UserModel.findOne({ email }, (err, user) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: 'Server Error' });
          return;
        }

        if (user) {
          console.log('told ya');
          res.status(400).json({ msg: 'User Exists' });
          return;
        }
        // user does not exist, check if accounts exist
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
            disabled,
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
                dob,
                role,
                password,
                disabled,
              });
              user.account = [account._id]; // link to created account

              // hash password
              const salt = await bcrypt.genSalt(10);

              user.password = await bcrypt.hash(password, salt);

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
      });
    } catch (err) {
      console.log(err);
      console.error(err.message);
    }
  }
);

/**
 * @swagger
 * paths:
 *  /api/user/:
 *   delete:
 *     summary: disables a user
 *     tags:
 *       - Users
 *     description: Serches for user with given id if available, deletes the user else returns an error message
 *     parameters:
 *       -  in: body
 *          name: userDetails
 *          description: The userId of user to be deactivated
 *          schema:
 *            type: object
 *            required: object
 *              - userId
 *            properties:
 *              userId:
 *                type: string
 *     responses:
 *       "200":
 *         description: returns a json object with true or false depending on the operation's result
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
 *       "500":
 *         description: returns an  object, server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
Router.delete(
  '/user/',
  [auth, check('userId', 'User Id is required').not().isEmpty()],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    // check to see that the authorized user is the owner of account to be modified or is admin
    if (req.user.role === 'Admin') {
      // is admin, can disable user

      const { userId } = req.body;
      UserModel.findByIdAndUpdate(userId, { disabled: true }, (err, user) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: 'Server Error' });
          return;
        }
        if (user) {
          res.json({ msg: 'User successfully disabled' });
          return;
        }
      });
    } else {
      // is not admin
      res.status(401).json({ msg: "You're not authorized to edit this user" });
      return;
    }
  }
);

/**
 * @swagger
 * paths:
 *  /api/user/:
 *   put:
 *     summary: updates a given user
 *     tags:
 *       - Users
 *     description: Updates a badbank user's detail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
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
 *       "500":
 *         description: returns an  object, server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
Router.put(
  '/user/',
  [auth, check('userId', 'User Id is required').not().isEmpty()],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { newUser } = req.body;
    const id = req.body.userId;

    // check to see that the authorized user is the owner of account to be modified or is admin
    if (req.user._id === id || req.user.role === 'Admin') {
      // is owner

      UserModel.findByIdAndUpdate(id, newUser, (err, user) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: 'Server Error' });
          return;
        }
        res.json({ user });
        return;
      });
    } else {
      // is not owner
      res.status(401).json({ msg: "You're not authorized to edit this user" });
      return;
    }
  }
);

/**
 * @swagger
 * paths:
 *  /api/user/{param}:
 *   get:
 *     summary: gets a single user by param which can be id email or account number
 *     tags:
 *       - Users
 *     description: When an id is provided the api returns a single user if the id exists else returns an empty object if the user doesnt exist
 *     parameters:
 *       -  in: path
 *          name: email
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
Router.get('/user/:param', auth, (req, res) => {
  const emailIdAccount = req.params.param;
  console.log(emailIdAccount);
  let dbObject = {};

  if (validate.isEmail(emailIdAccount)) {
    dbObject.email = emailIdAccount;

    console.log('by email');
    UserModel.findOne(dbObject, { disabled: false })
      .populate({
        path: 'account',
        select: ['accountType', 'accountNumber', 'balance'],
        match: { disabled: false },
      })
      .exec((err, user) => {
        if (err) {
          res.status(500).json({ msg: 'Server Error' });
        }

        if (user) {
          res.json({ user });
          return;
        } else {
          res.status(401).json({ msg: 'User does not exist' });
        }
      });
  } else if (validate.isAccountNumber(emailIdAccount)) {
    console.log('by accouint number');
    dbObject.accountNumber = emailIdAccount;
    AccountModel.findOne(dbObject, 'accountType accountNumber balance', {
      disabled: false,
    })
      .populate('user')
      .exec((err, account) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: 'Server Error' });
          return;
        }

        if (account) {
          account = account.toJSON();
          let user = account.user;
          console.log(account._id);
          const { _id, accountNumber, accountType, balance, created, diabled } =
            account;
          user.account = [
            {
              _id,
              accountType,
              accountNumber,
              balance,
              created,
              diabled,
            },
          ];
          res.json({ user });
          return;
        } else {
          res.status(401).json({ msg: 'User does not exist' });
        }
      });
  } else {
    if (emailIdAccount.length !== 24) {
      res.status(400).json({ mgs: 'invalid parameter' });
      return;
    }
    dbObject._id = emailIdAccount;

    console.log(dbObject);
    UserModel.findById(dbObject)
      .populate({
        path: 'account',
        select: ['accountType', 'accountNumber', 'balance'],
        match: { disabled: false },
      })
      .exec((err, user) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: 'Server Error' });
          return;
        }

        if (user) {
          res.json({ user });
          return;
        } else {
          res.status(401).json({ msg: 'User does not exist' });
        }
      });
  }
});

/**
 * @swagger
 * paths:
 *  /api/users/:
 *   get:
 *     summary: gets all users
 *     tags:
 *       - Users
 *     description: Retrieves all badbank users
 *     parameters:
 *       -  in: path
 *          name: id
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
Router.get('/users', auth, (req, res) => {
  if (req.user.role != 'Admin') {
    res.status(401).json({ msg: 'Youre not authorized to view this' });
    return;
  }
  UserModel.find({ disabled: false })
    .populate({
      path: 'account',
      select: ['accountType', 'accountNumber', 'balance'],
      match: { disabled: false },
    })
    .exec((err, users) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: 'Server Error' });
        return;
      }

      res.json({ users });
      return;
    });
});

module.exports = Router;
