var express = require('express');
var User = require("../models/user.model");
var Note = require("../models/note.model");
var crypto = require("crypto");
var router = express.Router();

router.get("/", function(req, res){
    User.findById(req.user._id).populate("notes").exec(function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            var decrypted = Array();
            foundUser.notes.forEach(function(note){
                var decipher = crypto.createDecipher("aes128", note.salt);
                var decrypt = decipher.update(note.text, "hex", "utf-8");
                decrypt += decipher.final("utf-8");
                decrypted.push(decrypt);
            });
            res.render("notes/view", {user: foundUser, decrypted: decrypted});
        }
    });
});

router.get("/create", function(req, res){
    res.render("notes/create");
});

router.post("/create", function(req, res){
    var string = req.body.text;
    var title = req.body.title;
    var newNote = {
        title: title,
        text: string,
        salt: crypto.randomBytes(16).toString()
    };

    User.findById(req.user._id, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            Note.create(newNote, function(err, newNote){
                var cipher = crypto.createCipher("aes128", newNote.salt);
                var encrypted = cipher.update(newNote.text, "utf-8", "hex");
                encrypted += cipher.final("hex");
                newNote.text = encrypted;
                newNote.save();
                foundUser.notes.push(newNote);
                foundUser.save();
                res.redirect("/notes");
            });
        }
    })
});

router.get("/edit/:id", function(req, res){
    
});

module.exports = router;