const ISPSchedule = new Array();

/*
    0 - общая пара
    1 - первая подгруппа
    2 - вторая подгруппа
*/

//test
ISPSchedule.push({
    time: '2024-10-31 15:05',
    type: 0
});

ISPSchedule.push({
    time: '2024-11-04 17:00',
    type: 2
});
ISPSchedule.push({
    time: '2024-11-11 17:00',
    type: 1
});
ISPSchedule.push({
    time: '2024-11-13 17:00',
    type: 0
});
ISPSchedule.push({
    time: '2024-11-18 17:00',
    type: 2
});
ISPSchedule.push({
    time: '2024-11-25 17:00',
    type: 1
});

ISPSchedule.push({
    time: '2024-12-02 17:00',
    type: 2
});
ISPSchedule.push({
    time: '2024-12-09 17:00',
    type: 1
});
ISPSchedule.push({
    time: '2024-12-11 17:00',
    type: 0
});
ISPSchedule.push({
    time: '2024-12-16 17:00',
    type: 2
});
ISPSchedule.push({
    time: '2024-12-23 17:00',
    type: 1
});


module.exports = { ISPSchedule }