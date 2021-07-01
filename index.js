require('dotenv').config();
const Discord = require('discord.js');
const mongoose = require('mongoose');
const bot = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const fs = require("fs");



bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.categories = fs.readdirSync("./src/Commands/");

["command", "event"].forEach(handler=> {

  require(`./src/handlers/${handler}`)(bot);


});


mongoose.connect(process.env.databaseURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
  console.log('[✅DataBase] Connected!')
  console.log(`Deploy Test`)
});

bot.login(process.env.token);


bot.on("error", console.error);


       
  

