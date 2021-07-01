const mongoose = require('mongoose');
const schema = mongoose.Schema({
   reportUser: String,
   reportModer: {
      type: String,
      default: ""
   }
});
module.exports = mongoose.model("Report", schema)