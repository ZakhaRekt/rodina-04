const Discord = require('discord.js');
const ModerationRoles = [
    '★ Куратор Discord\'a ★',
    '★ Заместитель Куратора Discord\'a ★',
    'ム Supreme Moderator ム',
    '✘ Moderator Discord ✘',
    '❖ Junior Moderator ❖'
];

module.exports = {
	name: "moderation",
    category:"moderation",
	description: "Список модераторов",

    async run (bot,message) {
        var totalCounter = 0;
        const ModerationEmbed = new Discord.MessageEmbed()
            .setColor(`${message.member.displayHexColor}`)
            .setTitle(`**Список модераторов | Rodina Easten District**`)
        ModerationRoles.forEach(element => {
            message.guild.roles.cache.each(role => {
                if(role.name === element) {
                    var ids = "";
                    totalCounter += role.members.size;
                    role.members.each(member =>  ids = ids + `<@${member.id}>` + "\n")
                    if(ids === '') return;
                    ModerationEmbed.addField(`**${role.name} - ${role.members.size}**`,ids)
                }
            })
        })
        ModerationEmbed.addField(`**Всего Модераторов**`,totalCounter)
        return message.channel.send(ModerationEmbed)
    }
}