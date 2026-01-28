require('dotenv').config();
const { bot } = require('./src/bot/bot');

bot.start({
  onStart: (botInfo) => {
    console.log(`Бот ${botInfo.username} запущен!`);
  },
  drop_pending_updates: true,
});
