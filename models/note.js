const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
      text: { type: String, required: true },
      isRead: { type: Boolean, required: true }
},{
    timeStamps: true    
});

const note = mongoose.model('Note', noteSchema)