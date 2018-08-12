const express = require('express');
const { 
  getAllFromDatabase, 
  getFromDatabaseById, 
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabaseById
} = require('./db');

// Create menuItemsRouter
const menuItemsRouter = express.Router();

// Handle :menuItemId URL parameter
menuItemsRouter.param('menuItemId', async (req, res, next, id) => {
  try {
    const menuItem = await getFromDatabaseById('MenuItem', id);

    if (menuItem) {
      req.menuItem = menuItem;
      next();
    } else {
      res.status(404).send("Menu item not found");
    }
  } catch (err) {
    next(err);
  }
});

// Ensure that a received menu item is valid
const validateMenuItem = (req, res, next) => {
  const { menuItem } = req.body;

  if (menuItem && menuItem.name 
    && menuItem.inventory && menuItem.price) {
    menuItem.menuId = req.menu.id;
    next();
  } else {
    res.status(400).send("Submitted menu item contains missing field(s)");
  }
};

// Get all menuItems
menuItemsRouter.get('/', async (req, res, next) => {
  try {
    const menuItems = await getAllFromDatabase('MenuItem', req.menu.id);
    res.send({ menuItems });
  } catch (err) {
    next(err);
  }
});

// Create a new menuItem
menuItemsRouter.post('/', validateMenuItem, async (req, res, next) => {
  try {
    const menuItem = await addToDatabase('MenuItem', req.body.menuItem);
    res.status(201).send({ menuItem });
  } catch (err) {
    next(err);
  }
});

// Update a menuItem
menuItemsRouter.put('/:menuItemId', validateMenuItem, async (req, res, next) => {
  try {
    const menuItem = await updateInstanceInDatabase('MenuItem', req.body.menuItem, req.menuItem.id);
    res.send({ menuItem });
  } catch (err) {
    next(err);
  }
});

// Delete a menuItem
menuItemsRouter.delete('/:menuItemId', async (req, res, next) => {
  try {
    await deleteFromDatabaseById('MenuItem', req.menuItem.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = menuItemsRouter;