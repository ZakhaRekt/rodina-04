const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');

const mafiaTextChannel = '727111967281512458'; //Текстовой канал мафии
const mafiaRolePlayer = '720958695764131850'; //Роль играков мафии
const mafiaRoleLeading = '727112273704779797'; //Роль ведущегоего



module.exports = {
	name: 'mpause',
	category:"mafia",
	description: "Сделать тех.паузу",

	async run (bot,message) {
		if(message.channel.id != mafiaTextChannel) return;
		if(!message.member.roles.cache.some(role => role.id === mafiaRoleLeading)) return;
		MafiaGame.findOne({gameName: `game-${message.author.id}`, started:true}, async(err,data) => {
			if(err) console.log(err);
			if(!data) {
				return message.channel.send(`Вы не можете поставить игру на паузу, так как она создана не вами!`);
			}
			if(data.paused) return message.channel.send(`\`Игра уже остановленна!\``);
			await data.players.forEach(async(element) => {
				await message.guild.member(element).voice.setMute(true,'Mafia Mute');
			});
			data.paused = true;
			await data.save();
			const MainChannelObj = message.guild.channels.cache.get(mafiaTextChannel);
			const MainRoleObj = message.guild.roles.cache.get(mafiaRolePlayer);
			await MainChannelObj.createOverwrite(MainRoleObj, {
				 					// GENERAL PERMISSIONS
                                    CREATE_INSTANT_INVITE: false,
                                    MANAGE_CHANNELS: false,
                                    MANAGE_ROLES: false,
                                    MANAGE_WEBHOOKS: false,
                                    // TEXT PERMISSIONS
                                    VIEW_CHANNEL: true,
                                    READ_MESSAGE_HISTORY: true,
                                    ATTACH_FILES: true,
                                    SEND_MESSAGES: false,
                                    MANAGE_MESSAGES: false,
                                    MENTION_EVERYONE: false,
                                    SEND_TTS_MESSAGES: false,
                                    EMBED_LINKS: true,
			});
			const pauseEmb = new Discord.MessageEmbed()
				.setTitle(`**Установлена пауза!**`)
				.setColor(`RED`)
				.setDescription(`Пауза установлена пользователем <@${message.author.id}>`);
			await message.channel.send(pauseEmb);
		});
	}
}