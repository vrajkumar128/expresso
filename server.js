const express = require('express');
const app = express();

// Set port that server listens on
const PORT = process.env.PORT || 4000;

// Import and use CORS middleware
const cors = require('cors');
app.use(cors());

// Import and use body parsing middleware
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Import and use logging middleware
const morgan = require('morgan');
app.use(morgan('tiny'));

// Import and mount apiRouter
const apiRouter = require('./server/api');
app.use('/api', apiRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;