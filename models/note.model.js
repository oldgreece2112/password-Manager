var mongoose = require("mongoose");

var noteSchema = new mongoose.Schema({
    text: String,
    title: String,
    salt: String
});

module.exports = mongoose.model("Note", noteSchema);