const { getAllUsers, getKProgQueue, setPriority, clearKProg } = require('../database/database');
const schedule = require('node-schedule');
const { createSignButton, kprogStatusKeyboard } = require('../bot/keyboards');
const { lessons } = require ('../lessons/lessons');
const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, 'config.json');


const readConfig = async () => {
    const configData = await fs.promises.readFile(configPath, 'utf-8');
    return JSON.parse(configData);
};

// Функция для записи конфигурации
const writeConfig = async (config) => {
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 4));
};

// Функция для отправки сообщений всем пользователям
const sendMessagesToUsers = async (bot, message, replyMarkup) => {
    const users = await getAllUsers(); // Получаем всех пользователей из базы данных
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

// Функция для отправки отложенных сообщений
function sendMessages(bot, dateTime, lesson, type) {
    const [date, time] = dateTime.split(' ');
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const jobDate = new Date(year, month - 1, day, hour, minute);

    const lessonType = type === 0 ? "" : type === 1 ? "\\(1 подгруппа)" : "\\(2 подгруппа\\)";
    const message = `*Запись на ${lessons.get(lesson)} ${day + 1}\\.${month} ${lessonType}*\n\n_Нажмите кнопку ниже, чтобы записаться_`;
    const replyMarkup = createSignButton(lesson);

    // Планируем задачу с использованием node-schedule
    schedule.scheduleJob(jobDate, async () => {
        await clearKProg(); // Очищаем KProg перед отправкой сообщений

        // Читаем и обновляем конфигурацию
        const config = await readConfig();
        config.isKProgEnd = false;
        await writeConfig(config);

        // Отправляем сообщения всем пользователям
        await sendMessagesToUsers(bot, message, replyMarkup);
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
        // Читаем и обновляем конфигурацию
        const config = await readConfig();

        config.KProgLessonType--;
        if (config.KProgLessonType < 0) {
            config.KProgLessonType = 2; // Обновляем тип урока по кругу
        }
        config.isKProgEnd = true;

        // Получаем очередь пользователей на КПрог
        const data = await getKProgQueue();
        
        // Обновляем приоритет пользователей
        for (let user of data) {
            setPriority(user.tg_id, "Зелёный");
        }

        // Сохраняем обновленную конфигурацию
        await writeConfig(config);

        // Отправляем сообщения пользователям из очереди на КПрог
        await sendMessagesToUsers(bot, message, replyMarkup);
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