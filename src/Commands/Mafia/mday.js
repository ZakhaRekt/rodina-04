const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');

const mafiaTextChannel = '812974281574318092'; //Текстовой канал мафии
const mafiaRolePlayer = '812983805060186112'; //Роль играков мафии
const mafiaRoleLeading = '812974801446240267'; //Роль ведущего
 
module.exports = {
    name: 'mday',
    category:"mafia",
    description: "День",
    
    async run(bot,message) {
    	if(message.channel.id != mafiaTextChannel) return;
		if(!message.member.roles.cache.some(role => role.id === mafiaRoleLeading)) return;
		await MafiaGame.findOne({gameName:`game-${message.author.id}`, started:true}, async(err,data) => {
			if(err) console.log(err);
			if(!data) {
				return message.channel.send(`Вы не ведущий этой игры!`);
			}
			if(data.paused) return message.channel.send(`**Игра стоит на паузе!**`);
			if(data.day) return message.channel.send(`**Сейчас и так день!**`);

			let Role = message.guild.roles.cache.get(mafiaRolePlayer);
			let Channel = message.guild.channels.cache.get(mafiaTextChannel);
			
			await Channel.createOverwrite(Role, {
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
			data.players.forEach(async function(element) {
				await message.guild.member(element).voice.setMute(false, 'Mafia Unmute');
				await message.guild.member(element).send(`\`Просыпайся, уже день!\``);
			});
			const DayEmb = new Discord.MessageEmbed()
				.setTitle(`**Настал день!**`)
				.setColor(`RED`)
				.setDescription(`**Пора внимательно слушать ведущего!**`);
			await message.channel.send(DayEmb);

			data.day = true;
			await data.save();
		});
    }
}     