const { Bot, GrammyError, HttpError } = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');
const { session, MemorySessionStorage } = require('grammy');
const { commands } = require('./commands');
const { students } = require('./students');

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());
bot.use(session({
    initial: () => ({ step: null }),
    storage: new MemorySessionStorage()
}));

commands(bot);

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
