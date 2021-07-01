const DIscord = require('discord.js')


module.exports  = {
	name: "run",
    category:"moderation",
	description: "Команда управления ботом",

	async run (bot,message,args) {
        if (message.author.id !== '407228819498336256') {
            message.reply(`\`недостаточно прав доступа!\``).then(msg => msg.delete({timeout:7000}));
            return message.delete();
        }
        let cmdrun = args.slice(0).join(" ");
        try {
            eval(cmdrun);
        } catch (err) {
            message.reply(`**\`произошла ошибка: ${err.name} - ${err.message}\`**`);
        }
    }
}