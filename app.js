
// Require Packages
var express          = require('express'),       // It is the frame work that we are using  
    mongoose         = require('mongoose'),      // Is the language of mongodb (database)
    bodyParser       = require ('body-parser'), // Allows us to use req.body and parses forms 
    methodOverride   = require ('method-override'),
    webRoutes        = require("./routes/webRoutes"), // This tells the server (app.js) where all the website routes are
    Concession       = require("./models/concession"), // We are telling the server where the Database is stores, (in models)
    app              = express(); // Basically gives express another variable (app) which lets us say "app.use"

 // App Usage
mongoose.connect("mongodb://localhost/concession", {useNewUrlParser: true})
app.set('view engine', 'ejs');
app.use(methodOverride("_method"))
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(webRoutes)

//Server Listenning
app.listen(3000,function(req,res){
    console.log("Server Listening on Port 3000....")
})


