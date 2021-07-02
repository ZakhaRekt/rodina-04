const Discord = require('discord.js');
const Guild = require('../../data/guild.js');
const Report = require('../../data/report.js');
const moder = require('../../data/moder')
module.exports = async (bot,member) => {
    const ReportChannel = bot.channels.cache.find(ch => ch.name === `вопрос-${member.id}`);
    if(ReportChannel) {
        Report.findOne({ reportUser: member.id }, (err, rep) => {
            if (err) console.log(err);
            if (!rep) return;
            moder.findOne({ moderID: rep.reportModer }, (err, mod) => {
                if (err) console.log(err)
                if (!mod) return;
                mod.moderReports++;
                mod.save();
            })
            rep.delete()
        })
        Guild.findOne({guildID:member.guild.id},(err,data) => {
            if(err) console.log(err);
            if(!data) return;
            data.closedReports++;
            data.activeReports--;
            data.save()
        });
        const tehchannel = bot.channels.cache.find(c=> c.name == `┃『📌』вопрос-ответ`);
        tehchannel.messages.fetch('860568685940703292').then(message => message.edit(
            new Discord.MessageEmbed()
                .setAuthor("Report » Обработчик репортов.","https://cdn.discordapp.com/avatars/509074641025892419/c6f9ba7a1038a81f9876d162df5a89a6.png")
                .setTitle("Rodina Rp 04 | Report")
                .setColor("#FC0202")
                .addField("Правила подачи репорта:","\`\`\`1. Запрещено оскорбительное и неадекватное поведение.\n2. Запрещено создавать репорт с некорректным вопросом.\n3. После создания репорта сразу описывайте свою проблему. \n4. Запрещено флудить @упоминаниями.\n5. Запрещено оффтопить в канал репорта.\`\`\`")
                .setImage("https://imgur.com/LKDbJeM.gif")
                .addField("Всего", `\`Обработанных запросов:\` ${guild.countReports}`, true)
                .addField("Всего",`\`Активных запросов:\` ${guild.activeReports}`,true) 
                .addField("Всего",`\`Закрытых запросов:\` ${guild.closedReports}`,true)
                .setFooter("© Report | by Developer Montano")
                .setTimestamp()
        ))
        ReportChannel.delete();
    }
}