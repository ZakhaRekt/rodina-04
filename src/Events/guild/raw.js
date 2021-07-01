const serverid = '465086262383083520';
const Guild = require('../../data/guild.js');
const Moder = require('../../data/moder.js');


let rolesgg = [
    "✦Сотрудники Правительства✦",
    "✦Сотрудники УВД✦",
    "✦Сотрудники ГУ-МВД✦",
    "✦Агенты ФСБ✦",
    "✦Сотрудники ВМЦ✦",
    "✦Сотрудник ПЦ-Э✦",
    "✦Солдаты Армии✦",
    "✦Сотрудники ФСИН✦",
    "✦Сотрудники МРЭО✦",
    "✦Сотрудники Банка✦",
    "✦Фантомасы✦",
    "✦Санитары✦",
    "✦Солнцевская Братва✦",
    "✦Чёрные Кошки✦",
    "✦Кавказская Мафия✦",
    "✦Украинская Мафия✦",
    "✦Русская Мафия✦",
    "✦Сотрудники Информационного Центра✦",
    "✦Сотрудники Радиоцентра✦",
    "✦Сотрудники ОКБ✦",
    "✦Прокуратура✦",
	"✦Сотрудники ГИБДД✦"
];

const events = {
    MESSAGE_REACTION_ADD: 'messageReactionAdd',
    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};
module.exports = async (bot,event) => {
	if (!events.hasOwnProperty(event.t)) return; // Если не будет добавление или удаление смайлика, то выход
    if (event.t == "MESSAGE_REACTION_ADD") {
        let event_guildid = event.d.guild_id; // ID discord сервера
        let event_channelid = event.d.channel_id; // ID канала
        let event_userid = event.d.user_id; // ID того кто поставил смайлик
        let event_messageid = event.d.message_id; // ID сообщение куда поставлен смайлик
        let event_emoji_name = event.d.emoji.name; // Название смайлика

        if (event_userid == bot.user.id) return; // Если поставил смайлик бот то выход
        if (event_guildid != serverid) return; // Если сервер будет другой то выход

        let server = bot.guilds.cache.find(g => g.id == event_guildid); // Получить сервер из его ID
        let channel = server.channels.cache.find(c => c.id == event_channelid); // Получить канал на сервере по списку каналов
        let message = await channel.messages.fetch(event_messageid); // Получить сообщение из канала
        let member = server.members.cache.find(m => m.id == event_userid); // Получить пользователя с сервера

        if (channel.name != `requests-for-roles`) return; // Если название канала не будет 'requests-for-roles', то выйти
        Guild.findOne({guildID: event_guildid}, async (err,data) => {
        		if(err) console.log(err);
        		if(!data) {
        			return console.log(`On raw event no data found!`)
        		}
	        	if (event_emoji_name == "🇩") {
	            if (!message.embeds[0]) {
	                channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
	                return message.delete();
	            } else if (message.embeds[0].title == "`Discord » Проверка на валидность ник нейма.`") {
					let field_user = server.members.cache.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
	                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
	                let field_role = server.roles.cache.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
	                let field_channel = server.channels.cache.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
	                if (!field_user || !field_nickname || !field_role || !field_channel) {
	                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос.\``);
	                } else {
	                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
	                }
	                if (data.sened.includes(field_nickname)){
	                	let person_sended = data.sened.indexOf(field_nickname); 
	                	await data.sened.splice(person_sended,1);// Отметить ник, что он не отправлял запрос
	                	await data.save();
	                } 
	                return message.delete();
	            } else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`') {
	                let field_author = server.members.cache.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
	                let field_user = server.members.cache.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
	                let field_role = server.roles.cache.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
	                let field_channel = server.channels.cache.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
	                if (!field_author || !field_user || !field_role || !field_channel) {
	                    channel.send(`\`[DELETED]\` ${member} \`удалил багнутый запрос на снятие роли.\``);
	                } else {
	                    channel.send(`\`[DELETED]\` ${member} \`удалил запрос на снятие роли от ${field_author.displayName}, с ID: ${field_author.id}\``);
	                }
	                if (data.snyatie.includes(field_author.id + `=>` + field_user.id)) {
	                	let person_snyatie = data.snyatie.indexOf(field_author.id + `=>` + field_user.id);
	                	await data.snyatie.splice(person_snyatie, 1);
	                	await data.save();
	                }
	                return message.delete();
	            }
	        } else if (event_emoji_name == "❌") {
	            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`') {
	                if (message.reactions.cache.array().length != 3) {
	                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
	                }
	                let field_user = server.members.cache.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
	                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
	                let field_channel = server.channels.cache.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
	                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
	                field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на выдачу роли.\nВаш ник при отправке: ${field_nickname}\nУстановите ник на: [Фракция Ранг/10] Имя_Фамилия\``)
	                await data.nrpnames.push(field_nickname); // Добавить данный никнейм в список невалидных
	                await data.save();
	                 if (data.sened.includes(field_nickname)){
	                	let person_nrpname = data.sened.indexOf(field_nickname);
	                	await data.sened.splice(person_nrpname,1); // Отметить ник, что он не отправлял запрос
						await data.save();
						await Moder.findOne({moderID: member.id}, (err, mod) => {
							if(err) console.log(err)
							if(!mod) return
							mod.moderAcceptedRoles++;
							mod.save()
						}) 
	                }  
	                return message.delete();
	            } else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`') {
	                if (message.reactions.cache.array().length != 3) {
	                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
	                }
	                let field_author = server.members.cache.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
	                let field_user = server.members.cache.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
	                let field_role = server.roles.cache.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
	                let field_channel = server.channels.cache.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
	                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы отклонять нельзя!\``).then(msg => msg.delete({timeout:5000}))
	                if (!field_user.roles.cache.some(r => r.id == field_role.id)) {
	                    if (data.snyatie.includes(field_author.id + `=>` + field_user.id)){
	                    	let person_dlya_snyatie = data.snyatie.indexOf(field_author.id + `=>` + field_user.id);
	                    	data.snyatie.splice(person_dlya_snyatie,1);
	                    	data.save();
	                    } 
	                    return message.delete();
	                }
	                channel.send(`\`[DENY]\` <@${member.id}> \`отклонил запрос на снятие роли от\` <@${field_author.id}>\`, с ID: ${field_author.id}\``);
	                field_channel.send(`<@${field_author.id}>**,** \`модератор\` <@${member.id}> \`отклонил ваш запрос на снятие роли пользователю:\` <@${field_user.id}>`)
	                if (data.snyatie.includes(field_author.id + `=>` + field_user.id)) {
	                	let otmena_snyatya = data.snyatie.indexOf(field_author.id + `=>` + field_user.id);
	                	data.snyatie.splice(otmena_snyatya,1);
	                	data.save();
	                } 
	                return message.delete();
	            }
	        } else if (event_emoji_name == "✔") {
	            if (message.embeds[0].title == '`Discord » Проверка на валидность ник нейма.`') {
	                if (message.reactions.cache.array().length != 3) {
	                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
	                }
					let field_user = server.members.cache.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
	                let field_nickname = message.embeds[0].fields[1].value.split(`\`Ник:\` `)[1];
	                let field_role = server.roles.cache.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
	                let field_channel = server.channels.cache.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
	                if (field_user.roles.cache.some(r => field_role.id == r.id)) {
	                    if (data.sened.includes(field_nickname)) {
	                    	let accept_sened = data.sened.indexOf(field_nickname);
	                    	data.sened.splice(accept_sened,1);
	                    	data.save();// Отметить ник, что он не отправлял запрос
	                    } 
	                    return message.delete(); // Если роль есть, то выход
	                }
	                let rolesremoved = false;
	                let rolesremovedcount = 0;
	                if (field_user.roles.cache.some(r => rolesgg.includes(r.name))) {
	                    for (var i in rolesgg) {
	                        let rolerem = server.roles.cache.find(r => r.name == rolesgg[i]);
	                        if (field_user.roles.cache.some(role => [rolesgg[i]].includes(role.name))) {
	                            rolesremoved = true;
	                            rolesremovedcount = rolesremovedcount + 1;
	                            await field_user.roles.remove(rolerem); // Забрать фракционные роли
	                        }
	                    }
	                }
	                await field_user.roles.add(field_role); // Выдать роль по соответствию с тэгом
	                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил запрос от ${field_nickname}, с ID: ${field_user.id}\``);
	                if (rolesremoved) {
	                    if (rolesremovedcount == 1) {
	                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\` \` ${field_role.name} \` \`была выдана! ${rolesremovedcount} роль другой фракции была убрана.\``)
	                    } else if (rolesremovedcount < 5) {
	                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\` \` ${field_role.name} \` \`была выдана! Остальные ${rolesremovedcount} роли других фракций были убраны.\``)
	                    } else {
	                        field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\` \` ${field_role.name} \` \`была выдана! Остальные ${rolesremovedcount} ролей других фракций были убраны.\``)
	                    }
	                } else {
	                    field_channel.send(`<@${field_user.id}>**,** \`модератор\` <@${member.id}> \`одобрил ваш запрос на выдачу роли.\`\n\`Роль\` \` ${field_role.name} \` \`была выдана!\``)
	                }
	                if (data.sened.includes(field_nickname)) {
	                	let cancel_sened = data.sened.indexOf(field_nickname);
	                	await data.sened.splice(cancel_sened,1);
						await data.save();
						await Moder.findOne({moderID: member.id}, (err,mod) => {
							if(err) console.log(err)
							if(!mod) return
							mod.moderAcceptedRoles++;
							mod.save();
						})
	                }
	                return message.delete();
	            } else if (message.embeds[0].title == '`Discord » Запрос о снятии роли.`') {
	                if (message.reactions.cache.array().length != 3) {
	                    return channel.send(`\`[ERROR]\` \`Не торопись! Сообщение еще загружается!\``)
	                }
	                let field_author = server.members.cache.find(m => "<@" + m.id + ">" == message.embeds[0].fields[0].value.split(/ +/)[1]);
	                let field_user = server.members.cache.find(m => "<@" + m.id + ">" == message.embeds[0].fields[1].value.split(/ +/)[1]);
	                let field_role = server.roles.cache.find(r => "<@&" + r.id + ">" == message.embeds[0].fields[2].value.split(/ +/)[3]);
	                let field_channel = server.channels.cache.find(c => "<#" + c.id + ">" == message.embeds[0].fields[3].value.split(/ +/)[0]);
	                if (member.id == field_author.id) return channel.send(`\`[ERROR]\` \`${member.displayName} свои запросы принимать нельзя!\``).then(msg => msg.delete({timeout:5000}))
	                if (!field_user.roles.cache.some(r => r.id == field_role.id)) {
	                    if (data.snyatie.includes(field_author.id + `=>` + field_user.id)) {
							let sn = data.snyatie.indexOf(field_author.id + `=>` + field_user.id);
							await data.snyatie.splice(sn,1);
							await data.save()
						} 
	                    return message.delete();
	                }
	                field_user.roles.remove(field_role);
	                channel.send(`\`[ACCEPT]\` <@${member.id}> \`одобрил снятие роли ${field_role.name} от\` <@${field_author.id}>, \`пользователю\` <@${field_user.id}>, \`с ID: ${field_user.id}\``);
	                field_channel.send(`**<@${field_user.id}>, с Вас сняли роль** \` ${field_role.name} \` **по запросу от <@${field_author.id}>.**`)
	                if (data.snyatie.includes(field_author.id + `=>` + field_user.id)) {
	                	let accept_snyatie = data.snyatie.indexOf(field_author.id + `=>` + field_user.id);
	                	await data.snyatie.splice(accept_snyatie,1);
	                	await data.save();
	                }
	                return message.delete()
	            }
	        }
    
        });
	}
        
}