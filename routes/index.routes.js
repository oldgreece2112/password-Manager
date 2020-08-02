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
        
        foundUser.passwords.forEach(function(password){
            var decipher = crypto.createDecipher("aes128", password.salt);
            decryptedPassword = decipher.update(password.password, 'hex', 'utf8');
            decryptedPassword += decipher.final("utf8");
            decrypted.push(decryptedPassword);
        });
        res.render("dashboard", {user: foundUser, passwords: decrypted});
    });
});

router.get("/settings", function(req, res){
    User.findById(req.user._id, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            res.render("settings", {user: foundUser}
            );
        }
    });
});



router.post("/settings", function(req, res){
    var passwordLength = parseInt(req.body.length);

    if(req.body.letters == 'true'){
        var letters = true;
    }else{
        var letters = false;
    }

    if (req.body.numbers == 'true'){
        var numbers = true;
    }else{
        var numbers = false;
    }

    if(req.body.specialCharacters == true){
        var specialCharacters = true;
    }else{
        var specialCharacters = false;
    }

    var newsettings = {
        passwordLength: passwordLength,
        letters: letters,
        numbers: numbers,
        specialCharacters: specialCharacters
    };

    User.findById(req.user._id, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            foundUser.settings = newsettings;
            foundUser.save();
            console.log(foundUser);
            res.redirect("/dashboard");
        }
    });
});

module.exports = router;