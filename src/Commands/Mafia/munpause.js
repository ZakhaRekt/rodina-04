const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');

const mafiaTextChannel = '727111967281512458'; //Текстовой канал мафии
const mafiaRolePlayer = '720958695764131850'; //Роль играков мафии
const mafiaRoleLeading = '727112273704779797'; //Роль ведущего




module.exports = {
	name: 'munpause',
	category:"mafia",
	description: "Отменить тех.паузу",

	async run (bot,message) {
		if(message.channel.id != mafiaTextChannel) return;
		if(!message.member.roles.cache.some(role => role.id === mafiaRoleLeading)) return;
		MafiaGame.findOne({gameName: `game-${message.author.id}`, started:true}, async(err,data) => {
			if(err) console.log(err);
			if(!data) {
				return message.channel.send(`Вы не можете отменить паузу, так как игра создана не вами!`);
			}
			if(!data.paused) return message.channel.send(`\`Игра не на паузе!\``);
			await data.players.forEach(async(element, index) => {
				await message.guild.member(element).voice.setMute(false,'Mafia Unmute');
			}); 
			data.paused = false;
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
                                    SEND_MESSAGES: true,
                                    MANAGE_MESSAGES: false,
                                    MENTION_EVERYONE: false,
                                    SEND_TTS_MESSAGES: false,
                                    EMBED_LINKS: true,
			});
			const pauseEmb = new Discord.MessageEmbed()
				.setTitle(`**Пауза снята!**`)
				.setColor(`RED`)
				.setDescription(`Пауза снята пользователем <@${message.author.id}>`);
			await message.channel.send(pauseEmb);
		});
	}
}