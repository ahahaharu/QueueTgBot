const { sendMessages, sendEndMessage } = require("../../commands/delayedMsgs");

async function sendScheduledMessages(bot, schedule, name) {
  for (const el of schedule) {
    sendMessages(bot, el.time, name, el.type);
  }
}

function sendEndScheduledMessages(bot, endSchedule, lesson) {
  for (const time of endSchedule) {
    sendEndMessage(bot, time, lesson);
  }
}

module.exports = { sendScheduledMessages, sendEndScheduledMessages };
