var express = require('express');
var mongoose = require('mongoose');
var Password = require('../models/password.model');
var router = express.Router();

router.get("/create", function(req, res){
    res.render("passwords/create", {currentUser:req.user});
});

module.exports = router;