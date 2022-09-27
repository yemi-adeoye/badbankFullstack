const express = require('express');
const app = express();

const path = require('path');

// init middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => {
  console.log('got called');
  res.sendFile(path.resolve(__dirname, 'badbank', 'build', 'index.html'));
});

// Define routes

app.get('/login', (req, res) => {
  res.json({ msg: 'happy' });
});

// Serve static assets in production
//if (process.env.NODE_ENV === 'production') {
// Set static folder
app.use(express.static('client/build'));

const PORT = 8000;
console.log(__dirname, path.resolve('a', 'b'));

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
