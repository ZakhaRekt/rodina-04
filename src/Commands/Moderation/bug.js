const Discord = require('discord.js');
module.exports = {
	name: "bug",
    category:"moderation",
	description: "Написать разрабу что у него в гавнокоде баг.",

	async run (bot,message,args) {
		if (!args[0]) {
            message.reply(`\`привет! Для отправки отчета об ошибках используй: /bug [текст]\``).then(msg => msg.delete({timeout:15000}));
            return message.delete()
        }
        let bugreport = args.slice(0).join(" ");
        if (bugreport.length < 5 || bugreport.length > 1300) {
            message.reply(`\`нельзя отправить запрос с длинной меньше 5 или больше 1300 символов!\``).then(msg => msg.delete({timeout:15000}));
            return message.delete()
        }
        let author_bot = message.guild.members.cache.find(m => m.id == 407228819498336256);
        if (!author_bot) {
            message.reply(`\`я не смог отправить сообщение.. Создателя данного бота нет на данном сервере.\``).then(msg => msg.delete({timeout:15000}));
            return message.delete()
        }
        author_bot.send(`**Привет, Kory_McGregor! Пользователь <@${message.author.id}> \`(${message.author.id})\` отправил запрос с сервера \`${message.guild.name}\` \`(${message.guild.id})\`.**\n` +
            `**Суть обращения:** ${bugreport}`);
        message.reply(`\`хэй! Я отправил твое сообщение на рассмотрение моему боссу робохомячков!\``).then(msg => msg.delete({timeout:15000}));
        return message.delete();
	} 
}