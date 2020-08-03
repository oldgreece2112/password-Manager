var express = require('express');
var mongoose = require('mongoose');
var crypto = require("crypto");
var Password = require('../models/password.model');
var User = require("../models/user.model");
var router = express.Router();

router.get("/create", function(req, res){
    res.render("passwords/create");
});

router.post("/create", function(req, res){
    var url = req.body.url;
    var username = req.body.username;
    var length = req.user.settings.passwordLength;
    var password = "";
    var picker = 0;
    while(password.length < length){
        picker = Math.floor(Math.random() * 3) + 1

        if (picker == 1 && req.user.settings.letters){
            password = password + String.fromCharCode(Math.floor(Math.random() * (122- 65)) + 65);
        }

        if (picker == 2 && req.user.settings.specialCharacters){
            password = password + String.fromCharCode(Math.floor(Math.random() * (47 - 33)) + 33);
        }

        if (picker == 3 && req.user.settings.numbers){
            password = password + String.fromCharCode(Math.floor(Math.random() * (57 - 48)) + 48);
        }
    }

    var newPassword = {
        url: url,
        username: username,
        password: password,
        salt: crypto.randomBytes(16).toString()
    };

    User.findOne({username: req.user.username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            Password.create(newPassword, function(err, newPassword){
                if(err){
                    console.log(err);
                }else{
                    var cipher = crypto.createCipher('aes128', newPassword.salt);
                    var encrypted = cipher.update(password, 'utf8', 'hex');
                    encrypted += cipher.final('hex');
                    newPassword.password = encrypted;
                    newPassword.save();
                    foundUser.passwords.push(newPassword);
                    foundUser.save();
                    console.log(newPassword);
                    console.log(foundUser);
                    res.redirect('/dashboard');
                }
            });
        }
    });

    router.get("/delete/:id", function(req, res){
        var id = req.params.id;
        Password.findByIdAndDelete(id, function(err, deletePassword){
            if(err){
                console.log(err);
            }else{
                res.redirect("/dashboard");
            }
        });
    });

    
});

module.exports = router;