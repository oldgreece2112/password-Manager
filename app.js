var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var localStrategy = require('passport-local');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var app = express();

var User = require('./models/user.model');
var indexRoutes = require("./routes/index.routes");
var userRoutes = require("./routes/user.routes");
var passwordRoutes = require("./routes/passwowrds.route");

var PORT = process.env.PORT || 8000;

mongoose.connect("mongodb://localhost/passwords", {useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function(){
    console.log("Connected to database!");
});

app.set("view engine", "ejs");
app.use(flash());
app.use(session({
    secret: "b49e9bcb499a914c6dc74ff6ae1a606d739ba89338f1093103c8580c5036eec8",
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash('success');
    next();
});

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/password", passwordRoutes);

app.listen(PORT, process.env.IP, function(){
    console.log("Server is running on port " + PORT);
});