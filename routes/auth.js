const express = require("express");
const app  = express();
const passport = require("passport");
const User = require("../models/User");
const Item = require('../models/Item');

app.get('/', (req, res) => {
    Item.find({ "inprogress": false }, (err, items) => {
        if (err) console.log(err);
        res.render('catalog', { items });
    });
});

app.get("/register", (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

//register logic
app.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username}); //create new User in database
    User.register(newUser, req.body.password, (err, user) => { //register the user with passport
        if(!err){
            passport.authenticate("local")(req, res, () => {
                console.log(user);
                res.redirect("/");
            });
        } else {
            console.log(err);
            return res.render("register", {error: err.message}); //if there is an error, flash an error message
        }
    });
});

app.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
    }), function(req, res){
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = app;