const express = require('express');
const app = express();
const db = require('./config/db.js');
const PORT = process.env.PORT || 5000;
var request = require('request');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

// connect database
db();

// init middleware
app.use(express.json({ extended: false }));

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    description:
      'This project describes the endpoints for a fullstack banking application',
    version: '1.0.0',
  },
  server: {
    localhost: 'http://localhost:5000',
    description: 'development server',
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(options);
app.get('/', (req, res) => {
  res.send('Badbank');
});

// Define routes
app.use('/api/', require('./routes/user.js'));
app.use('/api/transaction', require('./routes/user.js'));
app.use('/api/account', require('./routes/account.js'));
app.use('/api/auth', require('./routes/auth.js'));

// define path to where API UI will be served
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
