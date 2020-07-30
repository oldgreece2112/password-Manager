var express = require('express');
var passport = require('passport');
var User = require("../models/user.model");
var router = express.Router();

router.post("/signin", passport.authenticate("local", {
    successRedirect: "/dashboard/",
    failureRedirect: "/"
}),
function(req, res){

});

router.post("/signup", function(req, res){
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        settings:{
            passwordLength: 7,
            letteres: true,
            specialCharacters: true,
            numbers: true
        }
    });
    User.register(newUser, req.body.password, function(err, newUser){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            console.log(newUser);
            passport.authenticate("local")(req, res, function(){
                res.redirect("/dashboard");
            });
        }
    });
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;