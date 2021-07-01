const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');

const mafiaTextChannel = '812974281574318092'; //Текстовой канал мафии
const mafiaRoleLeading = '812974801446240267'; //Роль ведущего




module.exports = {
	name: 'munfoul',
	category:"mafia",
	description: "Снять фол",

	async run (bot,message,args) {
		if(message.channel.id != mafiaTextChannel) return;
		if(!message.member.roles.cache.some(role => role.id === mafiaRoleLeading)) return;
		MafiaGame.findOne({gameName: `game-${message.author.id}`,started:true}, async(err,data) => {
			if(err) console.log(err);
			if(!data) {
				return message.channel.send(`\`Ведущий игры не вы!\``);
			}
			if(data.paused) return message.channel.send(`\`Вы не можете снять фол пока игра на паузе!\``);
			if(!args[0]) {
				return message.channel.send(`\`Упомяните пользователя которому хотите снять фол!\``);
			}
			const memberToFoul = message.mentions.members.first();
			if(!memberToFoul) {
				return message.channel.send(`Пользователь не найден на сервере!`);
			}
			if(!data.fouls.has(memberToFoul.id)) {
				return message.channel.send(`\`Пользователь которому вы пытаетесь снять фол не играет!\``);
            }
            if(data.fouls.get(memberToFoul.id) <= 0) {
                return message.channel.send(`\`У пользователя нет фолов!\``);
            }
			await data.fouls.set(memberToFoul.id, data.fouls.get(memberToFoul.id) - 1);
            await data.save();
            if(data.fouls.get(memberToFoul.id) == 0) {
                await memberToFoul.setNickname(`${memberToFoul.displayName.substr(0,2)}`);
            } else {
                await memberToFoul.setNickname(`${memberToFoul.displayName.substr(0,2)} [Фолы ${data.fouls.get(memberToFoul.id)} из 4-ех]`);
            }
			const FoulEmb = new Discord.MessageEmbed()
				.setTitle(`**Снят фол!**`)
				.setColor(`RED`)
				.setDescription(`
					Игроку ${memberToFoul} снят фол!\nСнял: ${message.member}
					`)
			await message.channel.send(FoulEmb);
		});
	}
}