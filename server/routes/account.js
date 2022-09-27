const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const UserModel = require('../models/User');
const AccountModel = require('../models/Account');
const TransactionModel = require('../models/Transaction');
/**
 * @swagger
 * paths:
 *  /api/account/:
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
 *       "400":
 *         description: returns an object, bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "401":
 *         description: returns an object, not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       "500":
 *         description: returns an server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 */
Router.post(
  '/',
  [
    auth,
    check('accountType', 'Account type is required').not().isEmpty(),
    check('accountNumber', 'Account number is required').not().isEmpty(),
    check('userId', 'User Id is required').not().isEmpty(),
  ],
  async (req, res) => {
    if (
      req.user._id.toString() === req.body.userId ||
      req.user.role === 'Admin'
    ) {
      // get errors
      const errors = validationResult(req);

      // if errors return bad request
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      let { userId, accountType, accountNumber } = req.body;

      UserModel.findById(userId, (err, user) => {
        if (err) {
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
              user: userId,
            });

            account.save((err, account) => {
              if (err) {
                res.status(500).json({ msg: 'Server Error' });
                return;
              }

              if (account) {
                // add account reference to to user account
                UserModel.findByIdAndUpdate(
                  user._id,
                  { account: [...user.account, account._id] },
                  (err, user) => {
                    if (err) {
                      res.status(500).json({ msg: 'Server Error' });
                      return;
                    }
                    if (user) {
                      res.json({ msg: 'Account added sucessfully' });
                      return;
                    } else {
                      res.status(500).json({ msg: 'Server Error' });
                    }
                  }
                );
              }
            });
          });
        }
      });
    } else {
      res.status(401).json({ msg: 'Not allowed' });
    }
  }
);

/**
 * @swagger
 * paths:
 *  /api/account/{id}/:
 *   get:
 *     summary: get one account by account id
 *     tags:
 *       - Account
 *     description: When an id is provided the api returns a single account if the id exists else returns an empty object if the account doesnt exist
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
 *               $ref: '#/components/schemas/Account'
 *       "500":
 *         description: returns an  object, server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 */
Router.get('/:id', auth, (req, res) => {
  const id = req.params.id;
  AccountModel.findById(id)
    .populate('user')
    .exec((err, account) => {
      if (err) {
        res.status(500).json({ msg: 'Server Error' });
        return;
      } else if (account) {
        res.json({ account });
        return;
      } else {
        res.status(500).json({ msg: 'Not found' });
      }
    });
});

/**
 * @swagger
 * paths:
 *  /api/account/:
 *   get:
 *     summary: get all accounts for a given user
 *     tags:
 *       - Account
 *     description: When an id is provided the api returns a single account if the id exists else returns an empty object if the account doesnt exist
 *     responses:
 *       "200":
 *         description: returns an array containing a  user's account(s)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *       "500":
 *         description: returns an  object, server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *
 */
Router.get('/', auth, (req, res) => {
  AccountModel.find({ user: req.user._id })
    .populate({ path: 'user', select: 'fName lName' })
    .exec((err, account) => {
      if (err) {
        res.status(500).json({ msg: 'Server Error' });
        return;
      } else if (account) {
        res.json({ account });
        return;
      } else {
        res.status(500).json({ msg: 'Not found' });
      }
    });
});

/**
 * @swagger
 * paths:
 *  /api/account/:
 *   put:
 *     summary: deposit or withdraw an amount into a given account
 *     tags:
 *       - Account
 *     description: Modifies the balance of a users account
 *     parameters:
 *       -  in: body
 *          name: accountDetails
 *          description: The logged in user's id, the account to modify's id and the amount
 *          schema:
 *            type: object
 *            required: object
 *              - userId
 *              - accountId
 *              - action
 *              - amount
 *            properties:
 *              userId:
 *                type: string
 *              accountId:
 *                type: string
 *              amount:
 *                type: float
 *              action:
 *                type: string
 *     responses:
 *       "200":
 *         description: returns an object containing a single user's information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "400":
 *         description: returns an error object, bad request
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
 *
 */
Router.put(
  '/',
  [
    auth,
    check('accountNumber', 'Account number is required').not().isEmpty(),
    check('amount', 'Amount is required').not().isEmpty(),
    check('action', 'Action is required').not().isEmpty(),
  ],
  async (req, res) => {
    //deposit or withdraw a given amount

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    let { accountNumber, amount, action } = req.body;

    amount = Number(amount);

    AccountModel.findOne({ accountNumber }, (err, account) => {
      if (err) {
        res.status(500).json({ msg: 'Server Error' });
        return;
      }

      if (account) {
        let accountBalance = Number(account.balance);

        let newBalance;

        switch (action) {
          case 'deposit':
            newBalance = accountBalance + amount;

            break;

          case 'withdraw':
            if (accountBalance < amount) {
              res.status(400).json({ msg: 'Insufficient Funds' });
              return;
            }
            if (
              account.user.toString() === req.user._id ||
              req.user.role === 'Admin' ||
              action === 'deposit'
            ) {
              // we good
            } else {
              res.status(401).json({ msg: 'Not allowed' });
              return;
            }

            newBalance = accountBalance - amount;

            break;
          default:
            res.status(400).json({ msg: 'Wrong parameter' });

            return;
            break;
        }

        AccountModel.findOneAndUpdate(
          { accountNumber },
          { balance: newBalance },
          (err, account) => {
            if (err) {
              res.status(500).json({ msg: 'Server Error' });
              return;
            }

            if (account) {
              const transactionType =
                action.toLowerCase() === 'deposit' ? 'credit' : 'debit';

              // update the transaction model
              const transactionDetails = {
                transactedBy: req.user._id,
                beneficiary: account.user,
                accountId: account._id,
                amount: Number(amount),
                transactionType,
              };
              const transaction = new TransactionModel(transactionDetails);

              transaction.save((err, transaction) => {
                if (err) {
                  res.status(500).json({ msg: 'Server Error' });

                  return;
                }
                if (transaction) {
                  // get the user

                  UserModel.findById(
                    transaction.beneficiary,
                    (err, beneficiary) => {
                      if (err) {
                        res.status(500).json({ msg: 'Server Error' });
                      }
                      // add reference of transaction to the account and user models
                      if (beneficiary) {
                        UserModel.findByIdAndUpdate(
                          transaction.beneficiary,
                          {
                            transaction: [
                              ...beneficiary.transaction,
                              transaction.id,
                            ],
                          },
                          (err, updatedBeneficiary) => {
                            if (err) {
                              res.status(500).json({ msg: 'Server Error' });
                              return;
                            }
                            if (updatedBeneficiary) {
                              // add transaction reference to the transactedby user
                              UserModel.findById(
                                transaction.transactedBy,
                                (err, transactedBy) => {
                                  if (err) {
                                    res
                                      .status(500)
                                      .json({ msg: 'Server Error' });
                                    return;
                                  }
                                  if (transactedBy) {
                                    UserModel.findByIdAndUpdate(
                                      transaction.transactedBy,
                                      {
                                        transaction: [
                                          ...transactedBy.transaction,
                                          transaction.id,
                                        ],
                                      },
                                      (err, user) => {
                                        if (err) {
                                          res
                                            .status(500)
                                            .json({ msg: 'Server Error' });
                                          return;
                                        }
                                        if (user) {
                                          let newTransaction = [
                                            ...account.transaction,
                                            transaction._id,
                                          ];
                                          UserModel;
                                          AccountModel.findByIdAndUpdate(
                                            transaction.accountId,
                                            {
                                              transaction: newTransaction,
                                            },
                                            (err, account) => {
                                              if (err) {
                                                res.status(500).json({
                                                  msg: 'Server Error',
                                                });
                                                return;
                                              }
                                              if (account) {
                                                res.json({
                                                  msg: `${action} ok`,
                                                });
                                              }
                                            }
                                          );
                                        }
                                      }
                                    );
                                  } else {
                                    res.status(500).json({
                                      msg: 'Cant find who did transaction',
                                    });
                                    return;
                                  }
                                }
                              );
                            }
                          }
                        );
                      }
                    }
                  );
                } else {
                  res.status(500).json({ msg: 'Server Error' });

                  return;
                }
              });
            }
          }
        );
      } else {
        res.status(400).json({ msg: 'Cannot get account' });
        return;
      }
    });
  }
);

/**
 * @swagger
 * paths:
 *  /api/account/:
 *   delete:
 *     summary: disable a user's account
 *     tags:
 *       - Account
 *     description:  Disables a user's account
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
Router.delete(
  '/',
  [auth, check('accountId', 'Account number is required').not().isEmpty()],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { accountId } = req.body;

    if (req.user.role === 'Admin') {
      AccountModel.findByIdAndUpdate(
        accountId,
        { disabled: true },
        (err, account) => {
          if (err) {
            res.status(500).json({ msg: 'Server Error' });
            return;
          }
          if (account) {
            res.json({ msg: 'Account deactivated okay' });
            return;
          } else {
            res.status(400).json({ msg: 'Account not found' });
            return;
          }
        }
      );
    } else {
      res.status(401).json({ msg: 'Not Authorized' });
    }
  }
);

module.exports = Router;
