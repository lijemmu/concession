// Require Packages

var express           = require("express"), // It is the frame work that we are using 
passport              = require("passport"),
mongoose              = require('mongoose'), // Is the language of mongodb (database)
bodyParser            = require('body-parser'),// Allows us to use req.body and parses forms
flash                 = require("connect-flash"),
passportLocal         = require("passport-local"),
indexRouter           = require("./routes/index"),
expressSession        = require('express-session'),
methodOverride        = require('method-override'),
Receipt               = require("./models/receipt"),
Accounts              = require("./models/accounts"),
webRoutes             = require("./routes/webRoutes"), // This tells the server (app.js) where all the website routes are
Concession            = require("./models/concession"), // We are telling the server where the Database is stores, (in models)
passportLocalMongoose = require("passport-local-mongoose"),
app = express(); // Basically gives express another variable (app) which lets us say "app.use"

// App Usage
mongoose.connect("mongodb://localhost/concession", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.set('view engine', 'ejs');
app.use(methodOverride("_method"))
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json()) // parse application/json
app.use(flash())
app.use(expressSession({
    secret: "1234",
    resave: false,
    saveUnitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(Accounts.authenticate())) // I added {  usernameField: 'email',}
passport.serializeUser(Accounts.serializeUser())
passport.deserializeUser(Accounts.deserializeUser())




// Router CONFIG
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})
app.use(indexRouter)
app.use("/accounts/:account_id/concessions",webRoutes)

// "/accounts/:account_id/concessions",


//Server Listenning
app.listen(3000, function (req, res) {
    console.log("Server Listening on Port 3000....")
})