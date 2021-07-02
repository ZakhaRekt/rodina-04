const Discord = require('discord.js');
const ModerationRoles = [
    '577526148330815498', //GA
    '577530456870748171', //ZGA
    '577525590769532938', //Kurator
    '577524866320826368',//4-ka
    '577524754798346261',//3-ka
    '577524969051914262', //2-ka
    '577523815890944007'// 1-ka
];

module.exports = {
	name: "admins",
    category:"moderation",
	description: "Список администраторов",

    async run (bot,message) {
        var totalCounter = 0;
        const ModerationEmbed = new Discord.MessageEmbed()
            .setColor(`${message.member.displayHexColor}`)
            .setTitle(`**Список Администраторов | Rodina Easten District**`)
        ModerationRoles.forEach(element => {
            message.guild.roles.cache.each(role => {
                if(role.id === element) {
                    var ids = "";
                    totalCounter += role.members.size;
                    role.members.each(member =>  ids = ids + `<@${member.id}>` + "\n")
                    if(ids === '') return;
                    ModerationEmbed.addField(`**${role.name} - ${role.members.size}**`,ids)
                }
            })
        })
        ModerationEmbed.addField(`**Всего админов**`,totalCounter)
        return message.channel.send(ModerationEmbed)
    }
}