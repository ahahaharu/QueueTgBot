const {} = require("../src/bot/keyboards");
const { MPPiU_brigades } = require("./MPPiU_brigades");

const lessons = [
  {
    name: "ISP",
    title: "ИСП",
    emoji: "💻",
    labsCount: 7,
    isPriority: false,
    isBrigadeType: false,
    brigadeData: null,
    canSplit: true,
    hasSubgroupType: true,
    workType: "lab",
    scheduleOfLessons: [
      {
        time: "2025-02-19 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-02-19 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-02-24 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-02-27 17:00",
        type: 2,
        isSplit: false,
      },
      {
        time: "2025-03-05 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-03-05 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-03-10 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-03-13 17:00",
        type: 1,
        isSplit: false,
      },
      {
        time: "2025-03-19 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-03-19 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-03-24 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-03-27 17:00",
        type: 2,
        isSplit: false,
      },
      {
        time: "2025-04-02 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-04-02 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-04-07 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-04-10 17:00",
        type: 1,
        isSplit: false,
      },
      {
        time: "2025-04-16 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-04-16 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-04-21 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-04-24 17:00",
        type: 2,
        isSplit: false,
      },
      {
        time: "2025-04-30 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-04-30 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-05-05 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-05-08 17:00",
        type: 1,
        isSplit: false,
      },
      {
        time: "2025-05-14 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-05-14 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-05-19 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-05-22 17:00",
        type: 2,
        isSplit: false,
      },
      {
        time: "2025-05-28 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-05-28 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-06-02 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-06-05 17:00",
        type: 2,
        isSplit: false,
      },
    ],
    scheduleOfEnd: [],
  },
  {
    name: "MPPiU",
    title: "МППиУ",
    emoji: "",
    labsCount: 8,
    isPriority: true,
    isBrigadeType: true,
    brigadeData: MPPiU_brigades,
    canSplit: false,
    hasSubgroupType: false,
    workType: "pz",
    scheduleOfLessons: [
      {
        time: "2025-02-19 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-02-19 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-02-24 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-02-27 17:00",
        type: 2,
        isSplit: false,
      },
      {
        time: "2025-03-05 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-03-05 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-03-10 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-03-13 17:00",
        type: 1,
        isSplit: false,
      },
      {
        time: "2025-03-19 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-03-19 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-03-24 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-03-27 17:00",
        type: 2,
        isSplit: false,
      },
      {
        time: "2025-04-02 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-04-02 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-04-07 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-04-10 17:00",
        type: 1,
        isSplit: false,
      },
      {
        time: "2025-04-16 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-04-16 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-04-21 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-04-24 17:00",
        type: 2,
        isSplit: false,
      },
      {
        time: "2025-04-30 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-04-30 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-05-05 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-05-08 17:00",
        type: 1,
        isSplit: false,
      },
      {
        time: "2025-05-14 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-05-14 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-05-19 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-05-22 17:00",
        type: 2,
        isSplit: false,
      },
      {
        time: "2025-05-28 17:00",
        type: 1,
        isSplit: true,
      },
      {
        time: "2025-05-28 17:00",
        type: 2,
        isSplit: true,
      },
      {
        time: "2025-06-02 17:00",
        type: 0,
        isSplit: false,
      },
      {
        time: "2025-06-05 17:00",
        type: 2,
        isSplit: false,
      },
    ],
    scheduleOfEnd: [],
  },
];

module.exports = { lessons };
