// i have already coded the ticket system and posted it on my server so join my server and go to js codes

const {
    bot,
    Message,
    MessageEmbed,
    MessageButton,
    MessageActionRow
} = require('discord.js');

module.exports = {
    name: 'ticket-msg',
    /** 
     * @param {bot} bot 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (bot, message, args, Discord) => {
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(message.guild.name, message.guild.iconURL({
                dynamic: true
            }))
            .setDescription(
                "__**Как задать вопрос модерации**__\n" +


                "> Нажмите на зеленую кнопку ниже\n" +

                "> Как только ветка вопроса будет создана, вы сможете его задать там."

            )
            .setTitle('Вопросы © pashul1k system')


        const bt = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setCustomId('tic')
                .setLabel('🎫 Создать вопрос!')
                .setStyle('PRIMARY'),
            );

        message.channel.send({
            embeds: [embed],
            components: [bt]
        });
    }
}
