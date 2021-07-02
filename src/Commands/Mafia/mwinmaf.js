const Discord = require('discord.js');

const MafiaGame = require('../../data/mafia.js');
const Guild = require('../../data/guild.js');

const mafiaTextChannel = '727111967281512458'; //Текстовой канал мафии
const mafiaRolePlayer = '720958695764131850'; //Роль играков мафии
const mafiaRoleLeading = '727112273704779797'; //Роль ведущего


module.exports = {
	name: 'mwinmaf',
	category:"mafia",
	description: "Выиграла мафия",

	async run(bot,message) {
		if(message.channel.id != mafiaTextChannel) return;
		if(!message.member.roles.cache.some(role => role.id === mafiaRoleLeading)) return;
		MafiaGame.findOne({gameName: `game-${message.author.id}`, started:true}, async(err,data) => {
			if(err) console.log(err);
			if(!data) {
				return message.reply(`Вы не создатель данной игры!`);
			}
			const MafEmb = new Discord.MessageEmbed()
				.setTitle(`**Победа мафии!**`)
				.setColor(`RED`)
				.setDescription(`На столе остались: \n`);
			await data.players.forEach((element) => {
				message.guild.member(element).setNickname(data.playersNicknames.get(element));
				message.guild.member(element).roles.remove(mafiaRolePlayer);
				MafEmb.setDescription(`${MafEmb.description} <@${element}> \n`);
			});
			await message.channel.send(MafEmb);
			await bot.guilds.cache.get(data.mafiaRoomID).delete();
			await Guild.deleteOne({guildID:data.mafiaRoomID});
			await message.author.send('Завершаю игру!')
			.then(msg => bot.channels.cache.get(msg.channel.id).messages.fetch({limit:15})
			.then(messages => messages.filter(msg => msg.content.startsWith('Игрок'))
			.each(mess => message.channel.send(mess.content))))
			await data.delete();
		});
	}
}