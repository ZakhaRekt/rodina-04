const mongoose = require('mongoose');
const schema = mongoose.Schema({
    moderID:String,
    moderName:String,
    moderReports: { type: Number, default: 0 },
    moderAcceptedRoles: { type: Number, default: 0},
    moderWarns: { type: Number, default: 0 },
    moderSince: String,
    firstWarn: String,
    secondWarn: String
});
module.exports = mongoose.model("Moder", schema)