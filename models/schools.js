var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var schoolsSchema = new mongoose.Schema({
    username: String,
    password: String,
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students",
    }],
    info:[{
        supervisorName: String,
        supervisorPhone: Number,
    }]
});

schoolsSchema.plugin(passportLocalMongoose) 
module.exports = mongoose.model("Schools", schoolsSchema);