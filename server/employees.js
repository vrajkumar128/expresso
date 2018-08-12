const express = require('express');
const { 
  getAllFromDatabase, 
  getFromDatabaseById, 
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabaseById
} = require('./db');

// Create employeesRouter
const employeesRouter = express.Router();

// Handle :employeeId URL parameter
employeesRouter.param('employeeId', async (req, res, next, id) => {
  try {
    const employee = await getFromDatabaseById('Employee', id);

    if (employee) {
      req.employee = employee;
      next();
    } else {
      res.status(404).send("Employee not found");
    }
  } catch (err) {
    next(err);
  }
});

// Ensure that a received employee is valid
const validateEmployee = (req, res, next) => {
  const { employee } = req.body;

  if (employee && employee.name 
    && employee.position && employee.wage) {
    next();
  } else {
    res.status(400).send("Submitted employee contains missing field(s)");
  }
};

// Get all employees
employeesRouter.get('/', async (req, res, next) => {
  try {
    const employees = await getAllFromDatabase('Employee');
    res.send({ employees });
  } catch (err) {
    next(err);
  }
});

// Get a single employee
employeesRouter.get('/:employeeId', (req, res) => {
  const employee = req.employee;
  res.send({ employee });
});

// Create a new employee
employeesRouter.post('/', validateEmployee, async (req, res, next) => {
  try {
    const employee = await addToDatabase('Employee', req.body.employee);
    res.status(201).send({ employee });
  } catch (err) {
    next(err);
  }
});

// Update an employee
employeesRouter.put('/:employeeId', validateEmployee, async (req, res, next) => {
  try {
    const employee = await updateInstanceInDatabase('Employee', req.body.employee, req.employee.id);
    res.send({ employee });
  } catch (err) {
    next(err);
  }
});

// Delete an employee
employeesRouter.delete('/:employeeId', async (req, res, next) => {
  try {
    const employee = await deleteFromDatabaseById('Employee', req.employee.id);
    res.send({ employee });
  } catch (err) {
    next(err);
  }
});

// Import and mount timesheetsRouter
const timesheetsRouter = require('./timesheets');
employeesRouter.use('/:employeeId/timesheets', timesheetsRouter);

module.exports = employeesRouter;
