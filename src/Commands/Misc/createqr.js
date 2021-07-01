const Discord = require('discord.js');
const { randomColor, errorEmbed } = require("../../../functions.js");
const User = require('../../data/user');


module.exports = {
    name: "createqr",
    category: "misc",
    description: "Генератор qr",

    async run(bot, message, args) {
        if(!args[0]) return message.channel.send(errorEmbed('Укажите текст для генерации qr кода!',message.author));
        User.findOne({userID:message.author.id},(err,data) => {
            if(err) console.log(err);
            if(!data) return;
            if(data.qrTimeout > Date.now()) {
                return message.channel.send(errorEmbed(`Вы сможете использовать команду через: ${Math.ceil((data.qrTimeout - Date.now())/1000)} секунд`,message.author))
            }
            const encoded = encodeURI(`http://api.qrserver.com/v1/create-qr-code/?data=${args.slice(0).join(" ")}&size=750x750&color=000000&bgcolor=fff`)
            const emb = new Discord.MessageEmbed()
                .setTitle(`Код для: ${message.author.tag}`)
                .setDescription(`\`Текст\`: ${args.slice(0).join(" ")}`)
                .setColor(`#${randomColor()}`)
                .setThumbnail(message.author.displayAvatarURL())
                .setImage(encoded)
                .setFooter(`QR Generator | © Developer Montano`)
            message.delete();
            message.reply(emb);
            data.qrTimeout = Date.now() + 60000;
            data.save();
        })
    }
}