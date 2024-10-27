const { sendMessages } = require('../../delayedMsgs')

const KProgShedule = new Array();

/*
    0 - общая пара
    1 - первая подгруппа
    2 - вторая подгруппа
*/

//test
KProgShedule.push({
    time: '2024-10-27 16:36',
    type: 0
});

KProgShedule.push({
    time: '2024-10-27 17:00',
    type: 2
});
KProgShedule.push({
    time: '2024-11-03 17:00',
    type: 1
});
KProgShedule.push({
    time: '2024-11-07 17:00',
    type: 0
});
KProgShedule.push({
    time: '2024-11-10 17:00',
    type: 2
});
KProgShedule.push({
    time: '2024-11-17 17:00',
    type: 1
});
KProgShedule.push({
    time: '2024-11-21 17:00',
    type: 0
});
KProgShedule.push({
    time: '2024-11-24 17:00',
    type: 2
});
KProgShedule.push({
    time: '2024-12-01 17:00',
    type: 1
});
KProgShedule.push({
    time: '2024-12-05 17:00',
    type: 0
});
KProgShedule.push({
    time: '2024-12-08 17:00',
    type: 2
});
KProgShedule.push({
    time: '2024-12-15 17:00',
    type: 1
});
KProgShedule.push({
    time: '2024-12-19 17:00',
    type: 0
});
KProgShedule.push({
    time: '2024-12-22 17:00',
    type: 2
});

function sendKProgMessages(bot) {
    for (el of KProgShedule) {
        sendMessages(bot, el.time, "kprog", el.type);
    }
}


module.exports = { sendKProgMessages }