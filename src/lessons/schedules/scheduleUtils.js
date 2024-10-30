const { sendMessages, sendEndMessage } = require('../../commands/delayedMsgs');

/**
 * Универсальная функция для отправки сообщений по расписанию.
 * @param {Object} bot - экземпляр бота.
 * @param {Array} schedule - массив объектов расписания { time, type }.
 * @param {string} messageType - тип сообщения, используемый для различения задач.
 */
function sendScheduledMessages(bot, schedule, messageType) {
    for (const el of schedule) {
        sendMessages(bot, el.time, messageType, el.type);
    }
}

/**
 * Универсальная функция для отправки завершающих сообщений по расписанию.
 * @param {Object} bot - экземпляр бота.
 * @param {Array} endSchedule - массив строк с датами завершения.
 */
function sendEndScheduledMessages(bot, endSchedule) {
    for (const time of endSchedule) {
        sendEndMessage(bot, time);
    }
}

module.exports = { sendScheduledMessages, sendEndScheduledMessages };
