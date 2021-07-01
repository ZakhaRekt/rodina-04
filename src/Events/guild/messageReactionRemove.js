const Discord = require('discord.js');


const serverid = '325607843547840522';
const MafiaGame = require('../../data/mafia.js');

const mafiaVoiceChannel = '812974460260450314'; //Войс канал мафии
const mafiaTextChannel = '812974281574318092'; //Текстовой канал мафии
const mafiaRoleLeading = '812974801446240267'; //Роль ведущего
module.exports = async (bot, reaction, user) => {
	if (reaction.message.partial) await reaction.message.fetch();
	if (reaction.partial) await reaction.fetch();
	if (reaction.message.guild.id != serverid) return; //если сервер не тот


	if (reaction.message.channel.id === mafiaTextChannel) {


		if (reaction.emoji.name === "✔") {
			if (reaction.message.guild.member(user.id).roles.cache.some(role => role.id === mafiaRoleLeading)) return;
			if (reaction.message.guild.member(user).voice.channel.id != mafiaVoiceChannel) return;

			const botMsg = reaction.message;
			MafiaGame.findOne({ started: false }, async (err, data) => {
				if (err) console.log(err);
				if (!data) {
					console.log(`No data found on Reaction Remove!`);
				}
				if (data.gamersDescription.indexOf(`<@${user.id}>`) == -1) return;
				let GamerRemove = data.gamersDescription.indexOf(`<@${user.id}>`);
				await data.gamersDescription.splice(GamerRemove, 1);

				let PlayerRemove = data.players.indexOf(user.id);
				await data.players.splice(PlayerRemove, 1);

				await data.save().catch(err => console.log(err));


				const emb = new Discord.MessageEmbed()
					.setTitle(`${botMsg.embeds[0].title}`)
					.setColor(`RED`)
					.setDescription(`${data.gamersDescription.join(", \n")}`)
					.setFooter(`✔ - записаться на игру | ▶️ - начать игру | ❌ - отменить игру`)
				await botMsg.edit(emb);
			});
		}


	} else {
		return;
	}

}