var express = require("express"),
    router = express.Router(),
    Concession = require("../models/concession")

router.get("/login", function (req, res) {
    res.render("login")
})


router.get("/about", function (req, res) {
    res.render("about")
})

router.get("/home", function (req, res) {
    Concession.find({}, function(err, allusers){
        if (err) {
            console.log(err);
        } else {
            res.render("home", { users : allusers });
        }
    })
})

router.post("/concession", function (req, res) {
    // we got the values from the form 
    var name = req.body.studentName,
        balance = req.body.balance,
        picture = req.body.picture;

    var newUser = {
        name: name,
        balance: balance,
        picture: picture
    }

    Concession.create(newUser, function(err, user){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/home");
        }
    })
})

router.get("/show", function (req, res) {
    res.render("show")
})

router.get("/new", function (req, res) {
    res.render("new")
})

router.get("/:id/edit", function (req, res){
    Concession.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err)
        } else {
            res.render("edit", {user : foundUser})
        }
    })
})
module.exports = router