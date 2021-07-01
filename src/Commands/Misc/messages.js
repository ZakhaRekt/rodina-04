const Discord = require('discord.js');
const User = require("../../data/user.js");


module.exports = {
	name: "messages",
	category:"misc",
	description: "Команда для просмотра количества сообщений.",

	async run (bot,message,args) {
			if(!args[0]) {
	        User.findOne({userID: message.author.id}, (err, data) => {
	            if(err) console.log(err);
	            if(!data) {
	                return message.channel.send(`\`Не найден в БД!\``)
	            }
	            let messagesEmbed = new Discord.MessageEmbed()
	                .setColor(`RED`)
	                .setTitle(`Сообщения пользователя ${message.member.displayName}`)
	                .setDescription(`
	                    Количество отправленных сообщений: ${data.messages}.
	                    `)
	            message.channel.send(messagesEmbed);
	        });
	    }
	    else {
	        const messagesMember = message.mentions.members.first();
	        if(!messagesMember) {
	            return message.channel.send(`Пользователь указан не верно!`)
	        } 
	        User.findOne({userID: messagesMember.id }, (err, data) => {
	            if(err) console.log(err);
	            if(!data) {
	                return message.channel.send(`\`Не найден в БД!\``)
	            }
	            let messagesEmbed = new Discord.MessageEmbed()
	                .setColor(`RED`)
	                .setTitle(`Сообщения пользователя ${messagesMember.displayName}`)
	                .setDescription(`
	                    Количество отправленных сообщений: ${data.messages}.
	                    `)
	            message.channel.send(messagesEmbed);
	        });
	    }
	}
}