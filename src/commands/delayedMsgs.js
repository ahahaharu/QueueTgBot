const {
  getAllUsers,
  getQueue,
  setPriority,
  clearTable,
  setBZCHPriority,
  setPriorityStatus,
  setPriorityByBrigadeNum,
} = require("../database/database");
const schedule = require("node-schedule");
const {
  createSignButton,
  kprogStatusKeyboard,
  createStatusKeyboard,
} = require("../bot/keyboards");
const { lessons } = require("../../data/lessons");
const { readConfig, writeConfig } = require("../utils/config");
const Mutex = require("async-mutex").Mutex;
const configMutex = new Mutex();

const sendMessagesToUsers = async (
  bot,
  message,
  replyMarkup,
  isEnd,
  lesson
) => {
  let users;
  if (isEnd) {
    if (lesson.isBrigadeType) {
      const queue = await getQueue(lesson.name);
      const lesson_brigades = await getQueue(`${lesson.name}_brigades`);
      const usersInBrigades = [];
      for (let brigade of queue) {
        usersInBrigades.push(
          lesson_brigades.filter(
            (line) => line.brigade_num === brigade.brigade_num
          )
        );
      }
      users = usersInBrigades.flat();
    } else {
      users = await getQueue(lesson.name);
    }
  } else {
    users = await getAllUsers();
  }

  console.log(`Всего пользователей в базе: ${users.length}`);

  const sendPromises = users.map(async (user) => {
    const userId = user.tg_id;
    try {
      console.log(
        `Попытка отправки сообщения пользователю ${user.surname} с id ${userId}`
      );
      await bot.api.sendMessage(userId, message, {
        parse_mode: "MarkdownV2",
        reply_markup: replyMarkup,
      });
      console.log(
        `Сообщение успешно отправлено пользователю ${user.surname} с id ${userId}`
      );
    } catch (error) {
      console.error(
        `Не удалось отправить сообщение пользователю ${userId}:`,
        error.response?.description || error.message
      );
    }
  });

  await Promise.all(sendPromises);
  console.log("Сообщения отправлены всем пользователям.");
};

function sendMessages(bot, dateTime, lessonName, type) {
  const [date, time] = dateTime.split(" ");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  let lesson = lessons.find((ls) => ls.name === lessonName);

  const jobDate = new Date(year, month - 1, day, hour, minute);
  const tomorrowDate = new Date(jobDate);
  tomorrowDate.setDate(jobDate.getDate() + 1);

  const lessonType =
    type === 0 || type === 3
      ? ""
      : type === 1
      ? "\\(1 подгруппа\\)"
      : "\\(2 подгруппа\\)";
  const message = `*Запись на ${lesson.title} ${tomorrowDate.getDate()}\\.${
    tomorrowDate.getMonth() + 1
  } ${lessonType}*\n\n_Нажмите кнопку ниже, чтобы записаться_`;
  const replyMarkup = createSignButton(lesson.name);

  schedule.scheduleJob(jobDate, async () => {
    await configMutex.runExclusive(async () => {
      const config = await readConfig();

      await clearTable(lesson.name);
      config[lesson.name + "LessonType"] = type;
      config[lesson.name + "Date"] = `${tomorrowDate.getDate()}\\.${
        tomorrowDate.getMonth() + 1
      }`;
      if (lesson.isPriority) {
        config["is" + lesson.name + "End"] = false;
      }
      await writeConfig(config);

      await sendMessagesToUsers(bot, message, replyMarkup, false, lesson);
    });
  });
}

// Функция для отправки сообщения об окончании занятия по КПрог
function sendEndMessage(bot, dateTime, lessonName) {
  const [date, time] = dateTime.split(" ");
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const jobDate = new Date(year, month - 1, day, hour, minute);
  const lesson = lessons.find((ls) => ls.name === lessonName);

  const message = `*Пара по ${lesson.title} закончилась*\n\nСдали ли вы лабораторную работу?`;
  let replyMarkup;

  schedule.scheduleJob(jobDate, async () => {
    const config = await readConfig();
    let data = await getQueue(lessonName);
    if (lesson.isBrigadeType) {
      const lesson_brigades = await getQueue(`${lessonName}_brigades`);
      const usersInBrigades = [];
      for (let brigade of data) {
        usersInBrigades.push(
          lesson_brigades.filter(
            (user) => user.brigade_num === brigade.brigade_num
          )
        );
      }
      data = usersInBrigades.flat();
    }
    config[`is${lessonName}End`] = true;
    for (let user of data) {
      if (lesson.isBrigadeType) {
        await setPriorityByBrigadeNum(user.brigade_num, "Зелёный", lessonName);
      } else {
        await setPriority(user.tg_id, "Зелёный", lessonName);
      }
    }

    await writeConfig(config);

    replyMarkup = createStatusKeyboard(lessonName);
    await sendMessagesToUsers(bot, message, replyMarkup, true, lesson);

    // if (lesson === "КПрог") {
    //   config.isKProgEnd = true;
    //   data = await getQueue("KProg");
    //   for (let user of data) {
    //     await setPriority(user.tg_id, "Зелёный");
    //   }

    //   config.isBZCHEnd = true;
    //   data = await getQueue("BZCH");
    //   for (let brigade of data) {
    //     await setBZCHPriority(brigade.brigade_id, "Зелёный");
    //     await setPriorityStatus(brigade.brigade_id, false);
    //   }
    //   replyMarkup = createStatusKeyboard("BZCH");

    //   await sendMessagesToUsers(bot, message, replyMarkup, true, "BZCH");
    // }
  });
}

async function sendMessageForAll(bot, message) {
  const data = await getAllUsers();

  for (const user of data) {
    const userId = user.tg_id;

    await bot.api.sendMessage(userId, message);
  }
}

async function sendStickerForAll(bot, stickerID) {
  const data = await getAllUsers();

  for (const user of data) {
    const userId = user.tg_id;

    await bot.api.sendSticker(userId, stickerID);
  }
}

module.exports = {
  sendMessages,
  sendEndMessage,
  sendMessageForAll,
  sendStickerForAll,
};
