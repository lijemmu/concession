var express = require("express"),
router = express.Router()

router.get("/login", function(req,res){
    res.render("login")
})


router.get("/about", function(req,res){
    res.render("about")
})

router.get("/home", function(req,res){
    res.render("home")
})

router.get("/show", function(req,res){
    res.render("show")
})

router.get("/new", function(req,res){
    res.render("new")
})

module.exports = router