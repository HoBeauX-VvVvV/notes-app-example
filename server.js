require('dotenv').config();
const express = require('express');
const app = express()
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;   // DB address
const Note = require('./models/note.js');  // Import Schema
const logger = require('morgan');
const methodOverride = require('method-override');
const PORT = 3000
mongoose.connect(MONGO_URI);  //connect to mongoose to mongo

app.use(express.json());   // pare body and accept json data
app.use(express.urlencoded({ extended: true })); //parse body, accept url encoded data, default--true===prototype data/false===no prototype
app.use(logger('tiny'));   // morgan logger
app.use(methodOverride('_method')); // must come after urlencoded ^^^^ (if it begins with _ convention says don't change it)
app.use('/assets', express.static('public'))

// connection notifcation
mongoose.connection.once('open', () => {
    console.log(`Mongo DB is showin' love`)
});

// error notification
mongoose.connection.on('error', () => {
    console.log(`You know how Mongo be trippin'`)
});

// controller and router logic
// CREATE
app.post('/notes', async (req, res) => {
    req.body.isRead === 'on' ||  req.body.isRead === true ?
    req.body.isRead = true : 
    req.body.isRead = false
    try {
        const createdNote = await Note.create(req.body)
        //res.json(createdNote)
        res.redirect(`/notes/${createdNote._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
});

app.get('/notes/new', (req, res) => {
    res.render('new.ejs')
});

/************************************************
 ************************************************
 ************************************************
 ******READ FUNCTIONALITY START******************
 **/ 

// READ
// INDEX and SHOW
/*app.get('/notes', async (req, res) => {
    try{
       //console.log(req.query.text)
       const foundNotes = await Note.find({})
       res.json(foundNotes)
    } catch (error) {
       res.status(400).json({ msg: error.message })
    }
});*/

// INDEX
app.get('/notes', async (req, res) => {
    try {
        const foundNotes = await Note.find({})
        res.render('index.ejs', {
            notes: foundNotes
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
});

// SHOW
app.get('/notes/:id', async (req, res) => {
    try {
        const foundNote = await Note.findOne({ _id: req.params.id })
        //res.json(foundNote)
        res.render('show.ejs', {
            note: foundNote
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
});

// UPDATE
/*app.put('/notes/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.json(updatedNote)
    } catch (error) {
       res.status(400).json({ msg: error.message })
    }
});*/

app.put ('/notes/:id', async (req, res) => {
    req.body.isRead === 'on' ||  req.body.isRead === true ?
    req.body.isRead = true : 
    req.body.isRead = false
    try {
        const updatedNote = await Note.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        res.redirect(`/notes/${updatedNote._id}`)
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

// EDIT
app.get('/notes/:id/edit', async (req, res) => {
    try {
        const foundNote = await Note.findOne({ _id: req.params.id })
        res.render('edit.ejs', {
            note: foundNote
        })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

// DELETE
/*app.delete('/notes/:id', async (req, res) => {
    try {
        await Note.findOneAndDelete({ _id: req.params.id })
        .then((note) => {
           // console.log(note)
          res.sendStatus(204)
       })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
});
*/

app.delete('notes/:id', async (req, res) => {
    try {
         await Note.findOneAndDelete({ id: req.params.id})
        .then((note) => {
        res.redirect('/notes')
    })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
})

app.listen(PORT, () => {
    console.log('We in the building:' + ' ' + `Application excepting requests on PORT ${PORT}`)
});