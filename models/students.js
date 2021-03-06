var mongoose = require("mongoose");

var studentsSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Students", studentsSchema)
