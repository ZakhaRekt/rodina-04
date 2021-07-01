const Discord = require('discord.js');
const User = require("../../data/user.js");
const { randomColor, errorEmbed } = require("../../../functions.js");
const axios = require('axios').default;
const { parse } = require('superagent');

const apiKey = 'edf8e02c1c2a8f84afe8d945fbd06795';

module.exports = {
	name: 'weather',
	category:"misc",
	description: 'Команда просмотра текущей погоды',

    async run (bot,message,args) {
        if(!args[0]) {
            return message.channel.send(errorEmbed('Вы не указали город!', message.author))
        }
        if(!isNaN(parseInt(args[0]))) {
            return message.channel.send(errorEmbed('Вы ввели число, а город принимается только в буквах!', message.author))
        }
        await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(args[0])}&appid=${apiKey}&lang=ru`)
            .then(resp => {
                const weatherEmbed = new Discord.MessageEmbed()
                    .setTitle(`Weather | City: ${args[0]}`)
                    .setColor(`#${randomColor()}`)
                    .setDescription(`\`Город:\` **${resp.data.name}** \n\`Страна:\` **${resp.data.sys.country}** \n \`Погода:\`**${resp.data.weather[0].description}** \n \`Температура:\`**${Math.round(resp.data.main.temp-273.15)}**\n \`Ветер и направление:\`**${resp.data.wind.speed} м/сек на ${resp.data.wind.deg} градусов**`)
                    .setImage('http://clipart-library.com/image_gallery2/Weather-Report-Free-Download-PNG.png')
                    .setFooter(`Weather for: ${message.author.tag} | City: ${resp.data.name}`)
                User.findOne({userID: message.author.id}, (err,user) => {
                    if(err) console.log(err);
                    if(!user) {
                        return message.channel.send(weatherEmbed);
                    }
                    user.city = resp.data.name
                    user.save()
                })
                return message.channel.send(weatherEmbed);
            }).catch(err => {
                if(err.response){
                    if(err.response.status == 404) {
                        return message.channel.send(errorEmbed('Указано не верное название города!', message.author))
                    }
                }
            })

    }
}