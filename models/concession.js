var mongoose = require("mongoose");

var concessionsSchema = new mongoose.Schema({
    name: String,
    picture: String,
    finalBalance: String,
    receipt: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Receipt",
        searchedDate:[],
        flag: Boolean
    }]
    
});

module.exports = mongoose.model("Concession", concessionsSchema)
