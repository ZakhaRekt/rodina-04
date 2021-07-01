const Discord = require('discord.js');
module.exports = {
	name: "embhelp",
    category:"embeds",
	description: "Просмотр помощи по ембедам",

	async run (bot,message) {
		if (!message.member.hasPermission("MANAGE_ROLES")) return;
        message.reply(`\`Команды для модерации: /embsetup, /embfield, /embsend - отправить.\``);
        return message.delete();
	}
}