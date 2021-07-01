const mongoose = require('mongoose');
const schema = mongoose.Schema({
   guildID: {
   	type:String
   },
   //Роли
   nrpnames: {
   	type: Array,
   	default: []
   },
   sened: {
   	type: Array,
   	default: []
   },
   snyatie: {
   	type: Array,
   	default: []
   },

   //репорт
   countReports: {
      type: Number,
      default: 0
   },
   activeReports: {
      type: Number,
      default: 0
   },
   closedReports: {
      type: Number,
      default: 0
   }


});
module.exports = mongoose.model("Guild", schema)