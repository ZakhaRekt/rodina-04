const Discord = require('discord.js');
const User = require('../../data/user.js');
const Guild = require('../../data/guild.js');
const Report = require('../../data/report.js');
const moder = require('../../data/moder.js');
const { randomColor } = require('../../../functions');




let tags = ({
    "ПРА-ВО":"★ Правительство ★",
    "АШ":"★ Центр Лицензирования ★",
    "ЦБ":"★ Центральный Банк ★",
    "РЦ-Л":"★ Радиостанция \"Рокс\" ★",
    "РЦ-А":"★ Радиостанция Арзамас ★",
    "МЗ-Л":"★ МЗ-Л ★",
    "МЗ-А":"★ МЗ-А ★",
    "ГУ-МВД":"★ ГУ МВД ★",
    "ГИБДД":"★ ГИБДД ★",
    "ФСИН":"★ ФСИН ★",
    "ФСБ":"★ ФСБ ★",
    "АРМИЯ":"★ Армия ★",
    "РМ":"★ Русская Мафия ★",
    "УМ":"★ Украинская Мафия ★",
    "КМ":"★ Кавказская Мафия ★",
    "ФМ":"★ Фантомасы ★",
    "СБ":"★ Солнцевская Братва ★",
    "СТ":"★ Санитары ★",
    "ЧК":"★ Чёрная Кошка ★"
});
let manytags = [
    "ПРА-ВО",
    "АШ",
    "ЦБ",
    "РЦ-Л",
    "РЦ-А",
    "МЗ-Л",
    "МЗ-А",
    "ГУ-МВД",
    "ГИБДД",
    "ФСИН",
    "ФСБ",
    "АРМИЯ",
    "РМ",
    "УМ",
    "КМ",
    "ФМ",
    "СБ",
    "СТ",
    "ЧК"
];
let rolesgg = [
    "★ Правительство ★",
    "★ Центр Лицензирования ★",
    "★ Центральный Банк ★",
    "★ Радиостанция \"Рокс\" ★",
    "★ Радиостанция Арзамас ★",
    "★ МЗ-Л ★",
    "★ МЗ-А ★",
    "★ ГУ МВД ★",
    "★ ГИБДД ★",
    "★ ФСИН ★",
    "★ ФСБ ★",
    "★ Армия ★",
    "★ Русская Мафия ★",
    "★ Украинская Мафия ★",
    "★ Кавказская Мафия ★",
    "★ Фантомасы ★",
    "★ Солнцевская Братва ★",
    "★ Санитары ★",
    "★ Чёрная Кошка ★"
];


let canremoverole = [
    "⚒ Support Team ⚒",
    "★ Лидер Гос. Структур ★",
    "★ Лидер Нелегальной Орг. ★"
];


module.exports = async (bot, message) => {
    //if(message.guild.id != serverid) return;
    if (message.type === "PINS_ADD") return message.delete();
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;

    /*
    *
    *
    *    Системы
    *
    */

    Guild.findOne({ guildID: message.guild.id }, (err, res) => {
        if (err) console.log(err);
        if (!res) {
            let guild = new Guild({ guildID: message.guild.id });
            console.log(`В базу данных добавленна гильдия ${message.guild.name}`);
            return guild.save().catch(err => message.channel.send(`\`[❌DataBase]\` Произошла ошибка при сохранении данных в базу-данных. Ошибка: \`\`\`${err}\`\`\``));
        }
    });
    User.findOne({ userID: message.author.id }, (err, res) => {
        if (err) return message.channel.send(`\`[❌DataBase]\` Произошла ошибка при добавлении пользователя в базу-данных`);
        if (!res) {
            let user = new User({ userID: message.author.id })
            user.messages++;
            return user.save().catch(err => message.channel.send(`\`[❌DataBase]\` Произошла ошибка при сохранении данных в базу-данных. Ошибка: \`\`\`${err}\`\`\``));
        }
        res.messages++;
        res.save().catch(err => console.log(`Ты идиот не можешь нормально сохранить данные! ${err}`))
    });

    if (message.content.toLowerCase().includes("сними") || message.content.toLowerCase().includes("снять")) {
        Guild.findOne({ guildID: message.guild.id }, async (err, data) => {
            if (!message.member.roles.cache.some(r => canremoverole.includes(r.name)) && !message.member.hasPermission("MANAGE_ROLES")) return
            const args = message.content.split(/ +/);
            let onebe = false;
            let twobe = false;
            args.forEach(word => {
                if (word.toLowerCase().includes(`роль`)) onebe = true
                if (word.toLowerCase().includes(`у`)) twobe = true
            })
            if (!onebe || !twobe) return
            if (message.mentions.users.size > 1) return message.react(`📛`)
            let user = message.guild.member(message.mentions.users.first());
            if (!user) return message.react(`📛`)
            if (data.snyatie.includes(message.author.id + `=>` + user.id)) return message.react(`🕖`)
            let reqchat = message.guild.channels.cache.find(c => c.name == `📥︙requests-for-roles`); // Найти чат на сервере.
            if (!reqchat) {
                message.reply(`\`Ошибка выполнения. Канал 📥︙requests-for-roles не был найден!\``)
                return console.error(`Канал 📥︙requests-for-roles не был найден!`)
            }
            let roleremove = user.roles.cache.find(r => rolesgg.includes(r.name));
            if (!roleremove) return message.react(`📛`)

            message.reply(`\`напишите причину снятия роли.\``).then(answer => {
                message.channel.awaitMessages(response => response.member.id == message.member.id, {
                    max: 1,
                    time: 60000,
                    errors: ['time'],
                }).then((collected) => {
                    const embed = new Discord.MessageEmbed()
                        .setTitle("`Discord » Запрос о снятии роли.`")
                        .setColor("#483D8B")
                        .addField("Отправитель", `\`Пользователь:\` <@${message.author.id}>`)
                        .addField("Кому снять роль", `\`Пользователь:\` <@${user.id}>`)
                        .addField("Роль для снятия", `\`Роль для снятия:\` <@&${roleremove.id}>`)
                        .addField("Отправлено с канала", `<#${message.channel.id}>`)
                        .addField("Причина снятия роли", `${collected.first().content}`)
                        .addField("Информация", `\`[✔] - снять роль\`\n` + `\`[❌] - отказать в снятии роли\`\n` + `\`[D] - удалить сообщение\``)
                        .setFooter("© Support Team | by Kory_McGregor")
                        .setTimestamp()
                    reqchat.send(embed).then(async msgsen => {
                        answer.delete();
                        collected.first().delete();
                        await msgsen.react('✔')
                        await msgsen.react('❌')
                        await msgsen.react('🇩')
                        await msgsen.pin();
                    })
                    data.snyatie.push(message.author.id + `=>` + user.id);
                    data.save();
                    return message.react(`📨`);
                }).catch(() => {
                    return answer.delete()
                });
            });
        });
    }



    if (message.content.toLowerCase().includes("роль") && !message.content.toLowerCase().includes(`сними`) && !message.content.toLowerCase().includes(`снять`)) {
        Guild.findOne({ guildID: message.guild.id }, async (err, data) => {
            if (err) console.log(err);
            if (!data) {
                console.log(`No message data for ${message.guild.name}`);
            }
            // Проверить невалидный ли ник.
            if (data.nrpnames.includes(message.member.displayName)) {
                if (message.member.roles.cache.some(r => rolesgg.includes(r.name))) {
                    for (var i in rolesgg) {
                        let rolerem = bot.guilds.cache.find(g => g.id == message.guild.id).roles.cache.find(r => r.name == rolesgg[i]);
                        if (message.member.roles.cache.some(role => [rolesgg[i]].includes(role.name))) {
                            await message.member.roles.remove(rolerem); // Забрать роли указанные ранее.
                        }
                    }
                }
                let govrole = message.guild.roles.cache.find(r => r.name == `★ Государственные структуры ★`);
                if (message.member.roles.cache.some(r => r == govrole)) {
                    await message.member.roles.remove(govrole)
                }
                message.react(`📛`) // Поставить знак стоп под отправленным сообщением.
                return // Выход
            }
            // Проверить все доступные тэги
            for (var i in manytags) {
                let nicknametest = message.member.displayName.toLowerCase();
                nicknametest = nicknametest.replace(/ /g, '');
                if (nicknametest.includes("[" + manytags[i].toLowerCase()) || nicknametest.includes(manytags[i].toLowerCase() + "]") || nicknametest.includes("(" + manytags[i].toLowerCase()) || nicknametest.includes(manytags[i].toLowerCase() + ")") || nicknametest.includes("{" + manytags[i].toLowerCase()) || nicknametest.includes(manytags[i].toLowerCase() + "}")) {
                    let rolename = tags[manytags[i].toUpperCase()] // Указать название роли по соответствию с тэгом
                    let role = message.guild.roles.cache.find(r => r.name == rolename); // Найти эту роль на discord сервере.
                    let reqchat = message.guild.channels.cache.find(c => c.name == `📥︙requests-for-roles`); // Найти чат на сервере.
                    if (!role) {
                        message.reply(`\`Ошибка выполнения. Роль ${rolename} не была найдена.\``)
                        return console.error(`Роль ${rolename} не найдена!`);
                    } else if (!reqchat) {
                        message.reply(`\`Ошибка выполнения. Канал 📥︙requests-for-roles не был найден!\``)
                        return console.error(`Канал 📥︙requests-for-roles не был найден!`)
                    }
                    if (message.member.roles.cache.some(r => [rolename].includes(r.name))) {
                        return message.react(`👌`) // Если роль есть, поставить окей.
                    }
                    if (data.sened.includes(message.member.displayName)) return message.react(`🕖`) // Если уже отправлял - поставить часы.
                    let nickname = message.member.displayName;
                    const embed = new Discord.MessageEmbed()
                        .setTitle("`Discord » Проверка на валидность ник нейма.`")
                        .setColor("#483D8B")
                        .addField("Аккаунт", `\`Пользователь:\` <@${message.author.id}>`, true)
                        .addField("Никнейм", `\`Ник:\` ${nickname}`, true)
                        .addField("Роль для выдачи", `\`Роль для выдачи:\` <@&${role.id}>`)
                        .addField("Отправлено с канала", `<#${message.channel.id}>`)
                        .addField("Информация по выдачи", `\`[✔] - выдать роль\`\n` + `\`[❌] - отказать в выдачи роли\`\n` + `\`[D] - удалить сообщение\``)
                        .setFooter("© Support Team | by Kory_McGregor")
                        .setTimestamp()
                    reqchat.send(embed).then(async msgsen => {
                        await msgsen.react('✔')
                        await msgsen.react('❌')
                        await msgsen.react('🇩')
                        await msgsen.pin();
                    })
                    data.sened.push(message.member.displayName); // Пометить данный ник, что он отправлял запрос.
                    data.save();
                    return message.react(`📨`);
                }
            }
        });
    }
    if (message.channel.id === "820618831214411796") {
        const reportAuthor = message.author.id;
        Report.findOne({ reportUser: message.author.id }).then(async data => {
            if (!data) {
                let newUser = new Report({ reportUser: message.author.id });
                await newUser.save();
                await Guild.findOne({ guildID: message.guild.id }, async(err, guild) => {
                    if (err) console.log(err);
                    if (!guild) {
                        return console.log(`Сервер не найден`);
                    }
                    const tehchannel = message.guild.channels.cache.find(c => c.name == `📌︙вопрос-ответ`);
                    const supportedRoles = [
                        "⚒ Support Team ⚒",
                        "🕊️ Администратор 4 LVL 🕊️",
                    ];
                    const moderRole = message.guild.roles.cache.find(r => r.name == supportedRoles[0]);
                    const embedFinish = new Discord.MessageEmbed()
                        .setTitle("`Report » Поступила новый вопрос/жалоба.`")
                        .setColor(`${message.member.displayHexColor}`)
                        .addField("От", `\`Пользователя:\` <@${message.author.id}>`, true)
                        .addField("Отправлено с канала", `<#${message.channel.id}>`)
                        .addField("Вам помогут:", `<@&${moderRole.id}> - Модераторы`)
                        .addField("Текст вопроса:", `\`${message.content}\``)
                        .addField("Если у вас не осталось вопросов", `\`Вы можете закрыть свое обращение нажав на \`  ✔`)
                        .setFooter("© Report | by Developer Montano")
                        .setTimestamp();
                    const generatedChannel = `вопрос-${message.author.id}`;
                    try {
                        await message.member.send(`\`Канал вашего обращения  - ${generatedChannel}\``)
                    } catch (err) {
                        console.log(`У ${message.member.displayName} закрыта личка! //Report`)
                    }
                    if (message.guild.channels.cache.some(c => c.name === generatedChannel)) {
                        return message.channel.send(`\`Канал\` **${generatedChannel}** \`уже существует\``).then(msg => msg.delete({ timeout: 5000 }));
                    }
                    guild.countReports++;
                    guild.activeReports++;
                    const supportEmbed = new Discord.MessageEmbed()
                        .setAuthor("Report » Обработчик репортов.", "https://cdn.discordapp.com/avatars/509074641025892419/c6f9ba7a1038a81f9876d162df5a89a6.png")
                        .setTitle("Rodina Rp 04 | Report")
                        .setColor(`${message.member.displayHexColor}`)
                        .addField("Правила подачи репорта:", "\`\`\`1. Запрещено оскорбительное и неадекватное поведение.\n2. Запрещено создавать репорт с некорректным вопросом.\n3. После создания репорта сразу описывайте свою проблему. \n4. Запрещено флудить @упоминаниями.\n5. Запрещено оффтопить в канал репорта.\`\`\`")
                        .setImage("https://imgur.com/LKDbJeM.gif")
                        .addField("Всего", `\`Обработанных запросов:\` ${guild.countReports}`, true)
                        .addField("Всего", `\`Активных запросов:\` ${guild.activeReports}`, true)
                        .addField("Всего", `\`Закрытых запросов:\` ${guild.closedReports}`, true)
                        .addField("Последний репорт от пользователя:", `<@${message.author.id}>`, true)
                        .setFooter("© Report | by Developer Montano")
                        .setTimestamp();
                    tehchannel.messages.fetch('860568685940703292')
                        .then(message => message.edit("", { embed: supportEmbed }))
                        .catch(err => message.channel.send(err));
                    const newChannel = message.guild.channels.create(generatedChannel, { type: 'text' })
                        .then(r => r.setParent("818783877325127740"))
                        .then(m => m.createOverwrite(message.author, {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: true,
                            READ_MESSAGE_HISTORY: true,
                            MANAGE_REACTIONS: true
                        }))
                        .then(i => i.createOverwrite(message.guild.roles.cache.get(message.guild.id), {
                            VIEW_CHANNEL: false,
                            SEND_MESSAGES: false,
                        }))
                        .then(c => c.createOverwrite(message.guild.roles.cache.find(role => role.name === supportedRoles[0]), {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: true,
                            READ_MESSAGE_HISTORY: true
                        }))
                        .then(c => c.createOverwrite(message.guild.roles.cache.find(role => role.name === supportedRoles[1]), {
                            VIEW_CHANNEL: true,
                            SEND_MESSAGES: true,
                            READ_MESSAGE_HISTORY: true
                        })).then(channel => channel.send(`<@${reportAuthor}>`,embedFinish))
                        .then(async msg => {
                            await msg.react('✔');
                            await msg.pin();
                            const filter = (reaction, user) => reaction.emoji.name === '✔' && user.id === `${message.member.id}`;
                            msg.awaitReactions(filter, {
                                max: 1,
                                time: 86400000,
                                errors: ['time']
                            })
                                .then(async collected => {
                                    await collected.first().message.channel.delete();
                                    await Report.findOne({ reportUser: message.member.id }, async (err, rep) => {
                                        if (err) console.log(err);
                                        if (!rep) {
                                            return console.log(`Репорта уже нету`)
                                        }
                                        if (rep.reportModer != "") {
                                            await moder.findOne({ moderID: rep.reportModer }, async (err, mod) => {
                                                if (err) console.log(err);
                                                if (!mod) return;
                                                mod.moderReports++;
                                                await mod.save();
                                            })
                                        }
                                        await rep.delete();
                                        guild.closedReports++;
                                        guild.activeReports--;
                                        await guild.save();
                                        await tehchannel.messages.fetch('860568685940703292')
                                            .then(message => message.edit("",{
                                                embed:new Discord.MessageEmbed()
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
                                            }))
                                            .catch(err => console.log(err));
                                        try {
                                            await message.member.send(`\`Вы закрыли свой запрос!\``);
                                        }
                                        catch (e) {
                                            console.log(`У ${message.member.displayName} закрыта личкa!`)
                                        }
                                    })
                                        .catch(console.error);
                                })
                                .catch(err => console.log(`error`));
                            message.delete();
                            guild.save();
                        })
        
                });
            }
            else {
                message.delete();
                console.log('Закончено')
                return message.channel.send(`<@${reportAuthor}> \`Вы не можете создать репорт повторно! \``)
                    .then(msg => msg.delete({ timeout: 5000 }));
            }
        }).catch(err => console.log(err))

    }







    /*
    *
    *
    *    Команды
    *
    */


    let prefix = "-";

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);


    if (!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));

    if (!cmd) return;

    if (cmd) cmd.run(bot, message, args);
}

