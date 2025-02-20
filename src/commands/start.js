const { lessons } = require("../../data/lessons");
const { students } = require("../../data/students");
const {
  insertIntoDatabase,
  isRegistered,
  insertIntoBrigade,
  insertIntoPriority,
  getInfoById,
} = require("../database/database");

const { showMenu } = require("./menu");
const { statusCheck } = require("./statusCheck");

function startCommand(bot) {
  bot.command("start", async (ctx) => {
    const isReg = await isRegistered(ctx.from.id);
    if (isReg) {
      if (await statusCheck(ctx)) {
        return;
      }
      await ctx.reply(
        "👋 Привет! Это бот для записи на сдачу лабораторных работ."
      );
      showMenu(ctx);
      return;
    }
    if (
      !(students.has(ctx.from.username) || students.has(ctx.from.id.toString()))
    ) {
      await ctx.reply(
        "❗Вы не можете быть зарегестрированы! Напишите @ahahaharu, если возникли проблемы."
      );
      return;
    }
    let data;
    if (students.has(ctx.from.username)) {
      data = students.get(ctx.from.username);
      await insertIntoDatabase(
        data.name,
        data.surname,
        ctx.from.username,
        ctx.msg.from.id.toString()
      );
    } else {
      data = students.get(ctx.from.id.toString());
      await insertIntoDatabase(
        data.name,
        data.surname,
        "",
        ctx.msg.from.id.toString()
      );
    }

    lessons
      .filter((ls) => ls.isBrigadeType === true)
      .forEach((ls) => {
        for (let brigade of ls.brigadeData) {
          if (brigade.members.includes(data.surname)) {
            insertIntoBrigade(
              ls.name,
              ctx.msg.from.id.toString(),
              brigade.brigadeNum
            );
          }
        }
      });
    await insertIntoPriority(ctx.msg.from.id.toString(), data.surname);

    await ctx.reply(`✅ Отлично! Вы зарегистрированы!`);
    showMenu(ctx);
  });
}

module.exports = { startCommand };
