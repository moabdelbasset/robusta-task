const express = require('express');
const router = express.Router();
const ToDo = require('../models/todo');

// Get all ToDo items
router.get('/', async (req, res) => {
  try {
    const todos = await ToDo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// More routes for Create, Update, Delete here...

module.exports = router;

