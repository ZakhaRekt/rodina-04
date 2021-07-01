const Discord = require('discord.js');

const { randomColor, formatDate } = require("../../../functions.js");
const moder = require('../../data/moder.js');


module.exports = {
    name: 'moderstats',
    category: 'moderation',
    description: 'Статистика модератора',

    async run(bot, message, args) {
        if(!args[0]) {
            moder.findOne({moderID:message.member.id}, (err,mod) => {
                if(err) console.log(err);
                if(!mod) return message.channel.send(`**Вы не являетесь модератором!**`);
                let moderStatsEmbed = new Discord.MessageEmbed()
                    .setTitle(`Moder Stats | ${message.member.displayName}`)
                    .addField(`\`Никнейм:\``, `${mod.moderName}`)
                    .addField(`\`ID:\``, `${mod.moderID}`)
                    .addField(`\`Предупреждений:\``, `${mod.moderWarns}`)
                    .addField(`\`Репорты:\``, `${mod.moderReports}`)
                    .addField(`\`Одобренных/отклонённых ролей:\``, `${mod.moderAcceptedRoles}`)
                    .addField(`\`Количество ролей:\``, `${message.member.roles.cache.size}`)
                    .addField(`\`Самая высокая роль модератора:\``, `${message.member.roles.highest.name}`)
                    .addField(`\`Введён в базу данных:\``, `${mod.moderSince}`)
                    .addField(`\`На сервере с:\``, `${formatDate(message.member.joinedAt)} `)
                    .setColor(`#${randomColor()}`)
                    .setImage(`https://i.imgur.com/h2sU9kk.png`)
                    .setFooter(`Stats | ${message.member.displayName}`)
                return message.channel.send(moderStatsEmbed);  
            })
        }
        else {
            let memberStats = message.mentions.members.first();
            if(!memberStats) {
                return message.channel.send("\`Синтаксис:\` /moderstats <упоминание>")
            }
            moder.findOne({moderID:memberStats.id}, (err,mod) => {
                if(err) console.log(err);
                if(!mod) return message.channel.send(`**Пользователь не является модератором!**`);
                let moderStatsEmbed = new Discord.MessageEmbed()
                    .setTitle(`Moder Stats | ${memberStats.displayName}`)
                    .addField(`\`Никнейм:\``, `${mod.moderName}`)
                    .addField(`\`ID:\``, `${mod.moderID}`)
                    .addField(`\`Предупреждений:\``, `${mod.moderWarns}`)
                    .addField(`\`Репорты:\``, `${mod.moderReports}`)
                    .addField(`\`Одобренных/отклонённых ролей:\``, `${mod.moderAcceptedRoles}`)
                    .addField(`\`Количество ролей:\``, `${memberStats.roles.cache.size}`)
                    .addField(`\`Самая высокая роль модератора:\``, `${memberStats.roles.highest.name}`)
                    .addField(`\`Введён в базу данных:\``, `${mod.moderSince}`)
                    .addField(`\`На сервере с:\``, `${formatDate(memberStats.joinedAt)} `)
                    .setColor(`#${randomColor()}`)
                    .setImage(`https://i.imgur.com/h2sU9kk.png`)
                    .setFooter(`Stats | ${memberStats.displayName}`)  
                return message.channel.send(moderStatsEmbed);
            })
        }
    }
}