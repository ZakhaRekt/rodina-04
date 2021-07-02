const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');
const Guild = require('../../data/guild.js');

const mafiaTextChannel = '727111967281512458'; //Текстовой канал мафии
const mafiaRolePlayer = '720958695764131850'; //Роль играков мафии


module.exports = {
	name: 'forcestop',
	category:"mafia",
	description: "Остановить Мафию",

	async run(bot,message) {
		await MafiaGame.findOne({gameName: `game-${message.author.id}`}, async(err,data) => {
			if(message.channel.id != mafiaTextChannel) return;
			if(err) console.log(err);
			if(!data) {
				return message.channel.send(`Вы не можете использовать команды!Вы не ведущий`)
			}
			await data.players.forEach(async(element) => {
				await message.guild.member(element).roles.remove(mafiaRolePlayer);
			});
            if(data.mafiaRoomID == '') {
                await data.delete();
			    return await message.channel.send(`ФОРС ОСТАНОВКА УСПЕШНА!`)
            } else {
                await bot.guilds.cache.get(data.mafiaRoomID).delete();
				await Guild.deleteOne({guildID:data.mafiaRoomID});
                await data.delete();
			    return await message.channel.send(`ФОРС ОСТАНОВКА УСПЕШНА!`)
            }
		});
	}
}
