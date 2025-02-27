const { getTime } = require("../bot/getTime");
const { returnToBZCH, returnToLessonQueue } = require("../bot/keyboards");
const {
  isInBZCH,
  getInfoById,
  isInQueue,
  getQueue,
} = require("../database/database");
const { lessons } = require("../../data/lessons");
const { statusCheck } = require("./statusCheck");
const { getBrigadeNum } = require("../bot/getBrigadeNum");

function signCommand(bot) {
  bot.callbackQuery(/signLesson:(.+)/, async (ctx) => {
    if (await statusCheck(ctx)) {
      return;
    }
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
    const lesson = lessons.find((ls) => ls.name === lessonType);
    let workType = "лабораторной \\(лабораторных\\)";
    const userInfo = await getInfoById(ctx.from.id.toString());

    if (lesson.isBrigadeType) {
      const queue = await getQueue(lesson.name);
      workType = "ПЗ";
      const brigade_num = getBrigadeNum(userInfo.tg_id);
      let index;
      if (queue?.length) {
        index = queue.findIndex((item) => item.brigade_num == brigade_num);
      } else {
        index = -1;
      }

      if (index != -1) {
        await ctx.callbackQuery.message.editText(
          `*Один из членов вашей бригады уже записался в таблицу*`,
          {
            parse_mode: "MarkdownV2",
            reply_markup: returnToLessonQueue(lesson.name),
          }
        );
        return;
      }
    } else {
      const isReg = await isInQueue(ctx.from.id.toString(), lessonType);
      if (isReg) {
        await ctx.callbackQuery.message.editText(
          `*Вы уже записаны в эту таблицу*`,
          {
            parse_mode: "MarkdownV2",
            reply_markup: returnToLessonQueue(lessonType),
          }
        );
        return;
      }
    }

    // if (lessonType == "BZCH") {
    //   workType = "ПЗ";
    //   const isReg = await isInBZCH(userInfo.brigade_id);
    //   if (isReg) {
    //     await ctx.callbackQuery.message.editText(
    //       `*Один из членов вашей бригады уже записался в таблицу*`,
    //       {
    //         parse_mode: "MarkdownV2",
    //         reply_markup: returnToLessonQueue("BZCH"),
    //       }
    //     );
    //     return;
    //   }
    // } else {

    //}
    await ctx.callbackQuery.message.editText(
      `*Запись на ${
        lessons.find((lesson) => lesson.name === lessonType).title
      }*\n\nВведите номер ${workType} , которую вы будете сдавать\\:`,
      {
        parse_mode: "MarkdownV2",
      }
    );
    console.log(getTime() + " " + userInfo.surname + " записывается в таблицу");
    ctx.session.step = `waiting_for_${lessonType}Lab`;
  });
}

module.exports = { signCommand };
