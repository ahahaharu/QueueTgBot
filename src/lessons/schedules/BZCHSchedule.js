const BZCHSchedule = new Array();
const BZCHEnd = new Array();

/*
    0 - общая пара
    1 - первая подгруппа
    2 - вторая подгруппа
*/

//test
BZCHSchedule.push({
    time: '2024-11-28 01:23',
    type: 0
});

BZCHSchedule.push({
    time: '2024-11-20 17:00',
    type: 0
});

BZCHSchedule.push({
    time: '2024-11-29 17:00',
    type: 0
});

BZCHSchedule.push({
    time: '2024-12-04 17:00',
    type: 0
});

BZCHSchedule.push({
    time: '2024-12-18 17:00',
    type: 0
});

BZCHSchedule.push({
    time: '2024-12-27 17:00',
    type: 0
});
BZCHEnd.push('2024-11-28 01:50');
BZCHEnd.push('2024-11-30 11:55');
BZCHEnd.push('2024-12-05 11:55');
BZCHEnd.push('2024-12-05 11:55');
BZCHEnd.push('2024-12-19 11:55');
BZCHEnd.push('2024-12-28 11:55');

module.exports = { BZCHSchedule, BZCHEnd }