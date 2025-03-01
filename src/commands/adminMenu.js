const { InputFile } = require("grammy");

const {
  adminKeyboard,
  getReturnKeyboard,
  selectQueueKeyboard,
  doWithTable,
} = require("../bot/keyboards");

const { generateQueueTable, generateBZCHTable } = require("../tables/tables");

const {
  setPriorityBySurname,
  getQueue,
  clearTable,
  insertIntoQueue,
  setPriorityByBrigadeNum,
} = require("../database/database");
const { readConfig } = require("../utils/config");
const { lessons } = require("../../data/lessons");

function adminMenuCommand(bot) {
  bot.callbackQuery("adminmenu", async (ctx) => {
    await ctx.reply("Меню", {
      reply_markup: adminKeyboard,
    });
  });

  bot.callbackQuery(/setPr:(.+)/, async (ctx) => {
    await ctx.answerCallbackQuery();

    const subject = ctx.match[1];
    const lesson = lessons.find((ls) => ls.name === subject);

    await ctx.callbackQuery.message.editText(
      `Введите ${
        lesson.isBrigadeType ? "номер бригады" : "фамилию студента"
      }, ${
        lesson.isBrigadeType ? "которой" : "которому"
      } нужно поменять приоритет:`,
      {
        parse_mode: "MarkdownV2",
      }
    );

    ctx.session.step = `waiting_for_${subject}prioritySurname`;
  });

  bot.callbackQuery("sendMsg", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.callbackQuery.message.editText("Введите сообщение", {
      parse_mode: "MarkdownV2",
    });

    ctx.session.step = "waiting_for_adminMessage";
  });

  bot.callbackQuery("queueToChange", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.callbackQuery.message.editText(
      "Выберите таблицу, которую нужно изменить",
      {
        parse_mode: "MarkdownV2",
        reply_markup: selectQueueKeyboard,
      }
    );
  });

  bot.callbackQuery(/change:(.+)/, async (ctx) => {
    await ctx.answerCallbackQuery();

    try {
      await ctx.deleteMessage();
    } catch (error) {
      if (error.message.includes("message can't be deleted for everyone")) {
        console.log("Сообщение уже удалено или не может быть удалено.");
      } else {
        console.error("Произошла другая ошибка:", error);
      }
    }

    const subject = ctx.match[1];
    const lesson = lessons.find((ls) => ls.name === subject);
    let status = "";
    const queue = await getQueue(lesson.name);

    if (queue?.length) {
      await generateQueueTable(queue, lesson);
      let photoMessage = await ctx.replyWithPhoto(
        new InputFile(`./src/tables/${lesson.name}Table.png`)
      );
      ctx.session.QueuePhotoMessageId = photoMessage.message_id;
    } else {
      status = "_Пока никакой очереди нет_";
    }

    await ctx.reply(
      `${lesson.emoji} *Очередь на ${lesson.title}\n*` +
        status +
        "\n\nВыеберете, что сделать с таблицой:",
      {
        parse_mode: "MarkdownV2",
        reply_markup: doWithTable(lesson),
      }
    );
  });

  bot.callbackQuery(/clear:(.+)/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const tableName = ctx.match[1];

    if (ctx.session.QueuePhotoMessageId) {
      await ctx.api.deleteMessage(ctx.chat.id, ctx.session.QueuePhotoMessageId);
      ctx.session.QueuePhotoMessageId = undefined;
    }

    clearTable(tableName);
    await ctx.callbackQuery.message.editText(`Таблица очищена`);
  });

  bot.callbackQuery(/deleteUserIn:(.+)/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const tableName = ctx.match[1];

    const lesson = lessons.find((ls) => ls.name === tableName);

    await ctx.callbackQuery.message.editText(
      `Напишите ${
        lesson.isBrigadeType ? "номер бригады" : "фамилию пользователя"
      }, ${lesson.isBrigadeType ? "которую" : "котрого"} нужно удалить:`
    );
    ctx.session.step = `waiting_for_${tableName}ToDelete`;
  });

  bot.callbackQuery("deleteBrigade", async (ctx) => {
    await ctx.answerCallbackQuery();
    const tableName = ctx.match[1];

    await ctx.callbackQuery.message.editText(
      `Напишите номер бригады, которую нужно удалить:`
    );
    ctx.session.step = `waiting_for_brigadeToDelete`;
  });

  bot.callbackQuery(/set(.*)PriorityFor:(.+)/, async (ctx) => {
    const priority = ctx.match[1]; // Получаем цвет из callback данных
    const subject = ctx.match[2];
    const lesson = lessons.find((ls) => ls.name === subject);

    const priorities = {
      Red: "Красный",
      Yellow: "Жёлтый",
      Green: "Зелёный",
      Purple: "Санкции",
    };
    const surname = ctx.session.surname;
    if (surname) {
      if (lesson.isBrigadeType) {
        await setPriorityByBrigadeNum(+surname, priorities[priority], subject);
      } else {
        await setPriorityBySurname(surname, priorities[priority], subject);
      }
      await ctx.editMessageText(
        `Приоритет изменён на ${priorities[priority]}`
        // {
        //   reply_markup: getReturnKeyboardFor(false, "KProg"),
        // }
      );
    } else {
      await ctx.reply(
        "Не удалось найти фамилию или номер бригады. Попробуйте ещё раз."
      );
    }
    ctx.session.step = null; // Завершаем процесс
  });
}

module.exports = { adminMenuCommand };
