const express = require('express');
const { 
  getAllFromDatabase, 
  getFromDatabaseById, 
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabaseById
} = require('./db');

// Create timesheetsRouter
const timesheetsRouter = express.Router();

// Handle :timesheetId URL parameter
timesheetsRouter.param('timesheetId', async (req, res, next, id) => {
  try {
    const timesheet = await getFromDatabaseById('Timesheet', id);

    if (timesheet) {
      req.timesheet = timesheet;
      next();
    } else {
      res.status(404).send("Timesheet not found");
    }
  } catch (err) {
    next(err);
  }
});

// Ensure that a received timesheet is valid
const validateTimesheet = (req, res, next) => {
  const { timesheet } = req.body;

  if (timesheet && timesheet.hours 
    && timesheet.rate && timesheet.date) {
    timesheet.employeeId = req.employee.id;
    next();
  } else {
    res.status(400).send("Submitted timesheet contains missing field(s)");
  }
};

// Get all timesheets
timesheetsRouter.get('/', async (req, res, next) => {
  try {
    const timesheets = await getAllFromDatabase('Timesheet', req.employee.id);
    res.send({ timesheets });
  } catch (err) {
    next(err);
  }
});

// Create a new timesheet
timesheetsRouter.post('/', validateTimesheet, async (req, res, next) => {
  try {
    const timesheet = await addToDatabase('Timesheet', req.body.timesheet);
    res.status(201).send({ timesheet });
  } catch (err) {
    next(err);
  }
});

// Update a timesheet
timesheetsRouter.put('/:timesheetId', validateTimesheet, async (req, res, next) => {
  try {
    const timesheet = await updateInstanceInDatabase('Timesheet', req.body.timesheet, req.timesheet.id);
    res.send({ timesheet });
  } catch (err) {
    next(err);
  }
});

// Delete a timesheet
timesheetsRouter.delete('/:timesheetId', async (req, res, next) => {
  try {
    await deleteFromDatabaseById('Timesheet', req.timesheet.id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

module.exports = timesheetsRouter;