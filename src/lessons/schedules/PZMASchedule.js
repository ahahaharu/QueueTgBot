const PZMASchedule = new Array();

/*
    0 - общая пара
    1 - первая подгруппа
    2 - вторая подгруппа
*/

//test
PZMASchedule.push({
    time: '2024-10-31 14:38',
    type: 0
});

PZMASchedule.push({
    time: '2024-11-7 17:00',
    type: 2
});
PZMASchedule.push({
    time: '2024-11-21 17:00',
    type: 1
});
PZMASchedule.push({
    time: '2024-11-28 17:00',
    type: 0
});

PZMASchedule.push({
    time: '2024-12-05 17:00',
    type: 2
});
PZMASchedule.push({
    time: '2024-12-19 17:00',
    type: 1
});
PZMASchedule.push({
    time: '2024-12-26 17:00',
    type: 0
});


module.exports = { PZMASchedule }