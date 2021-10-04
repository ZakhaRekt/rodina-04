const Discord = require('discord.js');
const Moder = require('../../data/moder');
module.exports = {
	name: "resetmoderstats",
    category:"moderation",
	description: "Сбросить статистику всех модераторов.",

	async run (bot,message) {
        if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply(`\`Ты не можешь использовать эту команду!\``)
        message.channel.send(`\`Вы точно хотите стереть всю статистику модераторов? Ответ только да/нет\``).then(msg => {
            message.channel.awaitMessages(response => response.member.id == message.member.id, {
                max: 1,
                time: 60000,
                errors: ['time'],
            }).then(async collected => {
                if (!collected.first().content.toLowerCase().includes('да')) return msg.delete();
                collected.first().delete();
                msg.delete();
                await Moder.find({}, (err, moders) => {
                    if(err) return message.channel.send('ОШИБКА БАЗЫ ДАННЫХ, НЕ УДАЛОСЬ УДАЛИТЬ СТАТИСТИКУ МОДЕРАТОРОВ!')
                    moders.forEach(async moder => {
                        moder.moderReports = 0;
                        moder.moderAcceptedRoles = 0;
                        await moder.save()
                    })
                })
                await message.channel.send('Успешно! Статистика модераторов обнулена!')
            })
        })
    }
}