const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');

const mafiaVoiceChannel = '812974460260450314'; //Войс канал мафии
const mafiaTextChannel = '812974281574318092'; //Текстовой канал мафии
const mafiaRoleLeading = '812974801446240267'; //Роль ведущего


module.exports = {
	name: 'mstart',
	category:"mafia",
	description: "Запустить мафию",

	async run (bot,message) {
		if(message.channel.id != mafiaTextChannel) return; //если команда прописана не в нужном канале
		if(!message.member.roles.cache.some(role => role.id === mafiaRoleLeading)) return; //если человек прописывает команду не имея роли видущего
		if(!message.member.voice.channel)  return message.channel.send(`${message.member} - зайдите в канал для начала игры!`); //если видущий не в канале
		if(message.member.voice.channel.id != mafiaVoiceChannel) return message.channel.send(`${message.member} - зайдите в канал для начала игры!`); //если видущий не в канале

	await MafiaGame.countDocuments({}, async(err02,count) => {
		await MafiaGame.findOne({leader: message.author.tag}, async(err,data) => {
	    		if(err02) console.log(err02);
	    		if(!count) {
	    			message.channel.send(`Создаю игру`);
	    		}
	    		if(count >= 1) {
	    			return message.channel.send(`Может быть создана только 1 игра!`);
	    		}
    			if(err) console.log(err);
    			if(!data) {
    				let game = new MafiaGame({gameName: `game-${message.author.id}`, leader:message.author.tag});
    				game.save();
    				const mainGameEmbed = new Discord.MessageEmbed()
						.setTitle('**Набор на мафию**')
						.setColor('RED')
						.setDescription('Запись началась!')
						.setFooter(`✔ - записаться на игру | ▶️ - начать игру | ❌ - отменить игру`)

					let mainMsg = await message.channel.send(mainGameEmbed);
						await mainMsg.react(`✔`);
						await mainMsg.react(`▶️`);
			            await mainMsg.react(`❌`);
    			}
    			else {
    				return message.channel.send(`Игра уже создана!`);	
    			}
			});
		});
	}
}