var mongoose = require('mongoose'),

receiptSchema = new mongoose.Schema({
    date: String,
    action: String,
    balance: String
})

module.exports = mongoose.model('Receipt',receiptSchema)