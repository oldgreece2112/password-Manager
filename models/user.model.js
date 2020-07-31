var mongoose = require('mongoose');
var passportlocalmongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    email: String,
    passwords: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Password"
        }
    ],
    settings: {
        passwordLength: {
            type: Number,
            default: 8
        },
        letters: {
            type: Boolean,
            default: true
        },
        specialCharacters: {
            type: Boolean,
            default: true
        },
        numbers: {
            type: Boolean,
            default: true
        }
    }
});

userSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User", userSchema);