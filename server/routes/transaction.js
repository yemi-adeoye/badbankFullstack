const express = require('express');
const Router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: A unique identifier
 *           example: ae8a0816-47df-4b5a-a3a2-84b5daad737c
 *         type:
 *           type: string
 *           description: Deposit or Withdrawal
 *           example: Deposit
 *         date:
 *           type: date
 *           description: Date transaction was carried out
 *           example: 05-19-2021
 *         user:
 *           $ref: '#/components/schemas/User'
 *
 *
 */

/**
 * @swagger
 * paths:
 *  /api/transaction/{id}/{type}:
 *   post:
 *     summary: insert a new transaction
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
Router.post('/insert/:id/:type', (req, res) => {
  res.send('inserting a transaction');
});

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
Router.get('/:id/:type', (req, res) => {
  res.send('we are fetching transaction by type');
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
