const { addModerToDB, removeModerFromDB } = require('../../../functions.js');
const Moder = require('../../data/moder.js');
module.exports = async bot => {
	console.log("Бот был успешно запущен!"); // Написать что бот запущен
    bot.user.setPresence({ activity: { name: 'ВО КРУТОЙ',type:'PLAYING' }, status: 'online' })
          .then(presence => console.log(`Bot playing in ${presence.activities[0].name}`))
          .catch(console.error);
    addModerToDB(bot,Moder);
    removeModerFromDB(bot,Moder);
}
