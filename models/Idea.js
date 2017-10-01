const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Creating mongoose model (using schema)
const IdeaSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    user: {
        type: String,   // Link to user id
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('ideas', IdeaSchema);