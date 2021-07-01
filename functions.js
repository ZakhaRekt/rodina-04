const  Discord = require("discord.js");

module.exports = {
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);
        
        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }
            
        if (!target) 
            target = message.member;
            
        return target;
    },

    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-US').format(date)
    },

    promptMessage: async function (message, author, time, validReactions) {
        // We put in the time as seconds, with this it's being transfered to MS
        time *= 1000;

        // For every emoji in the function parameters, react in the good order.
        for (const reaction of validReactions) await message.react(reaction);

        // Only allow reactions from the author, 
        // and the emoji must be in the array we provided.
        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        // And ofcourse, await the reactions
        return message
            .awaitReactions(filter, { max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name);
    },
    getRandomInt: function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    },

	objToStrMap: function(obj) {
        let strMap = new Map();
        for (let k of Object.keys(obj)) {
            strMap.set(k, obj[k]);
        }
        return strMap;

    },
    strMapToObj:function(strMap) {
		  let obj = Object.create(null);
		  for (let [k,v] of strMap) {
		    // We don’t escape the key '__proto__'
		    // which can cause problems on older engines
		    obj[k] = v;
		  }
		  return JSON.stringify(obj);
	},
    getDateString:function() {
    let date = new Date;
    return `${date.getDate().toString().padStart(2, '0')}.` +
        `${(date.getMonth() + 1).toString().padStart(2, '0')}.` +
        `${date.getFullYear()} ` +
        `${date.getHours().toString().padStart(2, '0')}:` +
        `${date.getMinutes().toString().padStart(2, '0')}:` +
        `${date.getSeconds().toString().padStart(2, '0')}`;
    },
    randomColor:function() {
        return Math.floor(Math.random()*16777215).toString(16); //random hex for roles
    },
    addModerToDB:function(bot,ModeratorObj) {
        this.bot = bot;
        this.ModeratorObj = ModeratorObj;
        setInterval(() => {
            bot.guilds.cache.get("577511138032484360")
            .members.cache.filter(member => member.roles.cache.some(role => role.id === "703270075666268160"))
            .each(member => {
              ModeratorObj.findOne({moderID:member.id},(err,moder) => {
                if(err) console.log(err);
                if(!moder) {
                    console.log(`Added ${member.id}`)
                    var offset = 3;
                    let DateNow = new Date( new Date().getTime() + offset * 3600 * 1000).toUTCString().replace( / GMT$/, "" )
                  let NewModer = new ModeratorObj({
                    moderID:member.id,
                    moderName:member.displayName,
                    moderSince:DateNow
                });
                  NewModer.save();
                } else {
                  return moder.save();
                }
              })
            })
        }, 40000)
    },
    removeModerFromDB:function(bot,ModeratorObj) {
        this.bot = bot;
        this.ModeratorObj = ModeratorObj;
        setInterval(() => {
            ModeratorObj.find({},(err,moderators) => {
                if(err) console.log(err);
                moderators.forEach(moder => {
                    let member = bot.guilds.cache.get("577511138032484360").members.cache.get(moder.moderID);
                    if(!member) {
                        return moder.delete();
                    }
                    if(!member.roles.cache.some(role => role.id === "703270075666268160")) {
                        console.log(`Removed-${moder.moderID}`)
                        moder.delete();
                    }
                })
            })
        }, 60000)
    },
    errorEmbed:function(message, author) {
        this.message = message;
        this.author = author;
        return ( 
            new Discord.MessageEmbed()
                .setColor('RED')
                .setTitle(`Ошибка!`)
                .setDescription(`\`Суть ошибки:\` **${message}**`)
                .setFooter(`Error | ${author.tag}`)
        )
    },
};
