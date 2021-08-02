const User = require("../../data/user.js");

module.exports = async (bot, oldState, newState) => {
    if (newState.member.user.bot) return; //Если бот то выходим.
    if (newState.member.roles.cache.some(role => role.id === "736949012065943592")) return; //Если есть роли мута то выходим.
    if (newState.channel != null) {
        User.findOne({ userID: newState.member.id }, (err, data) => {
            if (err) console.log(err);
            if (!data) {
                return; //Если нет отклика от БД то выходим.
            }
            data.joinTime = Date.now(); //Записываем время захода в канал.
            return data.save();
        });

    }
    const PrivatCategory = await bot.channels.cache.find(ch => ch.id === '701697659852947466');
    if (newState.channel) {
        if (oldState.channel) {
            if (oldState.channel.parentID === '701697659852947466' && oldState.channel.name != '✅︙Создать приват') {
                if (oldState.channel.members.size <= 0) {
                    return oldState.channel.delete({ timeout: 1000 });
                }
            }
        }
        if (newState.channel.name === '✅︙Создать приват') {
            if (newState.channel.parent.children.each(ch => {
                if (ch.name === '✅︙Создать приват') return;
                if (ch.members.size <= 0) ch.delete({ timeout: 1000 });
            }));
            const NewChannel = await newState.guild.channels.create(`✅︙ ${newState.member.user.tag}`, {
                type: 'voice',
                topic: 'Privat',
                userLimit: 2,
                parent: PrivatCategory,
                permissionOverwrites: [
                    {
                        id: `${newState.member.id}`,
                        allow: ['USE_VAD', 'VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'PRIORITY_SPEAKER', 'MANAGE_CHANNELS', 'STREAM'],
                        deny: ['MOVE_MEMBERS', 'DEAFEN_MEMBERS'],
                        type: 'member'
                    },
                    {
                        id: `${newState.guild.roles.cache.find(role => role.position == 0).id}`,
                        allow: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK', 'PRIORITY_SPEAKER', 'STREAM', 'USE_VAD'],
                        deny: ['MOVE_MEMBERS', 'DEAFEN_MEMBERS', 'MUTE_MEMBERS', 'MANAGE_CHANNELS'],
                        type: 'role'
                    },
                ]
            });
            await newState.setChannel(NewChannel);
        }
    } else if (oldState.channel) {
        if (oldState.channel.parentID === '701697659852947466' && oldState.channel.name != '✅︙Создать приват') {
            if (oldState.channel.members.size <= 0) {
                return oldState.channel.delete({ timeout: 1000 });
            }
        }
    }
}


