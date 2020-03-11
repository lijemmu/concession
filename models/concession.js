var mongoose = require("mongoose")

var concessionsSchema = new mongoose.Schema({
    name: String,
    picture: String,
    balance: String,
    receipt: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Receipt"
    }]
});

module.exports = mongoose.model("Concession", concessionsSchema)
