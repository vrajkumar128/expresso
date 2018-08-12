const express = require('express');

// Create apiRouter
const apiRouter = express.Router();

// // Import and mount artistsRouter
// const artistsRouter = require('./artists');
// apiRouter.use('/artists', artistsRouter);

// // Import and mount seriesRouter
// const seriesRouter = require('./series');
// apiRouter.use('/series', seriesRouter);

module.exports = apiRouter;