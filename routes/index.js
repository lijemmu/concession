var express = require('express'),
    passport = require('passport'),
    Schools = require('../models/schools'),
    router = express.Router();


// Login Route
router.get("/", function (req, res) {
    res.render("login")
})

router.get("/about", function (req, res) {
    res.render("about")
})

// Add a user to the db
router.post("/register", function (req, res) {
    Schools.register(new Schools({
        username: req.body.username
    }), req.body.password, function (err, schools) {
        if (err) {
            req.flash("error", err.message)
            res.redirect("/")
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to AYG ")
            res.redirect("/schools/" + req.user._id + "/students/home/")
        })
    })
})


// Authenticate the user from db / Login
router.post('/login', passport.authenticate('local', {
    failureRedirect: "/",
    failureFlash: "Wrong School Name or Password"
}), (req, res) => {
    req.flash("success", "Welcome back " + req.body.username)
    res.redirect("/schools/" + req.user._id + "/students/home/")
    // /accounts/" + req.user._id + "/concessions
})

module.exports = router