const Discord = require('discord.js');
const axios = require('axios');
const { parse } = require('html-table-to-json');

const SITE_URL = 'https://rodina-rp.com/mon/fraction/';
const accessRoleID = '465095866110443532';

const serverNames = [
    'Центральный Округ',
    'Южный Округ',
    'Северный Округ',
    'Восточный Округ'
];

const fractionNames = [
    "Полиция Южный",
    "Полиция Арзамас",
    "Больница Арзамас",
    "Правительство Южный",
    "Центр лицензирования",
    "Радио станция Южный",
    "Фантомасы",
    "Больница Эдово",
    "Черная кошка",
    "Санитары",
    "Солнцевская братва",
    "Русская Мафия",
    "Украинская Мафия",
    "Кавказская Мафия",
    "ФСБ",
    "Армия",
    "Руб. Банк",
    "Тюрьма строгого режима",
    "Больница Лыткарино",
    "Полиция Лыткарино",
    "Радиостанция Лыткарино"
];

async function getCookie(url) {
    // Запрашиваем HTML у сайта
    const res = await axios.get(url);
    const isSuccess = res && res.status === 200 && res.data;
    if (!isSuccess) throw new Error('Неудачный запрос');

    // Проверяем наличие необходимого куки в странице
    if (!res.data.includes('R3ACTLB')) return null;
    const foundCookie = res.data.split('R3ACTLB=')[1].split(' ;')[0];
    if (!foundCookie) throw new Error('Ошибка при поиске куки на странице');

    return foundCookie;
}

async function getFractionPlayers(server, fractionID, requestConfig = {}) {
    // Проверяем валидность указанных аргументов
    const validArgs = server && fractionID;
    const validTypes = typeof server === 'number' && typeof fractionID === 'number';
    if (!validArgs || !validTypes) {
        throw new TypeError('Сервер или фракция указаны неверно');
    }

    // Запрашиваем HTML с сайта Аризоны
    const response = await axios.get(`${SITE_URL + server}/${fractionID}`, requestConfig);
    const isSuccess = response && response.status === 200 && response.data;
    if (!isSuccess) throw new Error('Ошибка при получении данных с сайта');

    // Переводим HTML таблицы в JSON
    const parsedTables = parse(response.data);
    const isSuccessParsed = parsedTables && parsedTables.results && parsedTables.results[0];
    if (!isSuccessParsed) throw new Error('Ошибка при парсе таблиц из HTML');

    // Создаем свой массив с полученными данными из таблицы
    const playersInfo = [];
    parsedTables.results[0].forEach((_el) => {
        const el = Object.entries(_el)
        playersInfo.push({
            id: el[0][1],
            nickname: el[1][1],
            rank: el[2][1],
            online: el[3][1] === 'В сети',
        });
    });
    return playersInfo;
}

module.exports = {
    name: "fraction",
    category: "misc",
    description: "Вывод онлайна всех фракций.",

    async run(bot, message, args) {

        if (!args[0] || isNaN(+args[0])) return message.delete()
        if (message.member.roles.highest.position < message.guild.roles.cache.get(accessRoleID).position) {
            message.delete()
            return message.channel.send(`\`Доступно только от 3-ого уровня админки!\``).then(msg => msg.delete({timeout:10000}))
        }
        if (+args[0] > 21 || +args[0] <= 0) {
            message.delete();
            return message.channel.send(`Иды фракций: От 1 до 21`).then(msg => msg.delete({timeout:10000}))
        }
        message.delete();
        const players = await getFractionPlayers(2, +args[0], {
            headers: {
                Cookie: `R3ACTLB=${await getCookie('http://rodina-rp.com')}`
            }
        });
        const onlinePlayers = players.filter(player => player.online);
        const seniors = players.filter(player => player.rank >= 9);

        let infoEmbed = new Discord.MessageEmbed()
            .setTitle(`Fraction Info | ID: ${args[0]}`)
            .setColor(`${message.member.displayHexColor}`)
            .setDescription(
                `\`Фракция:\` **${fractionNames[+args[0] - 1]}**\n\`Сервер:\` **${serverNames[1]}**\n\`Всего во фракции:\` **${players.length}** \n\`Из которых онлайн:\` **${onlinePlayers.length}**`
            )
            .setImage(`https://sun9-63.userapi.com/impg/pjtznylUa3_mCWapGV7eYBJ985o4-TXpN5u8Mw/UJJoxn_cfYM.jpg?size=1280x322&quality=96&sign=077d83fde85c5254413f04ada838b9ed&type=album`)
            .setThumbnail(`https://sun9-28.userapi.com/impg/0lAGgVkSqUocJSiiLuutq3WKVHsvZaC2VH7BSQ/ypf3Kqobvjs.jpg?size=1000x1000&quality=96&proxy=1&sign=66ae86aed4404a929d563d54c11ecc17&type=album`)
            .setFooter(`Fraction Info | © Developer Montano`)
        if (seniors.length === 0) {
            infoEmbed.addField(`**Руководство:**`, `\`В руководстве никого не найдено\``)
        } else {
            infoEmbed.addField(`**Руководство:**`,
            `${seniors.sort((a, b) => b.rank - a.rank)
                    .map(
                        ({ nickname, rank, online }) =>
                        `${nickname} - ${rank} ранг - ${online ? 'В сети' : 'Отключён'}`,
                    ).join('\n')}`)
        }
        return message.channel.send(infoEmbed);
    }
}