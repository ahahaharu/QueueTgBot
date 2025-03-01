const { InlineKeyboard } = require("grammy");
const { lessons } = require("../../data/lessons");

const menuKeyboard = new InlineKeyboard()
  .text("👤 Профиль", "profile")
  .row()
  .text("📒 Очереди", "queue")
  .row();

const queueKeyboard = new InlineKeyboard();
lessons.forEach((lesson) => {
  queueKeyboard.text(`${lesson.emoji}${lesson.title}`, lesson.name).row();
});
queueKeyboard.text("↩️Вернуться в меню", "returnToMenu").row();

// TODO: поправить клавиатуру
function getReturnKeyboard(condition, lessonType, isQueue) {
  const keyboard = new InlineKeyboard();

  const lesson = lessons.find((ls) => ls.name === lessonType);

  if (condition) {
    keyboard.text("✍️Записаться", `signLesson:${lessonType}`).row();
  } else {
    if (isQueue && !lesson.isBrigadeType) {
      keyboard.text("❌Я не приду на пару", `deleteFrom:${lessonType}`).row();
    }
  }

  if (lesson.isPriority) {
    keyboard.text("📝Приоритеты", `priorityInfoFor:${lessonType}`).row();
  }

  keyboard.text("↩️Вернуться к очередям", "queue").row();

  return keyboard;
}

function confirmDelete(lessonType) {
  const confirmKeyboard = new InlineKeyboard()
    .text("Да", `yesFor:${lessonType}`)
    .text("Нет", `noFor:${lessonType}`);

  return confirmKeyboard;
}

function doWithTable(lesson) {
  const doWithKeyboard = new InlineKeyboard()
    .text(
      `Удалить ${lesson.isBrigadeType ? "бригаду" : "пользователя"} из таблицы`,
      `deleteUserIn:${lesson.name}`
    )
    .row();

  if (lesson.isPriority) {
    doWithKeyboard
      .text(
        `Поставить приоритет ${
          lesson.isBrigadeType ? "бригаде" : "пользователю"
        }`,
        `deleteUserIn:${lesson.name}`
      )
      .row();
  }
  doWithKeyboard
    .text("Очистить таблицу", `clear:${lesson.name}`)
    .row()
    .text("Вернуться к таблицам", `queueToChange`)
    .row();
  return doWithKeyboard;
}

const selectQueueKeyboard = new InlineKeyboard();
lessons.forEach((lesson) => {
  selectQueueKeyboard
    .text(`${lesson.emoji}${lesson.title}`, `change:${lesson.name}`)
    .row();
});
selectQueueKeyboard.text("↩️Вернуться в админ меню", "adminmenu").row();

const returnToMenuKeyboard = new InlineKeyboard().text(
  "↩️Вернуться в меню",
  "returnToMenu"
);

const returnToQueueKeyboard = new InlineKeyboard().text(
  "↩️Вернуться к очередям ",
  "queue"
);

function returnToLessonQueue(lesson) {
  const returnKeyboard = new InlineKeyboard().text(
    `↩️Вернуться к ${lessons.find((ls) => ls.name === lesson).title} `,
    `${lesson}`
  );
  return returnKeyboard;
}

function createStatusKeyboard(subject) {
  return new InlineKeyboard()
    .text("🟩Сдал(-а)", `passed:${subject}`)
    .row()
    .text("🟨Подошёл(-ла), но не сдал(-а)", `notPassed:${subject}`)
    .row()
    .text("🟥Не успел(-а) подойти", `notPsbl:${subject}`)
    .row();
}

const adminKeyboard = new InlineKeyboard()
  .text("Изменить таблицу", "queueToChange")
  .row()
  .text("Отправить сообщение всем", "sendMsg")
  .row();

const setPriorityKeyboard = new InlineKeyboard()
  .text("🟥 Красный", "setRedPriority")
  .row()
  .text("🟨 Жёлтый", "setYellowPriority")
  .row()
  .text("🟩 Зелёный", "setGreenPriority")
  .row()
  .text("🟪 Санкции", "setPurplePriority")
  .row();

function createSignButton(lessonType) {
  return new InlineKeyboard().text("✍️Записаться", `signLesson:${lessonType}`);
}

module.exports = {
  menuKeyboard,
  returnToMenuKeyboard,
  queueKeyboard,
  returnToQueueKeyboard,
  createSignButton,
  createStatusKeyboard,
  adminKeyboard,
  setPriorityKeyboard,
  getReturnKeyboard,
  selectQueueKeyboard,
  doWithTable,
  confirmDelete,
  returnToLessonQueue,
};
