const express = require('express');
const Router = express.Router();
const auth = require('../middleware/auth');

const { check, validationResult } = require('express-validator');

const UserModel = require('../models/User');
const AccountModel = require('../models/Account');
const TransactionModel = require('../models/Transaction');
/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         transactedBy:
 *           type: string
 *           description: A unique identifier
 *           example: ae8a0816-47df-4b5a-a3a2-84b5daad737c
 *         beneficiary:
 *           type: string
 *           description: A unique identifier
 *           example: ae8a0816-47df-4b5a-a3a2-84b5daad737c
 *         account:
 *           type: string
 *           description: A unique identifier
 *           example: ae8a0816-47df-4b5a-a3a2-84b5daad737c
 *         amount:
 *           type: float
 *           description: Amount involved in transaction
 *           example: 450
 *         transactionType:
 *           type: string
 *           description: Deposit or Withdrawal
 *           example: Deposit
 *         transactedAt:
 *           type: date
 *           description: Date transaction was carried out
 *           example: 05-19-2021
 *
 *
 */

/**
 * @swagger
 * paths:
 *  /api/transaction:
 *   post:
 *     summary: insert a new transaction
 *     tags:
 *       - Transaction
 *     description: When an id is provided the api returns a single user if the id exists else returns an empty object if the user doesnt exist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
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
  '/',
  [
    auth,
    check('transactionType', 'Transaction Type is required').not().isEmpty(),

    check('amount', 'Amount is required').not().isEmpty(),
    check('accountId', 'Account ID is required').not().isEmpty(),
    check(
      'transactedBy',
      'User ID of person carrying out transaction is required'
    )
      .not()
      .isEmpty(),
    check('beneficiary', "Beneficiary's user Id is required").not().isEmpty(),
  ],

  (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const transactionDetails = req.body;

    const transaction = new TransactionModel(transactionDetails);

    transaction.save((err, transaction) => {
      if (err) {
        console.log(err);

        res.status(500).json({ msg: 'Server Error' });

        return;
      }
      if (transaction) {
        console.log(transaction);
        res.json({ msg: 'Transaction Saved' });
      }
    });
  }
);

/**
 * @swagger
 * paths:
 *  /api/transaction/{id}/{type}/:
 *   get:
 *     summary: get transactions of a user by type
 *     tags:
 *       - Transaction
 *     description: When an id is provided the api returns a single user if the id exists else returns an empty object if the user doesnt exist
 *     parameters:
 *       -  in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *       -  in: path
 *          name: type
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
Router.get('/', auth, (req, res) => {
  const id = req.user._id;
  //const type = req.params.type;

  if (req.user._id === id || req.user.role.toLowerCase() === 'admin') {
    // only get transactions if admin or user is the authenticated user
    TransactionModel.find({ beneficiary: id })
      .populate({
        path: 'accountId',
        select: ['accountType', 'accountNumber', 'balance'],
      })
      .sort({ transactedAt: -1 })
      .populate({
        path: 'transactedBy',
        select: ['fName', 'lName'],
      })
      .populate({
        path: 'beneficiary',
        select: ['fName', 'lName'],
      })

      .exec((err, transactions) => {
        if (err) {
          console.log(err);
          res.status(500).json({ msg: 'Server Error' });
          return;
        }
        if (transactions) {
          res.json({ transactions });
          return;
        }
      });
  } else {
    res.status(401).json({ msg: 'Not Authorized' });
  }
});

/**
 * @swagger
 * paths:
 *  /api/transaction/{id}:
 *   get:
 *     summary: gets all transactions for a given user
 *     tags:
 *       - Transaction
 *     description: When an id is provided the api returns all transactions for the given user
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
Router.get('/:id', (req, res) => {
  res.send('we are fetching all transactions');
});

module.exports = Router;
