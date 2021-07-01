const Discord = require('discord.js');
const Report = require('../../data/report.js');

const { randomColor } = require("../../../functions.js");


module.exports = {
    name: 'ot',
    category: 'moderation',
    description: 'Взять вопрос под свой контроль',

    async run(bot, message) {
        if(message.channel.parent.id != "706191118181597250") return;
        if(!message.member.roles.cache.some(role => role.id === "822435940911284225")) return;
        let reporter = message.channel.name.slice(7);
        Report.findOne({reportUser: reporter},(err,rep) => {
            if(err) console.log(err);
            if(!rep) return message.channel.send(`**Такого репорта нет в Базе Данных!**`)
            if(rep.reportModer != "") {
                message.delete();
                return message.channel.send(`**Репорт уже взят модератором: ${message.guild.member(rep.reportModer).displayName}**`).then(msg => msg.delete({timeout: 5000}))
            }
            if(reporter === message.member.id) {
                return message.channel.send(`**Ха-ха ты хотел накрутить репорты. Но хуй тебе вот такой: .!.**`)
            }
            rep.reportModer = message.member.id;
            rep.save();
            message.delete();
            return message.channel.send(
                new Discord.MessageEmbed()
                    .setTitle(`Report | Take`)
                    .setDescription(`
                        \`Модератор:\` ${message.member.displayName}\n\`Принялся за ваш репорт!\`\n\`Ожидайте его ответа!\`
                    `)
                    .setColor(`#${randomColor()}`)
                    .setFooter(`TakeRep | ${message.guild.member(reporter).displayName}`)
            )
        })
    }
}