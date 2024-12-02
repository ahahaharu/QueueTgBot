const KProgSchedule = new Array();
const KProgEnd = new Array();

/*
    0 - общая пара
    1 - первая подгруппа
    2 - вторая подгруппа
*/

//test
KProgSchedule.push({
    time: '2024-11-04 18:55',
    type: 1
});

KProgSchedule.push({
    time: '2024-10-27 17:00',
    type: 2
});
KProgSchedule.push({
    time: '2024-11-03 17:00',
    type: 1
});
KProgSchedule.push({
    time: '2024-11-07 17:15',
    type: 0
});
KProgSchedule.push({
    time: '2024-11-07 18:00',
    type: 0
});

KProgSchedule.push({
    time: '2024-11-07 22:00',
    type: 0
});

KProgSchedule.push({
    time: '2024-11-08 11:00',
    type: 0
});
KProgSchedule.push({
    time: '2024-11-08 13:00',
    type: 0
});
KProgSchedule.push({
    time: '2024-11-08 17:00',
    type: 0
});

KProgSchedule.push({
    time: '2024-11-09 12:00',
    type: 0
});

KProgSchedule.push({
    time: '2024-11-09 18:30',
    type: 0
});

KProgSchedule.push({
    time: '2024-11-13 19:55',
    type: 2
});
KProgSchedule.push({
    time: '2024-11-17 17:00',
    type: 1
});
KProgSchedule.push({
    time: '2024-11-21 17:00',
    type: 0
});
KProgSchedule.push({
    time: '2024-11-24 17:00',
    type: 2
});
KProgSchedule.push({
    time: '2024-12-01 17:00',
    type: 1
});
KProgSchedule.push({
    time: '2024-12-05 17:00',
    type: 0
});
KProgSchedule.push({
    time: '2024-12-08 17:00',
    type: 2
});
KProgSchedule.push({
    time: '2024-12-15 17:00',
    type: 1
});
KProgSchedule.push({
    time: '2024-12-19 17:00',
    type: 0
});
KProgSchedule.push({
    time: '2024-12-22 17:00',
    type: 2
});

// Тест
KProgEnd.push("2024-11-04 18:56");
KProgEnd.push('2024-10-28 15:20');
KProgEnd.push('2024-11-04 15:20');
KProgEnd.push('2024-11-08 11:55');
KProgEnd.push('2024-11-13 19:56');
KProgEnd.push('2024-11-18 15:20');
KProgEnd.push('2024-11-22 11:55');
KProgEnd.push('2024-11-25 15:20');
KProgEnd.push('2024-12-02 15:30');
KProgEnd.push('2024-12-06 11:55');
KProgEnd.push('2024-12-09 15:20');
KProgEnd.push('2024-12-16 15:20');
KProgEnd.push('2024-12-20 11:55');
KProgEnd.push('2024-12-23 15:20');

module.exports = { KProgSchedule, KProgEnd }