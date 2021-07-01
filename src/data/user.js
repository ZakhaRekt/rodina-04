const mongoose = require('mongoose');
const schema = mongoose.Schema({
    userID: String,
    messages: {type: Number, default: 0},
    joinTime: {type: Number, default: 0},
    city: {type: String, default: ''},
    qrTimeout: Number
});
module.exports = mongoose.model("User", schema)


