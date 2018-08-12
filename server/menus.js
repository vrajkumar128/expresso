const express = require('express');
const { 
  getAllFromDatabase, 
  getFromDatabaseById, 
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabaseById
} = require('./db');

// Create menusRouter
const menusRouter = express.Router();

// Handle :menuId URL parameter
menusRouter.param('menuId', async (req, res, next, id) => {
  try {
    const menu = await getFromDatabaseById('Menu', id);

    if (menu) {
      req.menu = menu;
      next();
    } else {
      res.status(404).send("Menu not found");
    }
  } catch (err) {
    next(err);
  }
});

// Ensure that a received menu is valid
const validateMenu = (req, res, next) => {
  const { menu } = req.body;

  if (menu && menu.title) {
    next();
  } else {
    res.status(400).send("Submitted menu contains missing title");
  }
};

// Get all menus
menusRouter.get('/', async (req, res, next) => {
  try {
    const menus = await getAllFromDatabase('Menu');
    res.send({ menus });
  } catch (err) {
    next(err);
  }
});

// Get an individual menu
menusRouter.get('/:menuId', (req, res) => {
  const menu = req.menu;
  res.send({ menu });
});

// Create a new menu
menusRouter.post('/', validateMenu, async (req, res, next) => {
  try {
    const menu = await addToDatabase('Menu', req.body.menu);
    res.status(201).send({ menu });
  } catch (err) {
    next(err);
  }
});

// Update a menu
menusRouter.put('/:menuId', validateMenu, async (req, res, next) => {
  try {
    const menu = await updateInstanceInDatabase('Menu', req.body.menu, req.menu.id);
    res.send({ menu });
  } catch (err) {
    next(err);
  }
});

// Delete a menu
menusRouter.delete('/:menuId', async (req, res, next) => {
  try {
    const menuItems = await deleteFromDatabaseById('Menu', req.menu.id);
    menuItems
      ? res.status(400).send("Error: Menu has related item(s)")
      : res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// Import and mount menuItemsRouter
const menuItemsRouter = require('./menu-items');
menusRouter.use('/:menuId/menu-items', menuItemsRouter);

module.exports = menusRouter;