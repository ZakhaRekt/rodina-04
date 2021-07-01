const Discord = require('discord.js');
const { randomColor, errorEmbed } = require("../../../functions.js");
const Moder = require('../../data/moder');
const User = require('../../data/user');
const fs = require('fs');
var TempStr = "";

module.exports = {
    name: 'showall',
    category: 'moderation',
    description: 'Статистика всех модераторов',

    run(bot, message, args) {
        message.delete({timeout:2000})
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(errorEmbed('Вы не имеете права использовать данную команду!',message.author))
        Moder.find({}, (err, moders) => {
            if(err) console.log(err)
            if(!moders) return message.channel.send(errorEmbed('В БЕЗЕ ДАННЫХ НЕ НАЙДЕНО МОДЕРОВ', message.author))
            moders.forEach((mod,i) => {
                User.findOne({userID: mod.moderID}, (err, user) => {
                    if(err) console.log(err)
                    if(!user)  {
                        return message.channel.send(errorEmbed('МОДЕРАТОР НЕ НАЙДЕН В БАЗЕ ПОЛЬЗОВАТЕЛЕЙ', message.author))
                    }
                    TempStr += `Ник Модератора: ${mod.moderName}\n ID: ${mod.moderID} \n Warns: ${mod.moderWarns}\n Репорты: ${mod.moderReports}\n Роли: ${mod.moderAcceptedRoles}\n Сообщения: ${user.messages}\n\n`;
                    if(i == moders.length - 1) {
                        fs.open(`src/tempfiles/stats.txt`, 'w', (err) => {
                            if (err) throw err;
                        });
                        fs.appendFile(`src/tempfiles/stats.txt`, TempStr, (err) => {
                            if (err) throw err;
                        });
                        return message.channel.send({files: [{
                            attachment: `src/tempfiles/stats.txt`,
                            name: `moderStats.txt`
                        }]})
                    }
                })
            })
        })
    }
}
