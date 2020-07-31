var express = require('express');
var crypto = require("crypto");
var Password = require("../models/password.model");
var User = require("../models/user.model");
var router = express.Router();

router.get("/", function(req, res){
    res.render("landing");
});

router.get("/dashboard", function(req, res){
    var decrypted = Array();
    var decryptedPassword;
    User.findById(req.user._id).populate("passwords").exec(function(err, foundUser){
        var decipher = crypto.createDecipher("aes128", foundUser._id.toString());
        foundUser.passwords.forEach(function(password){
            decryptedPassword = decipher.update(password.password, 'hex', 'utf8');
            decryptedPassword += decipher.final("utf8");
            decrypted.push(decryptedPassword);
        });
        res.render("dashboard", {user: foundUser, passwords: decrypted});
    });
});

module.exports = router;