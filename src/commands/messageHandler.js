const { inputCheck } = require("../bot/inputCheck");

const {
  setPriorityKeyboard,
  returnToLessonQueue,
} = require("../bot/keyboards");

const {
  getInfoById,
  insertIntoQueue,
  getQueue,
  isInUsers,
  clearTable,
  isInBZCH,
  getBZCHPriorityTable,
} = require("../database/database");

const { sendMessageForAll } = require("./delayedMsgs");
const { returnConfigs } = require("../utils/config");
const { lessons } = require("../../data/lessons");
const { getTime } = require("../bot/getTime");
const { getBrigadeNum } = require("../bot/getBrigadeNum");

function returnQueueArray(lesson) {
  const queue = [];
  if (lesson.hasSubgroupType && lesson.isPriority) {
    queue.push([[], [], []], [[], [], []]);
  } else if (lesson.hasSubgroupType) {
    queue.push([], []);
  } else if (lesson.isPriority) {
    queue.push([], [], []);
  }
  return queue;
}

function messageHandler(bot) {
  bot.on("message", async (ctx) => {
    let message = ctx.message.text;
    const userInfo = await getInfoById(ctx.from.id.toString());

    console.log(getTime() + " " + userInfo.surname + ": " + message);

    async function signToTable(lesson) {
      let lab = message;
      let labs = inputCheck(lab, lesson.labsCount);
      if (!(ctx.message.text && lab.length < 20 && labs)) {
        await ctx.reply(
          "*Неверное значение\\!* Введите номера лаб верно\\!\n\n_Например\\: 1\\, 2_",
          {
            parse_mode: "MarkdownV2",
          }
        );
        return;
      }

      // const [/*subjectQueue*/ /*BZCH_Priority*/ userInfo, configs] =
      //   await Promise.all([
      //     //getQueue(options.subjectName),
      //     //getBZCHPriorityTable(),
      //     getInfoById(ctx.from.id.toString()),
      //     returnConfigs(),
      //   ]);

      const userInfo = await getInfoById(ctx.from.id.toString());
      const queue = getQueue(lesson.name);
      let brigade_num;
      if (queue?.length) {
        if (lesson.isBrigadeType) {
          brigade_num = await getBrigadeNum(lesson.name, userInfo.tg_id);
          const index = queue.find((item) => item.brigade_num == brigade_num);
          if (index != -1) {
            await ctx.reply(`⚠️ Член вашей бригады уже записался в таблицу!`, {
              reply_markup: returnToLessonQueue(options.subjectName),
            });
            return;
          }
        } else {
          const index = queue.find((item) => item.tg_id == userInfo.tg_id);
          if (index != -1) {
            await ctx.reply(`❌ Ошибка! Вы уже записанны в таблицу!`, {
              reply_markup: returnToLessonQueue(options.subjectName),
            });
            return;
          }
        }
      }
      // const queue = options.queue;
      // let priorityIndex;
      // let subgroupIndex, userSubgpoup;
      // const lessonType = configs.get(options.subjectName).lessonType;

      // if (options.isBZCH) {
      //   const isReg = await isInBZCH(userInfo.brigade_id);
      //   if (isReg) {
      //     await ctx.reply(
      //       `*Один из членов вашей бригады уже записался в таблицу*`,
      //       {
      //         parse_mode: "MarkdownV2",
      //         reply_markup: returnToLessonQueue("BZCH"),
      //       }
      //     );
      //     return;
      //   }
      // } else {
      // if (lessonType == 0) {
      //   queue.pop();
      //   queue.flat(1);
      //   userSubgpoup = 0;
      // } else {
      //   userSubgpoup = userInfo.subgroup - 1;
      // }
      // //}

      // let priority;
      // if (options.isPriority) {
      //   priorityIndex = new Map();
      //   priorityIndex.set("Красный", 0);
      //   priorityIndex.set("Жёлтый", 1);
      //   priorityIndex.set("Зелёный", 2);
      //   priorityIndex.set("Санкции", 2);
      //   // if (options.isBZCH) {
      //   //   priority = BZCH_Priority[userInfo.brigade_id - 1].priority;
      //   // }
      // }

      // if (subjectQueue?.length) {
      //   subjectQueue.forEach((item) => {
      //     if (lessonType == 0) {
      //       subgroupIndex = 0;
      //     } else {
      //       subgroupIndex = item.subgroup - 1;
      //     }
      //     // if (options.isBZCH) {
      //     //   queue[priorityIndex.get(item.priority)].push(item);
      //     // } else if (options.isPriority) {
      //     //   queue[subgroupIndex][priorityIndex.get(item.priority)].push(item);
      //     // } else {
      //     //   queue[subgroupIndex].push(item);
      //     // }
      //   });
      //}

      // if (options.isBZCH) {
      //   queue[priorityIndex.get(priority)].push({
      //     brigade_id: userInfo.brigade_id,
      //     labs: labs,
      //     priority: priority,
      //   });
      // } else {

      let item;
      if (lesson.isBrigadeType) {
        item = {
          brigade_num: await getBrigadeNum(lesson.name, userInfo.tg_id),
          labs: labs,
        };
      } else {
        item = {
          tg_id: userInfo.tg_id,
          surname: userInfo.surname,
          labs: labs,
          subgroup: userInfo.subgroup,
          ...(lesson.isPriority && { priority: userInfo.priority }),
        };
      }
      // if (options.isPriority) {
      //   queue[userSubgpoup][priorityIndex.get(userInfo.priority)].push(item);
      // } else {
      //   queue[userSubgpoup].push(item);
      // }

      // if (lessonType == 2) {
      //   [queue[0], queue[1]] = [queue[1], queue[0]];
      // }
      // // }
      // let flatNum = options.subjectName === "KProg" ? 2 : 1;
      insertIntoQueue(item, lesson);

      await ctx.reply(`✅ Отлично! Вы записаны!`, {
        reply_markup: returnToLessonQueue(lesson.name),
      });

      console.log(
        getTime() +
          " " +
          userInfo.surname +
          " записался в таблицу " +
          lesson.name +
          ". Лабы: " +
          labs
      );

      ctx.session.step = null;
    }

    async function deleteInTable(subject) {
      let surname = message;

      let queue = await getQueue(subject);

      const index = queue.findIndex((item) => item.surname == surname);
      if (index === -1) {
        await ctx.reply("Такого пользователя нет в таблице");
        return;
      }
      queue = queue.filter((item) => item.surname !== surname);

      if (queue?.length) {
        insertIntoQueue(queue, subject);
      } else {
        clearTable(subject);
      }

      await ctx.reply("Пользователь удалён из таблицы");

      ctx.session.step = null;
    }

    const match = ctx.session.step.match(/^waiting_for_(\w+)Lab$/);
    if (match) {
      const subject = match[1];
      const lesson = lessons.find((l) => l.name === subject);
      await signToTable(lesson);
    }

    // if (ctx.session.step === "waiting_for_KProgLab") {
    //   const options = {
    //     subjectName: "KProg",
    //     numOfLabs: 8,
    //     queue: [
    //       [[], [], []],
    //       [[], [], []],
    //     ],
    //     isPriority: true,
    //     isBZCH: false,
    //   };
    //   await signToTable(options);
    // } else if (ctx.session.step === "waiting_for_ISPLab") {
    //   const options = {
    //     subjectName: "ISP",
    //     numOfLabs: 8,
    //     queue: [[], []],
    //     isPriority: false,
    //     isBZCH: false,
    //   };
    //   await signToTable(options);
    // } else if (ctx.session.step === "waiting_for_PZMALab") {
    //   const options = {
    //     subjectName: "PZMA",
    //     numOfLabs: 4,
    //     queue: [[], []],
    //     isPriority: false,
    //     isBZCH: false,
    //   };
    //   await signToTable(options);
    // } else if (ctx.session.step === "waiting_for_MCHALab") {
    //   const options = {
    //     subjectName: "MCHA",
    //     numOfLabs: 10,
    //     queue: [[], []],
    //     isPriority: false,
    //     isBZCH: false,
    //   };
    //   await signToTable(options);
    // } else if (ctx.session.step === "waiting_for_BZCHLab") {
    //   const options = {
    //     subjectName: "BZCH",
    //     numOfLabs: 9,
    //     queue: [[], [], []],
    //     isPriority: true,
    //     isBZCH: true,
    //   };
    //   await signToTable(options);
    // } else
    else if (ctx.session.step === "waiting_for_prioritySurname") {
      let surname = ctx.message.text;

      let isUserRegistered = await isInUsers(surname);
      if (isUserRegistered) {
        ctx.session.surname = surname;
        ctx.session.step = "waiting_for_priority";
        await ctx.reply("Какой приоритет выставить?", {
          reply_markup: setPriorityKeyboard,
        });
      } else {
        await ctx.reply(
          "❌ *Такого студента нет в группе\\!* Введите корректную фамилию:",
          {
            parse_mode: "MarkdownV2",
          }
        );
      }

      ctx.session.step = null;
    } else if (ctx.session.step === "waiting_for_adminMessage") {
      let text = ctx.message.text;

      await sendMessageForAll(bot, text);

      ctx.session.step = null;
    } else if (ctx.session.step === "waiting_for_KProgToDelete") {
      deleteInTable("KProg");
    } else if (ctx.session.step === "waiting_for_ISPToDelete") {
      deleteInTable("ISP");
    } else if (ctx.session.step === "waiting_for_PZMAToDelete") {
      deleteInTable("PZMA");
    } else if (ctx.session.step === "waiting_for_MCHAToDelete") {
      deleteInTable("MCHA");
    } else if (ctx.session.step === "waiting_for_brigadeToDelete") {
      let brigade = message;

      let queue = await getQueue("BZCH");

      const index = queue.findIndex((item) => item.brigade_id == brigade);
      if (index === -1) {
        await ctx.reply("Такой бригады нет в таблице");
        return;
      }
      queue = queue.filter((item) => item.brigade_id != brigade);

      if (queue?.length) {
        insertIntoQueue(queue, "BZCH");
      } else {
        clearTable("BZCH");
      }

      await ctx.reply("Бригада удалена из таблицы");

      ctx.session.step = null;
    } else {
      await ctx.reply(
        "❓ Я не понимаю это сообщение. Для начала нажмите /start или перейдите в меню /menu"
      );
    }
  });
}

module.exports = { messageHandler };
