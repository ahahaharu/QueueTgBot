const { sendScheduledMessages, sendEndScheduledMessages } = require('./scheduleUtils');
const { KProgSchedule, KProgEnd } = require('./KProgSchedule');
const { ISPSchedule } = require('./ISPSchedule');
const { PZMASchedule } = require('./PZMASchedule');
const { MCHASchedule } = require('./MCHASchedule');
const { BZCHSchedule, BZCHEnd } = require('./BZCHSchedule');


function setSchedules(bot) {
    sendScheduledMessages(bot, KProgSchedule, "KProg");
    sendScheduledMessages(bot, ISPSchedule, "ISP");
    sendScheduledMessages(bot, PZMASchedule, "PZMA");
    sendScheduledMessages(bot, MCHASchedule, "MCHA");
    sendScheduledMessages(bot, BZCHSchedule, "BZCH");
    sendEndScheduledMessages(bot, KProgEnd, 'КПрог');
    sendEndScheduledMessages(bot, BZCHEnd, 'БЖЧ');
}

module.exports = {
    setSchedules
};
