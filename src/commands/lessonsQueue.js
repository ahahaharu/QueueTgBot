const { InputFile } = require("grammy");

const { getReturnKeyboard, confirmDelete } = require("../bot/keyboards");

const {
  getQueue,
  getInfoById,
  insertIntoQueue,
  clearTable,
  getBrigades,
  getPriorityForLessonByID,
  deleteUserFromTable,
} = require("../database/database");

const { generateQueueTable } = require("../tables/tables");
const { returnConfigs } = require("../utils/config");
const { lessons } = require("../../data/lessons");
const { getTime } = require("../bot/getTime");
const { getBrigadeNum } = require("../bot/getBrigadeNum");
const sortQueue = require("../utils/sortQueue");
const { loadQueues } = require("../utils/queuesInFile");

function lessonsQueueCommand(bot) {
  async function showQueue(ctx, lesson) {
    await ctx.answerCallbackQuery();

    if (ctx.session.photoMessageId) {
      try {
        await ctx.api.deleteMessage(ctx.chat.id, ctx.session.photoMessageId);
      } catch (error) {
        if (error.message.includes("message can't be deleted for everyone")) {
          console.log("Сообщение уже удалено или не может быть удалено.");
        } else {
          console.error("Произошла другая ошибка:", error);
        }
      }
      ctx.session.photoMessageId = undefined;
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

    let status = "";

    const subjectQueue = await getQueue(lesson.name);
    const userInfo = await getInfoById(ctx.from.id.toString());
    let condition = false;
    let configs = await returnConfigs();
    let lessonType;

    const type = configs.get(lesson.name).lessonType;
    let isEnd = lesson.isPriority ? configs.get(lesson.name).isEnd : null;

    if (!lesson.hasSubgroupType) {
      lessonType = "";
    } else {
      lessonType =
        type === 0 || type === 3
          ? ""
          : type === 1
          ? "\\(1 подгруппа\\)"
          : "\\(2 подгруппа\\)";
    }
    status = `${configs.get(lesson.name).date} ${lessonType}\n\n`;

    if (subjectQueue?.length) {
      let index;
      let queue;
      if (isEnd) {
        const queues = loadQueues();
        queue = queues[`${lesson.name}Queue`];
        if (type === 3) {
          for (const user of queue[0]) {
            const id = lesson.isBrigadeType ? user.brigade_num : user.tg_id;
            user.priority = await getPriorityForLessonByID(id, lesson);
          }
          for (const user of queue[1]) {
            const id = lesson.isBrigadeType ? user.brigade_num : user.tg_id;
            user.priority = await getPriorityForLessonByID(id, lesson);
          }
        } else {
          for (const user of queue) {
            const id = lesson.isBrigadeType ? user.brigade_num : user.tg_id;
            user.priority = await getPriorityForLessonByID(id, lesson);
          }
        }
      } else {
        queue = await sortQueue(subjectQueue, lesson, type);
      }

      if (type === 3) {
        index = queue[0].findIndex((item) => item.tg_id == ctx.from.id);
        if (index < 0) {
          index = queue[1].findIndex((item) => item.tg_id == ctx.from.id);
        }
      } else if (lesson.isBrigadeType) {
        let brigade_num = await getBrigadeNum(lesson.name, userInfo.tg_id);
        index = queue.findIndex((item) => item.brigade_num == brigade_num);
      } else {
        index = queue.findIndex((item) => item.tg_id == ctx.from.id);
      }

      if (index !== -1) {
        let type;
        // if (subject === "BZCH") {
        //
        // } else {

        // }

        if (lesson.isBrigadeType) {
          type = "Ваша бригада записана таблицу\\! ";
        } else {
          type = "Вы записаны в таблицу\\! ";
        }

        status += type + "Ваше место в очереди: " + (+index + 1);
        condition = false;
      } else {
        // if (subject === "BZCH") {
        //   status += "Ваша бригада ещё не записалась в таблицу";
        // } else {

        // }

        if (lesson.isBrigadeType) {
          status += "Ваша бригада ещё не записалась в таблицу";
        } else {
          status += "Вы ещё не записались в таблицу";
        }
        condition = true;
      }

      //   if (subject === "BZCH") {
      //
      //     index = queue.findIndex(
      //       (item) => item.brigade_id == userInfo.brigade_id
      //     );
      //   } else {

      //   }

      let photoMessage;
      if (type === 3) {
        // await generateQueueTable(queue[0], lesson, 1, null, 1);
        // await generateQueueTable(queue[1], lesson, 2, null, 2);
        const photosArray = [];
        if (queue[0].length != 0) {
          await generateQueueTable(queue[0], lesson, 1);
          photosArray.push({
            type: "photo",
            media: new InputFile(`./src/tables/${lesson.name}Table1.png`),
          });
        }
        if (queue[1].length != 0) {
          await generateQueueTable(queue[1], lesson, 2);
          photosArray.push({
            type: "photo",
            media: new InputFile(`./src/tables/${lesson.name}Table2.png`),
          });
        }
        photoMessage = await ctx.replyWithMediaGroup(photosArray);
        ctx.session.QueuePhotoMessageIds = photoMessage.map(
          (message) => message.message_id
        );
      } else {
        await generateQueueTable(queue, lesson);
        photoMessage = await ctx.replyWithPhoto(
          new InputFile(`./src/tables/${lesson.name}Table.png`)
        );
        ctx.session.QueuePhotoMessageId = photoMessage.message_id;
      }
    } else {
      status += `_В таблице ещё никого нет_`;
      condition = true;
    }
    await ctx.reply(`${lesson.emoji} *Очередь на ${lesson.title}* ` + status, {
      parse_mode: "MarkdownV2",
      reply_markup: getReturnKeyboard(condition, lesson.name, true),
    });
  }

  lessons.forEach((lesson) => {
    bot.callbackQuery(lesson.name, async (ctx) => {
      await showQueue(ctx, lesson);
    });
  });

  bot.callbackQuery(/deleteFrom:(.+)/, async (ctx) => {
    await ctx.answerCallbackQuery();

    if (ctx.session.QueuePhotoMessageId) {
      try {
        await ctx.api.deleteMessage(
          ctx.chat.id,
          ctx.session.QueuePhotoMessageId
        );
      } catch (error) {
        if (error.message.includes("message can't be deleted for everyone")) {
          console.log("Сообщение уже удалено или не может быть удалено.");
        } else {
          console.error("Произошла другая ошибка:", error);
        }
      }
      ctx.session.QueuePhotoMessageId = undefined;
    }

    const lessonType = ctx.match[1];

    await ctx.callbackQuery.message.editText(`*Удалить вас с таблицы?*`, {
      parse_mode: "MarkdownV2",
      reply_markup: confirmDelete(lessonType),
    });
  });

  bot.callbackQuery(/yesFor:(.+)/, async (ctx) => {
    await ctx.answerCallbackQuery();

    const lessonType = ctx.match[1];
    const userInfo = await getInfoById(ctx.from.id.toString());

    const lesson = lessons.find((ls) => ls.name === lessonType);
    await deleteUserFromTable(lesson, userInfo.tg_id);

    // let queue = await getQueue(lessonType);

    // queue = queue.filter((item) => item.tg_id != ctx.from.id);

    // if (queue?.length) {
    //   deleteUserFromTable(, lessonType);
    // } else {
    //   clearTable(lessonType);
    // }

    console.log(
      getTime() + " " + userInfo.surname + " удалил себя из таблицы " + ""
    );
    await ctx.callbackQuery.message.editText(`*Вы удалены из таблицы*`, {
      parse_mode: "MarkdownV2",
      reply_markup: getReturnKeyboard(false, lessonType),
    });
  });

  bot.callbackQuery(/noFor:(.+)/, async (ctx) => {
    await ctx.answerCallbackQuery();

    const lessonType = ctx.match[1];

    await ctx.callbackQuery.message.editText(
      `*Вы не были удалены из таблицы*`,
      {
        parse_mode: "MarkdownV2",
        reply_markup: getReturnKeyboard(false, lessonType),
      }
    );
  });
}

module.exports = { lessonsQueueCommand };
