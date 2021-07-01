const Discord = require('discord.js');
const { randomColor, errorEmbed } = require("../../../functions.js");

module.exports = {
    name: "2022",
    category: "misc",
    description: "НОВЫЙ ГОД К НА МЧИТСЯ",

    async run(bot, message, args) {
        const date1 = Date.now()
        const date2 = new Date('January 01, 2022 00:00:00');
        const date3 = date2.getTime()
        const date4 = date3 - date1
        const day = Math.trunc(date4 / 86400000)
        const hours = Math.trunc((date4 - (Math.trunc(date4 / 86400000) * 86400000)) / 3600000)
        const minutes = Math.trunc((date4 - (Math.trunc(date4 / 3600000) * 3600000)) / 60000)
        const newYearEmb = new Discord.MessageEmbed()
            .setTitle(`Новогодний Таймер | МСК`)
            .setColor(`#${randomColor()}`)
            .setDescription(`||В этом году мы ещё будем||`)
            .addField('**Дней**',`${day}`,true)
            .addField('**Часов**',`${hours-2}`,true)
            .addField('**Минут**',`${minutes}`,true)
            .setImage('https://png.pngtree.com/png-clipart/20200831/original/pngtree-2022-blue-gradient-font-png-image_5488423.jpg')
            .setFooter(`Happy 2022 Year | Team Rodina RP`)
        return message.reply(newYearEmb)
    }
}