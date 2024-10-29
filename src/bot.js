const { Bot, GrammyError, HttpError } = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');
const { session, MemorySessionStorage } = require('grammy');
const { commands } = require('./commands');
const { sendKProgMessages, sendKProgEnd } = require('./lessons/shedules/KProgShedule');
const { sendMessageForAll, sendStickerForAll } = require('./delayedMsgs');





const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());
bot.use(session({
    initial: () => ({ step: null }),
    storage: new MemorySessionStorage()
}));

bot.api.setMyCommands([
    { command: "start", description: "Начало работы с ботом"  },
    { command: "menu", description: "Меню"}
    
  ]);

commands(bot);
sendKProgMessages(bot);
sendKProgEnd(bot);


bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
});



module.exports = { bot };
