
var express = require('express'),   //Server methods
 mongoose = require('mongoose'), // database language

// for your forms, when filling forms it takes the information out
 bodyParser = require ('body-parser'),
 webRoutes = require("./routes/webRoutes"),
 Concession = require("./models/concession"),
 app = express();

// to render all ejs files with no addition extension
mongoose.connect("mongodb://localhost/concession", {useNewUrlParser: true})
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(webRoutes)


app.listen(3000,function(req,res){
    console.log("Server Listening on Port 3000....")
})


