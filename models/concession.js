var mongoose = require("mongoose")

var concessionsSchema = new mongoose.Schema({
    name: String,
    balance: String,
    picture: String
});

module.exports = mongoose.model("Concession", concessionsSchema)
