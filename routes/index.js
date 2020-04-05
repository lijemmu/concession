var express = require('express'),
    passport = require('passport'),
    Accounts = require('../models/accounts'),
    router = express.Router();


// Login Route
router.get("/", function (req, res) {
    res.render("login")
})
router.get("/aboutPage", function (req, res) {
    res.render("aboutPage")
})

// Add a user to the db
router.post("/register", function (req, res) {
    // username = new Accounts({username: req.body.schoolName})
    Accounts.register(new Accounts({
        username: req.body.username
    }), req.body.password, function (err, accounts) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/")
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to AYG ")
            res.redirect("/accounts/" + req.user._id + "/concessions/home/")
        })
    })
})


// Authenticate the user from db / Login
router.post('/login', passport.authenticate('local', {
    failureRedirect: "/",
    failureFlash: "Wrong School Name or Password"
}), (req, res) => {
    req.flash("success", "Welcome back " + req.body.username)
    console.log(req.user._id)
    res.redirect("/accounts/" + req.user._id + "/concessions/home/")
    // /accounts/" + req.user._id + "/concessions
})

module.exports = router