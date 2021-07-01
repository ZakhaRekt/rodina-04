const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');
const Guild = require('../../data/guild.js');

const mafiaTextChannel = '812974281574318092'; //Текстовой канал мафии
const mafiaRolePlayer = '812983805060186112'; //Роль играков мафии


module.exports = {
	name: 'mstop',
	category:"mafia",
	description: "Остановить Мафию",

	async run(bot,message) {
		await MafiaGame.findOne({gameName: `game-${message.author.id}`, started:true}, async(err,data) => {
			if(message.channel.id != mafiaTextChannel) return;
			if(err) console.log(err);
			if(!data) {
				return message.channel.send(`Вы не можете использовать команды!Вы не ведущий`)
			}
			await data.players.forEach(async(element) => {
				await message.guild.member(element).setNickname(data.playersNicknames.get(element));
				await message.guild.member(element).roles.remove(mafiaRolePlayer);
			});
			await bot.guilds.cache.get(data.mafiaRoomID).delete();
			await Guild.deleteOne({guildID:data.mafiaRoomID});
			await data.delete();
			await message.channel.send(`Игра успешно остановленна!`)
		});
	}
}
