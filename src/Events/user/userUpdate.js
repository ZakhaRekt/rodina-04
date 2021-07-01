const Discord = require('discord.js');


module.exports = async (bot,oldUser,newUser) => {
	if(oldUser.bot || newUser.bot) return; //если бот то выходим
    if(newUser.avatar != oldUser.avatar) { //Если сменили аватарку
        bot.channels.cache.find(ch => ch.name === `┃『🔲』member`).send(
            new Discord.MessageEmbed()
            .setTitle(`Пользователь ${newUser.tag} изменил свою аватарку`)
            .setColor(`RED`)
            .setThumbnail(`${oldUser.displayAvatarURL()}`)
            .addFields(
                {name:`**Новая аватарка:**`,value:`👇`}
            )
            .setImage(`${newUser.displayAvatarURL()}`)
            )
    }
    if(newUser.tag != oldUser.tag) { //если сменили логин
        bot.channels.cache.find(ch => ch.name === `┃『🔲』member`).send(
            new Discord.MessageEmbed()
            .setTitle(`Пользователь **${oldUser.tag}** изменил свой логин!`)
            .setColor(`RED`)
            .addFields(
                {name:`**Старый никнейм:**`,value:`\`${oldUser.tag}\``},
                {name:`**Новый никнейм:**`,value:`\`${newUser.tag}\``}
                )
            .setImage(`${newUser.displayAvatarURL()}`)
            )
    }
}