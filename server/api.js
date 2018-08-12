const express = require('express');

// Create apiRouter
const apiRouter = express.Router();

// Import and mount employeesRouter
const employeesRouter = require('./employees');
apiRouter.use('/employees', employeesRouter);

// Import and mount menusRouter
const menusRouter = require('./menus');
apiRouter.use('/menus', menusRouter);

module.exports = apiRouter;