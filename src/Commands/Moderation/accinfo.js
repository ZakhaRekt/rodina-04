const Discord = require('discord.js');

module.exports = {
	name:"accinfo",
    category:"moderation",
	description: "Информация о пользователе",

	async run(bot,message,args) {
		if (!message.member.hasPermission("MANAGE_ROLES")) return
        let user = message.guild.member(message.mentions.users.first());
        if (user) {
            let userroles;
            await user.roles.cache.filter(role => {
                if (userroles == undefined) {
                    if (!role.name.includes("everyone")) userroles = `<@&${role.id}>`
                } else {
                    if (!role.name.includes("everyone")) userroles = userroles + `, <@&${role.id}>`
                }
            })
            let perms;
            if (user.hasPermission("ADMINISTRATOR") || user.hasPermission("MANAGE_ROLES")) {
                perms = "[!] Пользователь модератор [!]";
            } else {
                perms = "У пользователя нет админ прав."
            }
            if (userroles == undefined) {
                userroles = `отсутствуют.`
            }
            let date = user.user.createdAt;
            let registed = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            date = user.joinedAt
            let joindate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            const embed = new Discord.MessageEmbed()
                .setColor("#FF0000")
                .setFooter(`Аккаунт пользователя: ${user.displayName}`, user.user.avatarURL)
                .setTimestamp()
                .addField(`Дата создания аккаунта и входа на сервер`, `**Аккаунт создан:** \`${registed}\`\n**Вошел к нам:** \`${joindate}\``)
                .addField("Roles and Permissions", `**Роли:** ${userroles}\n**PERMISSIONS:** \`${perms}\``)
            message.reply(`**вот информация по поводу аккаунта <@${user.id}>**`, embed)
            return message.delete();
        } else {
            if (!args[0]) return
            let name = args.slice(0).join(" ");
            let foundmember = false;
            await message.guild.members.cache.filter(f_member => {
                if (f_member.displayName.includes(name)) {
                    foundmember = f_member
                } else if (f_member.user.tag.includes(name)) {
                    foundmember = f_member
                }
            })
            if (foundmember) {
                let user = foundmember
                let userroles;
                await user.roles.cache.filter(role => {
                    if (userroles == undefined) {
                        if (!role.name.includes("everyone")) userroles = `<@&${role.id}>`
                    } else {
                        if (!role.name.includes("everyone")) userroles = userroles + `, <@&${role.id}>`
                    }
                })
                let perms;
                if (user.hasPermission("ADMINISTRATOR") || user.hasPermission("MANAGE_ROLES")) {
                    perms = "[!] Пользователь модератор [!]";
                } else {
                    perms = "У пользователя нет админ прав."
                }
                if (userroles == undefined) {
                    userroles = `отсутствуют.`
                }
                let date = user.user.createdAt;
                let registed = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                date = user.joinedAt
                let joindate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
                const embed = new Discord.MessageEmbed()
                    .setColor("#FF0000")
                    .setFooter(`Аккаунт пользователя: ${user.displayName}`, user.user.avatarURL)
                    .setTimestamp()
                    .addField(`Краткая информация`, `**Аккаунт создан:** \`${registed}\`\n**Вошел к нам:** \`${joindate}\``)
                    .addField("Roles and Permissions", `**Роли:** ${userroles}\n**PERMISSIONS:** \`${perms}\``)
                message.reply(`**вот информация по поводу аккаунта <@${user.id}>**`, embed)
            }
            return message.delete();
        }
	}
}