const { sendMessages, sendEndMessage } = require('../../delayedMsgs')

const KProgShedule = new Array();
const KProgEnd = new Array();

/*
    0 - общая пара
    1 - первая подгруппа
    2 - вторая подгруппа
*/

//test
KProgShedule.push({
    time: '2024-10-29 14:51',
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

// Тест
KProgEnd.push("2024-10-28 13:05");
KProgEnd.push('2024-10-28 15:20');
KProgEnd.push('2024-11-04 15:20');
KProgEnd.push('2024-11-08 11:55');
KProgEnd.push('2024-11-11 15:20');
KProgEnd.push('2024-11-18 15:20');
KProgEnd.push('2024-11-22 11:55');
KProgEnd.push('2024-11-25 15:20');
KProgEnd.push('2024-12-02 15:20');
KProgEnd.push('2024-12-06 11:55');
KProgEnd.push('2024-12-09 15:20');
KProgEnd.push('2024-12-16 15:20');
KProgEnd.push('2024-12-20 11:55');
KProgEnd.push('2024-12-23 15:20');

function sendKProgMessages(bot) {
    for (el of KProgShedule) {
        sendMessages(bot, el.time, "kprog", el.type);
    }
}

function sendKProgEnd(bot) {
    for (el of KProgEnd) {
        sendEndMessage(bot, el);
    }
}


module.exports = { sendKProgMessages, sendKProgEnd }