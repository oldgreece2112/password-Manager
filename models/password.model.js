var mongoose = require('mongoose');

var passwordSchema = new mongoose.Schema({
    url: String,
    username: String,
    password: String,
    salt: String
});

module.exports = mongoose.model("Password", passwordSchema);