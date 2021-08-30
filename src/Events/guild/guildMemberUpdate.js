const Discord = require('discord.js');
const { randomColor, getDateString } = require('../../../functions');
module.exports = async (bot,oldMember,newMember) => {
    if(oldMember.roles.cache.size != newMember.roles.cache.size) {
        newMember.guild.fetchAuditLogs().then(audit => {
            console.log(audit.entries.first().changes[0].new)
            if(audit.entries.first().changes[0].new[0].id == '881612862777335808') {
                let finalEmb = new Discord.MessageEmbed()
                    .setColor(`#${randomColor()}`)
                    .setDescription(`\`Изменен участник:\`<@${audit.entries.first().target.id}>\n\`Снята/добавленна роль администратора:\` <@&${audit.entries.first().changes[0].new[0].id}>\n\`Снял/выдал:\` <@${audit.entries.first().executor.id}>\n \`Дата:\`${getDateString()}`)
                    .setFooter(`Admin Role Logs`,bot.user.avatarURL())
                newMember.guild.channels.cache.get('881669531825737739').send(finalEmb)
            }
        })
    }
}