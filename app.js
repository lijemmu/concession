
var express = require('express')   //Server methods
var mongoose = require('mongoose') // database language

// for your forms, when filling forms it takes the information out
var bodyParser = require ('body-parser') 
var app = express();

// to render all ejs files with no addition extension
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));


// Calls a router to present a file
app.get("/login", function(req,res){
    res.render("login")
})


app.get("/about", function(req,res){
    res.render("about")
})

app.get("/home", function(req,res){
    res.render("home")
})

app.get("/show", function(req,res){
    res.render("show")
})

app.listen(3000,function(req,res){
    console.log("Server Listening on Port 3000....")
})


