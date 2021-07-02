const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');

const mafiaTextChannel = '727111967281512458'; //Текстовой канал мафии
const mafiaRolePlayer = '720958695764131850'; //Роль играков мафии
const mafiaRoleLeading = '727112273704779797'; //Роль ведущего


module.exports = {
	name: 'mfoul',
	category:"mafia",
	description: "Выдать фол",

	async run (_bot,message,args) {
		if(message.channel.id != mafiaTextChannel) return;
		if(!message.member.roles.cache.some(role => role.id === mafiaRoleLeading)) return;
		MafiaGame.findOne({gameName: `game-${message.author.id}`,started:true}, async(err,data) => {
			if(err) console.log(err);
			if(!data) {
				return message.channel.send(`\`Ведущий игры не вы!\``);
			}
			if(data.paused) return message.channel.send(`\`Вы не можете выдать фол пока игра на паузе!\``);
			if(!args[0]) {
				return message.channel.send(`\`Упомяните пользователя которому хотите выдать фол!\``);
			}
			const memberToFoul = message.mentions.members.first();
			if(!memberToFoul) {
				return message.channel.send(`Пользователь не найден на сервере!`);
			}
			if(!data.fouls.has(memberToFoul.id)) {
				return message.channel.send(`\`Пользователь которому вы пытаетесь выдать фол не играет!\``);
			}
			await data.fouls.set(memberToFoul.id, data.fouls.get(memberToFoul.id) + 1);
			await data.save();
			await memberToFoul.setNickname(`${memberToFoul.displayName.substr(0,2)} [Фолы ${data.fouls.get(memberToFoul.id)} из 4-ех]`);
			const FoulEmb = new Discord.MessageEmbed()
				.setTitle(`**Фол!**`)
				.setColor(`RED`)
				.setDescription(`
					Игрок ${memberToFoul} получил фол!\nВыдал: ${message.member}
					`)
			await message.channel.send(FoulEmb);
			if(data.fouls.get(memberToFoul.id) == 4) {
				await data.fouls.delete(memberToFoul.id);
				await memberToFoul.setNickname(data.playersNicknames.get(memberToFoul.id));
				await data.playersNicknames.delete(memberToFoul.id);
				await memberToFoul.roles.remove(mafiaRolePlayer);
				let player = data.players.indexOf(memberToFoul.id);
				await data.players.splice(player,1);
				await data.save();
				const fourFouls = new Discord.MessageEmbed()
					.setTitle(`**Поднятие!**`)
					.setColor(`RED`)
					.setDescription(`Игрок ${memberToFoul} был поднят со стола по 4-ем фолам! \n
						Поднял: <@${message.author.id}>
						`);
				return message.channel.send(fourFouls);
			}
		});
	}
}