const { getAllUsers } = require('./database');
const cron = require('node-cron');
const { signKProgButton } = require('./keyboards');

function sendMessages(bot) { 
cron.schedule('52 11 * * *', async () => {
        const data = await getAllUsers();

        for (const user of data) {
            const userId = user.tg_id; 

            console.log(userId);
            try {
                await bot.api.sendMessage(userId, 'Тест записи на лабу', {
                    reply_markup: signKProgButton
                });
            } catch (error) {
                console.error(`Не удалось отправить сообщение пользователю ${userId}:`, error);
            }
        }
        console.log('Сообщения отправлены всем пользователям из массива data.');
    }, {
        timezone: "Europe/Minsk" // Указываем часовой пояс
    });
}

module.exports = { sendMessages }