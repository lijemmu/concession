var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var schoolsSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Students",
    }],
    info:{
        supervisorName: String,
        supervisorPhone: Number,
        schoolAdress1: String,
        schoolAdress2: String,
        city: String,
        state: String,
        zipCode: Number,
    }
});

schoolsSchema.plugin(passportLocalMongoose) 
module.exports = mongoose.model("Schools", schoolsSchema);