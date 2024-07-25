require('dotenv').config();
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
const Note = require('./models/note.js');

mongoose.connect(MONGO_URI);  //connect to mongoose to mongo

// connection notifcation
mongoose.connection.once('open', () => {
    console.log(`Mongo DB is showin' love`)
});

// error notification
mongoose.connection.on('error', () => {
    console.log(`Mongo is trippin'`)
});

// controller and router logic
app.post('/notes', async (req, res) => {
    try {
        const createdNote = await Note.create(req.body)
        res.json(createdNote)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})