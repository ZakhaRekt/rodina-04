const Discord = require('discord.js');
const MafiaGame = require('../../data/mafia.js');
 
const mafiaTextChannel = '812974281574318092'; //Текстовой канал мафии
const mafiaRolePlayer = '812983805060186112'; //Роль играков мафии
const mafiaRoleLeading = '812974801446240267'; //Роль ведущего
 
module.exports = {
    name: 'mkill',
    category:"mafia",
    description: "Убить игрока",
    
    async run(bot,message,args) {
        if(message.channel.id != mafiaTextChannel) return;
        if(!message.member.roles.cache.some(role => role.id === mafiaRoleLeading)) return;
        MafiaGame.findOne({gameName:`game-${message.author.id}`, started:true}, async(err,data) => {
            if(err) console.log(err);
            if(!data) {
                return message.channel.send(`**Вы не ведущий!**`);
            }
            if(!args[0]) {
                await message.delete()
                return message.channel.send("\|\|Вы не указали пользователя!\|\|")
                .then(msg => msg.delete({timeout: 10000}))
            }
            let MemberToKill = message.mentions.members.first();
            if(!MemberToKill) {
                await message.delete()
                return message.channel.send("\|\|Пользовтель не найден на сервере!\|\|")
                .then(msg => msg.delete({timeout: 12000}))
            } 
            if(data.paused) return message.channel.send(`**Нельзя убить игрока, когда стоит пауза!**`);
            if(!data.players.includes(MemberToKill)) return message.channel.send(`\`Вы не можете убить игрока которого нет в списке!\` `)
            await MemberToKill.setNickname(`${data.playersNicknames.get(MemberToKill.id)}`);
            await MemberToKill.roles.remove(mafiaRolePlayer);
            await data.playersNicknames.delete(MemberToKill.id);
            let player = data.players.indexOf(MemberToKill.id);
            await data.players.splice(player,1);
            await data.save();
            const KilledEmb = new Discord.MessageEmbed()
                .setTitle(`**Убит игрок!**`)
                .setColor(`RED`)
                .setDescription(`
                    Убит:${MemberToKill}. \n
                    `);
            await message.channel.send(KilledEmb);
        });
    }
}