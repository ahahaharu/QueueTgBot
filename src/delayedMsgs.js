const { getAllUsers, getKProgQueue } = require('./database/database');
const cron = require('node-cron');
const { createSignButton, kprogStatusKeyboard } = require('./keyboards');
const { lessons } = require ('./lessons/lessons');
const fs = require('fs'); // Импортируем модуль fs
const path = require('path'); // Импортируем модуль path
const configPath = path.join(__dirname, 'config.json');


function sendMessages(bot, dateTime, lesson, type) {

    

    // Разбираем строку даты и времени
    const [date, time] = dateTime.split(' ');
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    // Расписание cron для определённого времени в Минском часовом поясе
    cron.schedule(`${minute} ${hour} ${day} ${month} *`, async () => {
        const currentDate = new Date();
        
        // Проверяем, чтобы дата совпадала с запланированной
        if (
            currentDate.getFullYear() === year &&
            currentDate.getMonth() + 1 === month &&
            currentDate.getDate() === day
        ) {
            const data = await getAllUsers();

            for (const user of data) {
                const userId = user.tg_id;

                console.log(userId);
                try {
                    let lessonType = type === 0 ? "" : type == 1 ? "\\(1 подгруппа)" : "\\(2 подгруппа\\)"
                    await bot.api.sendMessage(userId, `*Запись на ${lessons.get(lesson)} ${day+1}\\.${month} ${lessonType}*\n\n_Нажмите кнопку ниже, чтобы записаться_`, {
                        parse_mode: 'MarkdownV2',
                        reply_markup: createSignButton(lesson)
                    });
                } catch (error) {
                    console.error(`Не удалось отправить сообщение пользователю ${userId}:`, error);
                }
            }
            console.log('Сообщения отправлены всем пользователям.');
        }
    }, {
        timezone: "Europe/Minsk"
    });
}

function sendEndMessage(bot, dateTime) {
    const [date, time] = dateTime.split(' ');
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    cron.schedule(`${minute} ${hour} ${day} ${month} *`, async () => {
        const currentDate = new Date();
        const data = await fs.promises.readFile(configPath, 'utf-8');
        const config = JSON.parse(data);
        config.KProgLessonType--;
        if (config.KProgLessonType < 0) {
            config.KProgLessonType = 2;
        }

        
        await fs.promises.writeFile(configPath, JSON.stringify(config, null, 4));
        // Проверяем, чтобы дата совпадала с запланированной
        if (
            currentDate.getFullYear() === year &&
            currentDate.getMonth() + 1 === month &&
            currentDate.getDate() === day
        ) {
            const data = await getKProgQueue();

            for (const user of data) {
                const userId = user.tg_id;

                console.log(userId);
                try {
                    await bot.api.sendMessage(userId, `*Пара по КПрог закончилась*\n\nСдали ли вы лабораторную работу?`, {
                        parse_mode: 'MarkdownV2',
                        reply_markup: kprogStatusKeyboard
                    });
                } catch (error) {
                    console.error(`Не удалось отправить сообщение пользователю ${userId}:`, error);
                }
            }
            console.log('Сообщения отправлены всем пользователям.');
        }
    }, {
        timezone: "Europe/Minsk"
    });
}

module.exports = { sendMessages, sendEndMessage }