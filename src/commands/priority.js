const { InputFile } = require("grammy");

const {
  returnToKProg,
  getReturnKeyboard,
  returnToBZCH,
  returnToLessonQueue,
} = require("../bot/keyboards");

const {
  getAllUsers,
  setPriority,
  getBZCHPriorityTable,
  setBZCHPriority,
  getInfoById,
  getQueue,
  isInBZCH,
  getBZCHStatus,
  setPriorityStatus,
  getPriorityForLessonByID,
  setPriorityByBrigadeNum,
} = require("../database/database");

const {
  generatePriorityTable,
  generateBZCHPriorityTable,
  generateQueueTable,
} = require("../tables/tables");
const { lessons } = require("../../data/lessons");
const { getBrigadeNum } = require("../bot/getBrigadeNum");

function priorityCommand(bot) {
  bot.callbackQuery(/priorityInfoFor:(.+)/, async (ctx) => {
    await ctx.answerCallbackQuery();

    const subject = ctx.match[1];
    const lesson = lessons.find((ls) => ls.name === subject);

    if (ctx.session.QueuePhotoMessageId || ctx.session.QueuePhotoMessageIds) {
      try {
        if (ctx.session.QueuePhotoMessageIds) {
          await ctx.api.deleteMessage(
            ctx.chat.id,
            ctx.session.QueuePhotoMessageIds[0]
          );
          await ctx.api.deleteMessage(
            ctx.chat.id,
            ctx.session.QueuePhotoMessageIds[1]
          );
        } else {
          await ctx.api.deleteMessage(
            ctx.chat.id,
            ctx.session.QueuePhotoMessageId
          );
        }
      } catch (error) {
        if (error.message.includes("message can't be deleted for everyone")) {
          console.log("Сообщение уже удалено или не может быть удалено.");
        } else {
          console.error("Произошла другая ошибка:", error);
        }
      }
      ctx.session.QueuePhotoMessageId = undefined;
      ctx.session.QueuePhotoMessageIds = undefined;
    }
    try {
      await ctx.deleteMessage();
    } catch (error) {
      if (error.message.includes("message can't be deleted for everyone")) {
        console.log("Сообщение уже удалено или не может быть удалено.");
      } else {
        console.error("Произошла другая ошибка:", error);
      }
    }

    let data;
    if (lesson.isBrigadeType) {
      data = await getQueue(lesson.name + "_priorities");
      data.sort((a, b) => {
        if (a.brigade_num < b.brigade_num) return -1;
        if (a.brigade_num > b.brigade_num) return 1;
        return 0;
      });
    } else {
      let students = await getAllUsers();
      data = [];
      students.sort((a, b) => {
        if (a.surname < b.surname) return -1;
        if (a.surname > b.surname) return 1;
        return 0;
      });

      for (let student of students) {
        data.push({
          surname: student.surname,
          priority: await getPriorityForLessonByID(student.tg_id, lesson),
        });
      }
    }
    await generateQueueTable(data, lesson, null, true);

    let photoMessage = await ctx.replyWithPhoto(
      new InputFile(`./src/tables/${subject}PriorityTable.png`)
    );
    ctx.session.photoMessageId = photoMessage.message_id;

    await ctx.reply(
      "💻 *Как работают приоритеты?*\n\nПриоритеты необходимы для того," +
        `чтобы студенты, которые не успели сдать ${
          lesson.workType == "lab" ? "лабораторную работу" : "ПЗ"
        }, имели возможность` +
        "сделать это в первую очередь на следующей паре\\.\n\n" +
        "*Есть несколько видов приоритетов:*\n\n" +
        "🟥 __*Красный*__ \\- приоритет, который даётся в том случае, когда человек __*вообще не имел возможности подойти*__ и сдать \\(не успел по очереди\\)\n" +
        `🟨 __*Жёлтый*__ \\- приоритет, который даётся, если человек хотя бы раз за пару __*попробовал сдать*__ ${
          lesson.workType == "lab" ? "лабораторную работу" : "ПЗ"
        }, но __*не сдал*__\n` +
        `🟩 __*Зелёный*__ \\- даётся в том случае, когда студент __*сдал*__ ${
          lesson.workType == "lab" ? "лабораторную работу" : "ПЗ"
        } ` +
        `_\\(если сдавалось 2 ${
          lesson.workType == "lab" ? "лабы" : "ПЗ"
        }, но была сдана только одна, то всё равно даётся зелёный приоритет\\)_\n` +
        `🟪 __*Фиолетовый*__ \\- __*санкции*__, которые накладываются в том случае, когда студент решил с кем\\-то поменяться очередью во время сдачи ${
          lesson.workType == "lab" ? "лаб" : "ПЗ"
        }\n\n` +
        "Таблица приоритетов представленна выше",
      {
        parse_mode: "MarkdownV2",
        reply_markup: returnToLessonQueue(subject),
      }
    );
  });

  bot.callbackQuery(/(passed|notPassed|notPsbl):(\w+)/, async (ctx) => {
    await ctx.answerCallbackQuery();

    const action = ctx.match[1];
    const subject = ctx.match[2];
    const lesson = lessons.find((ls) => ls.name === subject);

    let priority;
    let message;

    const userInfo = await getInfoById(ctx.from.id.toString());
    let brigade_num;
    if (lesson.isBrigadeType) {
      const queue = await getQueue(subject);
      brigade_num = await getBrigadeNum(lesson.name, userInfo.tg_id);
      const line = queue.find((l) => l.brigade_num == brigade_num);
      if (line.isPriorityGiven) {
        await ctx.callbackQuery.message.editText(
          "Один из членов вашей бригады уже поставил приоритет",
          {
            parse_mode: "MarkdownV2",
            reply_markup: getReturnKeyboard(false, lesson.name),
          }
        );
        return;
      }
      await setPriorityStatus(brigade_num, true, lesson.name);
    }

    // if (subject == "BZCH") {
    //   if (await getBZCHStatus(userInfo.brigade_id)) {
    //   } else {
    //     await setPriorityStatus(userInfo.brigade_id, true);
    //   }
    // }

    if (action === "passed") {
      priority = "Зелёный";
      message = `*🎉 Поздравляю со сдачей\\!*\n\n_🟩 Вам выдан зелёный приоритет_`;
    } else if (action === "notPassed") {
      priority = "Жёлтый";
      message = `*😔 Ничего страшного\\!*\nНа следующей паре вы сможете сдать чуть первее других\n\n🟨 _Вам выдан жёлтый приоритет_`;
    } else if (action === "notPsbl") {
      priority = "Красный";
      message = `*☹️ Очень жаль, что вы не успели\\.*\nНа следующей паре вы сможете сдать лабораторную работу одним\\(\\-ой\\) из первых\n\n_🟥 Вам выдан красный приоритет_`;
    }

    if (lesson.isBrigadeType) {
      await setPriorityByBrigadeNum(brigade_num, priority, lesson.name);
    } else {
      await setPriority(userInfo.tg_id, priority, lesson.name);
    }
    // if (subject == "KProg") {
    //   await setPriority(userInfo.tg_id, priority);
    // } else {
    //   await setBZCHPriority(userInfo.brigade_id, priority);
    // }

    await ctx.callbackQuery.message.editText(message, {
      parse_mode: "MarkdownV2",
      reply_markup: getReturnKeyboard(false, subject),
    });
  });
}

module.exports = { priorityCommand };
