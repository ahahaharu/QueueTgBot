const { sendMessages, sendEndMessage } = require('../../commands/delayedMsgs');
const { readConfig, writeConfig } = require ('../../utils/config')

async function sendScheduledMessages(bot, schedule, messageType) {
    for (const el of schedule) {
        const config = await readConfig();
        if (messageType === 'kprog') {
            config.KProgLessonType = el.type;
        } else if (messageType === 'isp') {
            config.ISPLessonType = el.type;
        } else if (messageType === 'pzma') {
            config.PZMALessonType = el.type;
        } 
        
        await writeConfig(config);

        sendMessages(bot, el.time, messageType, el.type);
    }
}

function sendEndScheduledMessages(bot, endSchedule) {
    for (const time of endSchedule) {
        sendEndMessage(bot, time);
    }
}

module.exports = { sendScheduledMessages, sendEndScheduledMessages };
