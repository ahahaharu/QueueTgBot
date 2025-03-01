const {
  sendScheduledMessages,
  sendEndScheduledMessages,
} = require("./scheduleUtils");
const { lessons } = require("../../../data/lessons");

function setSchedules(bot) {
  lessons.forEach((lesson) => {
    sendScheduledMessages(bot, lesson.scheduleOfLessons, lesson.name);
    if (lesson.isPriority) {
      sendEndScheduledMessages(bot, lesson.scheduleOfEnd, lesson.name);
    }
  });

  // sendEndScheduledMessages(bot, KProgEnd, 'КПрог');
  // sendEndScheduledMessages(bot, BZCHEnd, 'БЖЧ');
}

module.exports = {
  setSchedules,
};
