const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
      text: { type: String, required: true },
      isRead: { type: Boolean, required: true }
},{
    timestamps: true    
});

const Note = mongoose.model('Note', noteSchema)

module.exports = Note

/* Example code
      Article:
      const articleSchema = new mongoose.Schema({
      title: { type: String, required: true },
      body: { type: String, required: true },
      slug: { type: String, required: true, unique: true }
      });
*/

// If you make something unique:true the database will always be unique:true 
// unless you go in a change it, even if the code that made it that way gets changes