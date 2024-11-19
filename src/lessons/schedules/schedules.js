const { sendScheduledMessages, sendEndScheduledMessages } = require('./scheduleUtils');
const { KProgSchedule, KProgEnd } = require('./KProgSchedule');
const { ISPSchedule } = require('./ISPSchedule');
const { PZMASchedule } = require('./PZMASchedule');
const { MCHASchedule } = require('./MCHASchedule');
const { BZCHSchedule } = require('./BZCHSchedule');


function setSchedules(bot) {
    sendScheduledMessages(bot, KProgSchedule, "kprog");
    sendScheduledMessages(bot, ISPSchedule, "isp");
    sendScheduledMessages(bot, PZMASchedule, "pzma");
    sendScheduledMessages(bot, MCHASchedule, "mcha");
    sendScheduledMessages(bot, BZCHSchedule, "bzch");
    sendEndScheduledMessages(bot, KProgEnd);
}

module.exports = {
    setSchedules
};
