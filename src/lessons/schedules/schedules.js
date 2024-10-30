const { sendScheduledMessages, sendEndScheduledMessages } = require('./scheduleUtils');
const { KProgShedule, KProgEnd } = require('./KProgShedule');  // импортируем расписание КПрог

/**
 * Функция для отправки сообщений расписания КПрог.
 * @param {Object} bot - экземпляр бота.
 */
function sendKProgMessages(bot) {
    sendScheduledMessages(bot, KProgShedule, "kprog");
}

/**
 * Функция для отправки завершающих сообщений расписания КПрог.
 * @param {Object} bot - экземпляр бота.
 */
function sendKProgEnd(bot) {
    sendEndScheduledMessages(bot, KProgEnd);
}

// Экспортируем все функции расписаний
module.exports = {
    sendKProgMessages,
    sendKProgEnd,
    // Добавим другие расписания, если они есть
};
