const { sendScheduledMessages, sendEndScheduledMessages } = require('./scheduleUtils');
const { KProgSchedule, KProgEnd } = require('./KProgSchedule');
const { ISPSchedule } = require('./ISPSchedule');
const { PZMASchedule } = require('./PZMASchedule');
const { MCHASchedule } = require('./MCHASchedule');
const { BZCHSchedule, BZCHEnd } = require('./BZCHSchedule');


function setSchedules(bot) {
    sendScheduledMessages(bot, KProgSchedule, "kprog");
    sendScheduledMessages(bot, ISPSchedule, "isp");
    sendScheduledMessages(bot, PZMASchedule, "pzma");
    sendScheduledMessages(bot, MCHASchedule, "mcha");
    sendScheduledMessages(bot, BZCHSchedule, "bzch");
    sendEndScheduledMessages(bot, KProgEnd, 'КПрог');
    sendEndScheduledMessages(bot, BZCHEnd, 'БЖЧ');
}

module.exports = {
    setSchedules
};
