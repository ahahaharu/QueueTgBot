const { getAllUsers, getQueue, setPriority, clearTable } = require('../database/database');
const schedule = require('node-schedule');
const { createSignButton, kprogStatusKeyboard } = require('../bot/keyboards');
const { lessons } = require ('../lessons/lessons');
const {readConfig, writeConfig} = require ('../utils/config')
const Mutex = require('async-mutex').Mutex;
const configMutex = new Mutex();

// Функция для отправки сообщений всем пользователям
const sendMessagesToUsers = async (bot, message, replyMarkup, isEnd) => {
    let users;
    if (isEnd) {
        users = await getQueue('KProg')
    } else {
        users = await getAllUsers(); 
    }

    console.log(`Всего пользователей в базе: ${users.length}`);

    const sendPromises = users.map(async (user) => {
        const userId = user.tg_id;
        try {
            console.log(`Попытка отправки сообщения пользователю ${userId}`);
            await bot.api.sendMessage(userId, message, {
                parse_mode: 'MarkdownV2',
                reply_markup: replyMarkup,
            });
            console.log(`Сообщение успешно отправлено пользователю ${userId}`);
        } catch (error) {
            console.error(`Не удалось отправить сообщение пользователю ${userId}:`, error.response?.description || error.message);
        }
    });

    await Promise.all(sendPromises);
    console.log('Сообщения отправлены всем пользователям.');
};


function sendMessages(bot, dateTime, lesson, type) {

    
    const [date, time] = dateTime.split(' ');
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const jobDate = new Date(year, month - 1, day, hour, minute);

    const lessonType = type === 0 ? "" : type === 1 ? "\\(1 подгруппа\\)" : "\\(2 подгруппа\\)";
    const message = `*Запись на ${lessons.get(lesson)} ${day + 1}\\.${month} ${lessonType}*\n\n_Нажмите кнопку ниже, чтобы записаться_`;
    const replyMarkup = createSignButton(lesson);

    schedule.scheduleJob(jobDate, async () => {
        await configMutex.runExclusive(async () => {
            console.log("!!");
            const config = await readConfig();
            
            if (lesson === 'kprog') {
                await clearTable('KProg'); 
                config.KProgLessonType = type;
                config.KProgDate = `${day+1}\\.${month}`;
                config.isKProgEnd = false;
            } else if (lesson === 'isp') {
                await clearTable('ISP');
                config.ISPLessonType = type;
                config.ISPDate = `${day+1}\\.${month}`;
            } else if (lesson === 'pzma') {
                await clearTable('PZMA');
                config.PZMALessonType = type;
                config.PZMAgDate = `${day+1}\\.${month}`;
            } else if (lesson === 'mcha') {
                await clearTable('MCHA');
                config.MCHALessonType = type;
                config.MCHADate = `${day+1}\\.${month}`;
            } else if (lesson === 'bzch') {
                await clearTable('BZCH');
                config.BZCHDate = `${day+1}\\.${month}`;
                config.isBZCHEnd = false;
            }
            await writeConfig(config);
            
            await sendMessagesToUsers(bot, message, replyMarkup, false);
        });
    });
}

// Функция для отправки сообщения об окончании занятия по КПрог
function sendEndMessage(bot, dateTime) {
    const [date, time] = dateTime.split(' ');
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const jobDate = new Date(year, month - 1, day, hour, minute);

    const message = `*Пара по КПрог закончилась*\n\nСдали ли вы лабораторную работу?`;
    const replyMarkup = kprogStatusKeyboard;

    schedule.scheduleJob(jobDate, async () => {
       
        
        const config = await readConfig();
        config.isKProgEnd = true;
        await writeConfig(config);

        const data = await getQueue("KProg");

        for (let user of data) {
            setPriority(user.tg_id, "Зелёный");
        }

        await sendMessagesToUsers(bot, message, replyMarkup, true);
    });
}

async function sendMessageForAll(bot, message) {
    const data = await getAllUsers();

    
    for (const user of data) {
        const userId = user.tg_id;

        await bot.api.sendMessage(userId, message);
    }
    
}

async function sendStickerForAll(bot, stickerID) {
    const data = await getAllUsers();

    
    for (const user of data) {
        const userId = user.tg_id;

        await bot.api.sendSticker(userId, stickerID);
    }
    
}

module.exports = { sendMessages, sendEndMessage, sendMessageForAll, sendStickerForAll }