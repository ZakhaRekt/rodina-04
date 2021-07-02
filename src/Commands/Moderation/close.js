const Discord = require('discord.js');
const fs = require('fs');
const Guild = require('../../data/guild.js');
const Report = require('../../data/report.js');
const moder = require('../../data/moder.js');
const { randomColor } = require("../../../functions.js");



module.exports = {
    name: 'close',
    category: 'moderation',
    description: 'Закритие вопроса',

    async run(bot, message, args) {
        const tehchannel = message.guild.channels.cache.find(c => c.name == `┃『📌』вопрос-ответ`);
        if (message.channel.parent.id === "818783877325127740") {
            if (message.member.roles.cache.some(role => role.id === "703270075666268160")) {
                if (!args[0]) return;
                const mainUser = message.mentions.members.first();
                Guild.findOne({ guildID: message.guild.id }, async (err, guild) => {
                    if (err) console.log(err);
                    if (!guild) {
                        return console.log(`Server is undefined`);
                    }
                    await Report.findOne({ reportUser: mainUser.id },  async (err, rep) => {
                        if (err) console.log(err);
                        if (!rep) {
                            return console.log(`Пользователь репорт которого вы пытаетесь закрыть не найден в БД.Обратитесь к тех адмнку.`);
                        }
                        if (rep.reportModer != message.author.id) {
                            message.delete({ timeout: 1000 });
                            return message.channel.send(`**Нельзя закрыть не свой репорт!**`)
                                .then(msg => msg.delete({ timeout: 5000 }))
                        }
                        await moder.findOne({ moderID: rep.reportModer }, async (err, mod) => {
                            if (err) console.log(err);
                            if (!mod) {
                                message.delete({ timeout: 1000 });
                                return message.channel.send(`**Нельзя закрыть не свой репорт!**`)
                                    .then(msg => msg.delete({ timeout: 5000 }))
                            }
                            mod.moderReports++;
                            mod.save();
                            rep.delete()
                            guild.activeReports--;
                            guild.closedReports++;
                            guild.save();
                            tehchannel.messages.fetch('860568685940703292')
                                .then(message => message.edit(
                                    new Discord.MessageEmbed()
                                        .setAuthor("Report » Обработчик репортов.", "https://cdn.discordapp.com/avatars/509074641025892419/c6f9ba7a1038a81f9876d162df5a89a6.png")
                                        .setTitle("Rodina Rp 04 | Report ")
                                        .setColor(`#${randomColor()}`)
                                        .addField("Правила подачи репорта:", "\`\`\`1. Запрещено оскорбительное и неадекватное поведение.\n2. Запрещено создавать репорт с некорректным вопросом.\n3. После создания репорта сразу описывайте свою проблему. \n4. Запрещено флудить @упоминаниями.\n5. Запрещено оффтопить в канал репорта.\`\`\`")
                                        .setImage("https://imgur.com/LKDbJeM.gif")
                                        .addField("Всего", `\`Обработанных запросов:\` ${guild.countReports}`, true)
                                        .addField("Всего", `\`Активных запросов:\` ${guild.activeReports}`, true)
                                        .addField("Всего", `\`Закрытых запросов:\` ${guild.closedReports}`, true)
                                        .setFooter("© Report | by Developer Montano")
                                        .setTimestamp()
                                ))
                                .catch(err => message.channel.send(err));
                            await fs.open(`src/tempfiles/${message.channel.name}.txt`, 'w', (err) => {
                                if (err) throw err;
                            });
                            await message.channel.messages.fetch().then(messages => messages.filter(msg => !msg.author.bot).sort((a,b) => a.createdAt - b.createdAt).each(msg => {
                                fs.appendFile(`src/tempfiles/${message.channel.name}.txt`, `${msg.author.tag}:${msg.content} \n`, (err) => {
                                    if (err) throw err;
                                });
                            }));
                            await message.guild.channels.cache.find(ch => ch.name === '╭『🔳』логи-репорта').send({
                                files: [{
                                    attachment: `src/tempfiles/${message.channel.name}.txt`,
                                    name: `${message.guild.member(rep.reportUser).user.tag}.txt`
                                }]
                            });
                            await fs.unlink(`src/tempfiles/${message.channel.name}.txt`, (err) => {
                                if (err) throw err;
                            })
                            await message.channel.delete();
                        });
                    });
                });
            }
            else {
                await message.delete();
                await message.channel.send("У вас нет прав для закрытия репорта!");
            }
        }
        else {
            await message.delete();
            await message.channel.send("Ай ай ай! В этом канале нельзя!");
        }
    }
}