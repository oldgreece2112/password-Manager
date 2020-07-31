var mongoose = require('mongoose');

var passwordSchema = new mongoose.Schema({
    url: String,
    username: String,
    password: String
});

module.exports = mongoose.model("Password", passwordSchema);