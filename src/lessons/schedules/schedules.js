const { sendScheduledMessages, sendEndScheduledMessages } = require('./scheduleUtils');
const { KProgSchedule, KProgEnd } = require('./KProgSchedule');
const { ISPSchedule } = require('./ISPSchedule');
const { PZMASchedule } = require('./PZMASchedule');


function setSchedules(bot) {
    sendScheduledMessages(bot, KProgSchedule, "kprog");
    sendScheduledMessages(bot, ISPSchedule, "isp");
    sendScheduledMessages(bot, PZMASchedule, "pzma");
    sendEndScheduledMessages(bot, KProgEnd);
}

module.exports = {
    setSchedules
};
