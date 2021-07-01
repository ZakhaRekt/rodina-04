const Discord = require('discord.js');
const User = require("../../data/user.js");

module.exports = {
	name: "voice",
    category:"misc",
	description: "Команда для просмотра количества минут в текущем голосовом чате.",


	async run (bot,message,args) {
		User.findOne({userID: message.author.id}, (err,data) => {
            if(err) console.log(err);
            if(!data) {
                message.channel.send(`Ошибка! Вы не найдены в базе данных!`)
            }
            	if(message.member.voice.channel == null) {
            		return message.channel.send(
            			new Discord.MessageEmbed()
            			.setColor(`RED`)
            			.setDescription(`Вы не находитесь в голосовом канале!`)
            			);
            	}
                const voiceTimeEmb = new Discord.MessageEmbed()
                    .setTitle(`Количество минут в текущем голосовом канале - ${message.member.displayName}`)
                    .setColor(`RED`)
                    .setDescription(`
                        Вы провели в голосовом канале ${Math.round((Date.now() - data.joinTime)/60000)} минут!
                        `)
                return message.channel.send(voiceTimeEmb);
        });
	}
}