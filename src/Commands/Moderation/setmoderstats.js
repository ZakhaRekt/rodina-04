const Discord = require('discord.js');
const Moder = require('../../data/moder');
const {errorEmbed} = require('../../../functions');
module.exports = {
	name: "setmoderstats",
    category:"moderation",
	description: "Установить статистику модератору.",

	async run (bot,message,args) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply(`\`Ты не можешь использовать эту команду!\``)
        if(!args[0] || !args[1] || !args[2]) {
            return message.reply(errorEmbed('Синтаксис команды: /setmoderstats @упоминание [1 - Report 2 - Roles] value', message.author))
        }
        if(!message.mentions.members.first()) {
            return message.reply(errorEmbed('Человека которого вы упомянули нет на сервере!', message.author))
        }
        if(isNaN(+args[1]) || isNaN(+args[2])) {
            return message.reply(errorEmbed('Значение агрументов принимается только в цифрах!', message.author))
        }
        if(+args[1] > 2 || +args[1] < 1) {
            return message.reply(errorEmbed('Аргумент первый агрумент только цифры 1 или 2', message.author))
        }
        Moder.findOne({moderID: message.mentions.members.first().id}, (err,moder) => {
            if(err) console.log(err);
            if(!moder) {
                return message.reply(errorEmbed('Пользователь которого вы упомянули не является модератором!', message.author))
            }
            if(+args[1] == 1) {
                moder.moderReports = +args[2];
                moder.save();
                return message.reply(`\`Успех! Модератору:\` <@${moder.moderID}> \`установленно\` **${+args[2]}** \`репорта.\``)
            }
            if(+args[1] == 2) {
                moder.moderAcceptedRoles = +args[2];
                moder.save();
                return message.reply(`\`Успех! Модератору:\` <@${moder.moderID}> \`установленно\` **${+args[2]}** \`выданных/отклоненных ролей.\``)
            }
        })
    }
}