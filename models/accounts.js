var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");


var accountsSchema = new mongoose.Schema({
    username: String,
    password: String,
    concession: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Concession",
    }]
});

accountsSchema.plugin(passportLocalMongoose) 
module.exports = mongoose.model("Accounts", accountsSchema);