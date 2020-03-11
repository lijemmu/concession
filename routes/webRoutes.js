var express      = require("express"),
    Receipt      = require('../models/receipt')
    Concession   = require("../models/concession")
    router       = express.Router(),


router.get("/login", function (req, res) {
    res.render("login")
})

router.get("/aboutPage", function(req,res){
    res.render("aboutPage")
})

router.get("/new", function (req, res) {
    res.render("./users/new")
})

router.get("/about", function (req, res) {
    res.render("about")
})

router.get("/home", function (req, res) {
    Concession.find({}, function(err, allusers){
        if (err) {
            console.log(err);
        } else {
            res.render("./users/home", { users : allusers });
        }
    })
})

router.post("/concession", function (req, res) {
    var name    = req.body.name,
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

router.get("/:id", function (req, res) {
    Concession.findById(req.params.id, function(err, user){
        if(err){
            console.log(err)
        }else{
            res.render("./users/show", {user: user})
        }
    })
})

router.get("/:id/edit", function (req, res){
    Concession.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err)
        } else {
            res.render("./users/edit", {user : foundUser})
        }
    })
})

router.put("/:id", function(req, res){
    console.log(req.body.updatedUser)
    Concession.findByIdAndUpdate(req.params.id, req.body.updatedUser, function(err, foundUser){
        if(err){
            console.log(err)
        } else {
            res.redirect("/home")
        }
    })
})

router.put("/receipt/:id", function(req, res){
    console.log(req.body.receipt)
    
    // Concession.findById(req.params.id, function(err, user){
    //     if(err){
    //         console.log(err)
    //         res.redirect("/home")
    //     } else {
    //         Receipt.create(req.body)
    //     }
    // })
})


module.exports = router