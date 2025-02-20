const { Bot, GrammyError, HttpError } = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");
const { session, MemorySessionStorage } = require("grammy");
const { commands } = require("../commands/commands");
const { setSchedules } = require("../lessons/schedules/schedules");
const {
  sendMessageForAll,
  sendStickerForAll,
} = require("../commands/delayedMsgs");
const { createConfig } = require("../utils/createConfig");
const { createDBTables } = require("../database/createDBTables");

process.on("uncaughtException", (error) => {
  console.error("Произошло необработанное исключение:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Необработанное отклонение промиса:", reason);
});

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());
bot.use(
  session({
    initial: () => ({ step: null }),
    storage: new MemorySessionStorage(),
  })
);

bot.api.setMyCommands([
  { command: "start", description: "Начало работы с ботом" },
  { command: "menu", description: "Меню" },
]);

createDBTables();
createConfig();
commands(bot);
setSchedules(bot);

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
