const { sendScheduledMessages, sendEndScheduledMessages } = require('./scheduleUtils');
const { KProgSchedule, KProgEnd } = require('./KProgSchedule');
const { ISPSchedule } = require('./ISPSchedule');


function setSchedules(bot) {
    sendScheduledMessages(bot, KProgSchedule, "kprog");
    sendScheduledMessages(bot, ISPSchedule, "isp");
    sendEndScheduledMessages(bot, KProgEnd);
}

module.exports = {
    setSchedules
};
