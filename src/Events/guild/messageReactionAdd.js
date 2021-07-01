const Discord = require('discord.js');

const MafiaGame = require('../../data/mafia.js');
const { getRandomInt, randomColor } = require("../../../functions.js");

const mafiaVoiceChannel = '812974460260450314'; //Войс канал мафии
const mafiaTextChannel = '812974281574318092'; //Текстовой канал мафии
const mafiaRolePlayer = '812983805060186112'; //Роль играков мафии
const mafiaRoleLeading = '812974801446240267'; //Роль ведущего

module.exports = async (_bot, reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  if (user.bot) return;
  if (!reaction.message.guild) return;

  if (reaction.message.channel.id === mafiaTextChannel) {
    MafiaGame.findOne({ started: false }, async (err, data) => {
      if (err) console.log(err);
      if (!data) {
        return console.log(`No data found on Readction Add`);
      }
      const mainEmb = new Discord.MessageEmbed()
        .setTitle(`Начинаем!`)
        .setColor(`RED`)
        .setFooter(`✔ - записаться на игру | ▶️ - начать игру | ❌ - отменить игру`)


      /*Регистрация*/
      if (reaction.emoji.name === "✔") {
        if (reaction.message.author.bot) {
          if (reaction.count >= 12 || reaction.message.guild.member(user).voice.channel.id != mafiaVoiceChannel) {
            const userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));
            try {
              for (const react of userReactions.values()) {
                return await react.users.remove(user.id);
              }
            } catch (error) {
              console.error('Failed to remove reactions.');
            }
          }
        }
        if (reaction.message.guild.member(user).voice.channel.id != mafiaVoiceChannel) return;
        if (reaction.message.guild.member(user.id).roles.cache.some(role => role.id === mafiaRoleLeading)) return;
        await data.gamersDescription.push(`<@${user.id}>`);
        await data.players.push(user.id);

        await data.save().catch(err => console.log(err));
        mainEmb.setDescription(data.gamersDescription.join(", \n"));
        setTimeout(async () => {
          await reaction.message.edit(mainEmb);
        }, 1000)
      }


      /*Старт игры*/
      if (reaction.emoji.name === "▶️") {
        if (!reaction.message.guild.member(user).roles.cache.some(role => role.id === mafiaRoleLeading)) return;
        if (data.players.length < 10) return reaction.message.channel.send(`Вы не можете начать игру, не хватает игроков! ${data.players.length}/10`);
        await reaction.message.channel.send(`<@${user.id}> Начал игру! Идёт раздача ролей!`);
        bot.guilds.create(`Mafia | ${user.tag}`, {
          channels: [{
            name: 'mafia-channel',
            type: 'text',
            topic: 'Для выбора мафии, что-бы сделать выбор упомяните ведущего!'
          }]
        }).then(guild => {
          guild.channels.cache.find(channel => channel.name === 'mafia-channel').createInvite({
            temporary: true,
            maxAge: 120,
            maxUses: 3,
            reason: 'Mafia Invite'
          }).then(async invite => {
            await data.players.forEach((element, index) => {
              if (!reaction.message.guild.channels.cache.find(ch => ch.id === mafiaVoiceChannel).members.has(element)) {
                reaction.message.channel.send(`<@${element}> Зайдите в голосовой канал ${reaction.message.guild.channels.cache.find(ch => ch.id == mafiaVoiceChannel).name}!`);
              }
              data.playersNicknames.set(element, reaction.message.guild.member(element).displayName);
              data.fouls.set(element, 0);
              const randomRole = getRandomInt(0, data.roles.length);
              const Role = new Discord.MessageEmbed()
                .setTitle(`**Выдача ролей**`)
                .setColor(`${randomColor()}`)
              switch (data.roles[randomRole]) {
                case 'Мафия':
                  Role
                    .setImage(`https://img.championat.com/s/735x490/news/big/s/d/remaster-pervoj-mafia-otlozhili-do-sentjabrja_1594137292373921021.jpg`)
                    .setDescription(`Ваша роль Мафия`);
                  break
                case 'Дон Мафии':
                  Role
                    .setImage(`https://static.wikia.nocookie.net/allmafia/images/0/05/%D0%94%D0%BE%D0%BD_%D0%A1%D0%B0%D0%BB%D1%8C%D0%B5%D1%80%D0%B8.jpg/revision/latest/scale-to-width-down/350?cb=20200826183925&path-prefix=ru`)
                    .setDescription(`Ваша роль Дон Мафии`);
                  break
                case 'Доктор':
                  Role
                    .setImage(`http://mediasat.info/wp-content/uploads/2017/05/doktor-1021x580.jpg`)
                    .setDescription(`Ваша роль Доктор`);
                  break
                case 'Комиссар':
                  Role
                    .setImage(`https://cryptor.net/sites/default/files/pictures/picture-425-1516178707.png`)
                    .setDescription(`Ваша роль Комиссар`);
                  break
                case 'Мирный житель':
                  Role
                    .setImage(`https://sun9-67.userapi.com/impf/EcScjVP99K7qPfOES-dqT4JPTX2qVTzsmxMMYg/PhwvgzoLdBE.jpg?size=258x411&quality=96&proxy=1&sign=2777d49a26e5ba599932a26fefe61dbc&type=album`)
                    .setDescription(`Ваша роль Мирный житель`);
                  break
                case 'Путана':
                    Role
                      .setImage(`https://cdn.discordapp.com/attachments/842835592244101151/850022071857577984/TeYHlazXVn4.png`)
                      .setDescription(`Ваша роль Путана`);
                    break
                default:
                  break;
              }
              try {
                reaction.message.guild.member(element).send(Role);
                if (data.roles[randomRole] === 'Мафия' || data.roles[randomRole] === 'Дон Мафии') {
                  reaction.message.guild.member(element).send(`Приглашение на сервер мафии: \n ${invite.url}`)
                }
              } catch (e) {
                reaction.message.channel.send(new Discord.MessageEmbed().setColor(`PURPLE`).setDescription(`<@${element}> У вас закрыта личка! Игра не начата!`));
                data.players.forEach((el) => {
                  reaction.message.guild.member(el).roles.remove(mafiaRolePlayer);
                  reaction.message.guild.member(el).setNickname(data.playersNicknames.get(el));
                });
                return data.delete();
              }
              user.send(`Игрок ${reaction.message.guild.member(element).displayName} имеет роль ${data.roles[randomRole]}.`);
              data.roles.splice(randomRole, 1);
              if (index == 9) {
                reaction.message.guild.member(element).setNickname(`${index + 1}`);
                reaction.message.guild.member(element).roles.add(mafiaRolePlayer);
              } else {
                reaction.message.guild.member(element).setNickname(`0${index + 1}`);
                reaction.message.guild.member(element).roles.add(mafiaRolePlayer);
              }
            });
            await user.send(`Приглашение на сервер мафии: \n ${invite.url}`)
            data.mafiaRoomID = guild.id;
            data.started = true;
            await data.save().catch(err => console.log(err));
            await reaction.message.delete({ timeout: 3000 });
          });
        });
      }


      if (reaction.emoji.name === "❌") {
        if (!reaction.message.guild.member(user).roles.cache.some(role => role.id === mafiaRoleLeading)) return;
        await reaction.message.channel.send(`Игра отменена пользователем <@${user.id}>`);
        await data.delete();
        return await reaction.message.delete({ timeout: 3000 });
      }
    })
  }
} 
