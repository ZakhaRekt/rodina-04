const Discord = require('discord.js');

module.exports = {
	name:"ffuser",
    category:"moderation",
	description: "Поиск пользователя по тегу или нику.",
	async run(bot,message,args) {

		if (!message.member.hasPermission("MANAGE_ROLES")) return
        if (!args[0]) return
        let name = args.slice(0).join(" ");
        let userfinders = false;
        let foundedusers_nick;
        let numberff_nick = 0;
        let foundedusers_tag;
        let numberff_tag = 0;
        message.guild.members.cache.filter(userff => {
            if (userff.displayName.toLowerCase().includes(name.toLowerCase())) {
                if (foundedusers_nick == null) {
                    foundedusers_nick = `${numberff_nick + 1}) <@${userff.id}>`
                } else {
                    foundedusers_nick = foundedusers_nick + `\n${numberff_nick + 1}) <@${userff.id}>`
                }
                numberff_nick++
                if (numberff_nick == 15 || numberff_tag == 15) {
                    if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
                    if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
                    const embed = new Discord.MessageEmbed()
                        .addField(`BY NICKNAME`, foundedusers_nick, true)
                        .addField("BY DISCORD TAG", foundedusers_tag, true)
                    message.reply(`\`по вашему запросу найдена следующая информация:\``, embed);
                    numberff_nick = 0;
                    numberff_tag = 0;
                    foundedusers_tag = null;
                    foundedusers_nick = null;
                }
                if (!userfinders) userfinders = true;
            } else if (userff.user.tag.toLowerCase().includes(name.toLowerCase())) {
                if (foundedusers_tag == null) {
                    foundedusers_tag = `${numberff_tag + 1}) <@${userff.id}>`
                } else {
                    foundedusers_tag = foundedusers_tag + `\n${numberff_tag + 1}) <@${userff.id}>`
                }
                numberff_tag++
                if (numberff_nick == 15 || numberff_tag == 15) {
                    if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
                    if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
                    const embed = new Discord.MessageEmbed()
                        .addField(`BY NICKNAME`, foundedusers_nick, true)
                        .addField("BY DISCORD TAG", foundedusers_tag, true)
                    message.reply(`\`по вашему запросу найдена следующая информация:\``, embed);
                    numberff_nick = 0;
                    numberff_tag = 0;
                    foundedusers_tag = null;
                    foundedusers_nick = null;
                }
                if (!userfinders) userfinders = true;
            }
        })
        if (!userfinders) return message.reply(`я никого не нашел.`) && message.delete()
        if (numberff_nick != 0 || numberff_tag != 0) {
            if (foundedusers_tag == null) foundedusers_tag = `НЕ НАЙДЕНЫ`;
            if (foundedusers_nick == null) foundedusers_nick = `НЕ НАЙДЕНЫ`;
            const embed = new Discord.MessageEmbed()
                .addField(`BY NICKNAME`, foundedusers_nick, true)
                .addField("BY DISCORD TAG", foundedusers_tag, true)
            message.reply(`\`по вашему запросу найдена следующая информация:\``, embed);
        }
	}
}