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
    var newUser = new Accounts({
        username: req.body.schoolName,
    })
    console.log(newUser)

    Accounts.register(newUser, req.body.password, function (err, userCreated) {
        if (err) {
            console.log(err)
            req.flash("error", err.message)
            res.redirect("/aboutPage")
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Welcome to AYG " + req.user.username)
                res.redirect("/")
            })
        }
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