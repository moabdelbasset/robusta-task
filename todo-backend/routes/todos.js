const express = require('express');
const router = express.Router();
const ToDo = require('../models/todo');

router.get('/', async (req, res) => {
    try {
        const todos = await ToDo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const newTodo = new ToDo({
        title: req.body.title
    });

    try {
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
