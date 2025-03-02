const {} = require("../src/bot/keyboards");
const { MPPiU_brigades } = require("./MPPiU_brigades");
const { MSiSvIT_brigades } = require("./MSiSvIT_brigades");

// TODO: доделать расписание для всех пар

const lessons = [
  {
    name: "IGI",
    title: "ИГИ",
    emoji: "🖥",
    labsCount: 5,
    isPriority: true,
    isBrigadeType: false,
    brigadeData: null,
    canSplit: true,
    hasSubgroupType: true,
    workType: "lab",
    scheduleOfLessons: [
      {
        time: "2025-03-03 17:15",
        type: 0,
      },
      {
        time: "2025-03-12 17:15",
        type: 3,
      },
      {
        time: "2025-03-26 17:15",
        type: 3,
      },
      {
        time: "2025-03-31 17:15",
        type: 0,
      },
      {
        time: "2025-04-09 17:15",
        type: 3,
      },
      {
        time: "2025-04-23 17:15",
        type: 3,
      },
      {
        time: "2025-04-28 17:15",
        type: 0,
      },
      {
        time: "2025-05-07 17:15",
        type: 3,
      },
      {
        time: "2025-05-21 17:15",
        type: 3,
      },
      {
        time: "2025-05-26 17:15",
        type: 0,
      },
      {
        time: "2025-06-04 17:15",
        type: 3,
      },
    ],
    scheduleOfEnd: [
      "2025-03-03 00:25",
      "2025-03-04 15:20",
      "2025-03-13 18:45",
      "2025-03-27 18:45",
      "2025-04-01 15:20",
      "2025-04-10 18:45",
      "2025-04-24 18:45",
      "2025-04-29 15:20",
      "2025-05-08 18:45",
      "2025-05-22 18:45",
      "2025-05-27 15:20",
      "2025-06-05 18:45",
    ],
  },
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
        time: "2025-03-1 21:57",
        type: 3,
      },
      {
        time: "2025-03-05 17:15",
        type: 3,
      },
      {
        time: "2025-03-10 17:15",
        type: 0,
      },
      {
        time: "2025-03-13 17:15",
        type: 1,
      },
      {
        time: "2025-03-19 17:15",
        type: 3,
      },
      {
        time: "2025-03-24 17:15",
        type: 0,
      },
      {
        time: "2025-03-27 17:15",
        type: 2,
      },
      {
        time: "2025-04-02 17:15",
        type: 3,
      },
      {
        time: "2025-04-07 17:15",
        type: 0,
      },
      {
        time: "2025-04-10 17:15",
        type: 1,
      },
      {
        time: "2025-04-16 17:15",
        type: 3,
      },
      {
        time: "2025-04-21 17:15",
        type: 0,
      },
      {
        time: "2025-04-24 17:15",
        type: 2,
      },
      {
        time: "2025-04-30 17:15",
        type: 3,
      },
      {
        time: "2025-05-05 17:15",
        type: 0,
      },
      {
        time: "2025-05-08 17:15",
        type: 1,
      },
      {
        time: "2025-05-14 17:15",
        type: 3,
      },
      {
        time: "2025-05-19 17:15",
        type: 0,
      },
      {
        time: "2025-05-22 17:15",
        type: 2,
      },
      {
        time: "2025-05-28 17:15",
        type: 3,
      },
      {
        time: "2025-06-02 17:15",
        type: 0,
      },
      {
        time: "2025-06-05 17:15",
        type: 1,
      },
    ],
    scheduleOfEnd: [
      "2025-03-06 11:55",
      "2025-03-11 13:45",
      "2025-03-14 17:10",
      "2025-03-20 11:55",
      "2025-03-25 13:45",
      "2025-03-28 17:10",
      "2025-04-03 11:55",
      "2025-04-08 13:45",
      "2025-04-11 17:10",
      "2025-04-17 11:55",
      "2025-04-22 13:45",
      "2025-04-25 17:10",
      "2025-05-01 11:55",
      "2025-05-06 13:45",
      "2025-05-09 17:10",
      "2025-05-15 11:55",
      "2025-05-20 13:45",
      "2025-05-23 17:10",
      "2025-05-29 11:55",
      "2025-06-03 13:45",
      "2025-06-06 17:10",
    ],
  },
  {
    name: "OOP",
    title: "ООП",
    emoji: "🧰",
    labsCount: 5,
    isPriority: true,
    isBrigadeType: false,
    brigadeData: null,
    canSplit: true,
    hasSubgroupType: true,
    workType: "lab",
    scheduleOfLessons: [
      {
        time: "2025-03-06 17:15",
        type: 0,
      },
      {
        time: "2025-03-12 17:15",
        type: 3,
      },
      {
        time: "2025-03-20 17:15",
        type: 0,
      },
      {
        time: "2025-03-26 17:15",
        type: 3,
      },
      {
        time: "2025-04-03 17:15",
        type: 0,
      },
      {
        time: "2025-04-09 17:15",
        type: 3,
      },
      {
        time: "2025-04-17 17:15",
        type: 0,
      },
      {
        time: "2025-04-23 17:15",
        type: 3,
      },
      {
        time: "2025-05-01 17:15",
        type: 0,
      },
      {
        time: "2025-05-07 17:15",
        type: 3,
      },
      {
        time: "2025-05-15 17:15",
        type: 0,
      },
      {
        time: "2025-05-21 17:15",
        type: 3,
      },
      {
        time: "2025-05-29 17:15",
        type: 0,
      },
      {
        time: "2025-06-04 17:15",
        type: 3,
      },
    ],
    scheduleOfEnd: [
      "2025-03-01 22:14",
      "2025-03-07 17:10",
      "2025-03-13 18:45",
      "2025-03-21 17:10",
      "2025-03-27 18:45",
      "2025-04-04 17:10",
      "2025-04-10 18:45",
      "2025-04-18 17:10",
      "2025-04-24 18:45",
      "2025-05-02 17:10",
      "2025-06-08 18:45",
      "2025-05-16 17:10",
      "2025-05-22 18:45",
      "2025-05-30 17:10",
      "2025-06-05 18:45",
    ],
  },
  {
    name: "MCHA",
    title: "МЧА",
    emoji: "👴🏻",
    labsCount: 6,
    isPriority: false,
    isBrigadeType: false,
    brigadeData: null,
    canSplit: true,
    hasSubgroupType: true,
    workType: "lab",
    scheduleOfLessons: [
      {
        time: "2025-03-1 21:57",
        type: 3,
      },
      {
        time: "2025-03-05 17:15",
        type: 3,
      },
      {
        time: "2025-03-17 17:15",
        type: 0,
      },
      {
        time: "2025-03-19 17:15",
        type: 3,
      },
      {
        time: "2025-04-02 17:15",
        type: 3,
      },
      {
        time: "2025-04-14 17:15",
        type: 0,
      },
      {
        time: "2025-04-16 17:15",
        type: 3,
      },
      {
        time: "2025-04-30 17:15",
        type: 3,
      },
      {
        time: "2025-05-12 17:15",
        type: 0,
      },
      {
        time: "2025-05-14 17:15",
        type: 3,
      },
      {
        time: "2025-05-28 17:15",
        type: 3,
      },
    ],
    scheduleOfEnd: [
      "2025-03-06 11:55",
      "2025-03-18 13:45",
      "2025-03-20 11:55",
      "2025-04-03 11:55",
      "2025-04-15 13:45",
      "2025-04-17 11:55",
      "2025-05-01 11:55",
      "2025-05-13 13:45",
      "2025-05-15 11:55",
      "2025-05-29 11:55",
    ],
  },
  {
    name: "AWS",
    title: "АВС",
    emoji: "💡",
    labsCount: 2,
    isPriority: true,
    isBrigadeType: false,
    brigadeData: null,
    canSplit: false,
    hasSubgroupType: false,
    workType: "pz",
    scheduleOfLessons: [
      {
        time: "2025-03-05 17:15",
        type: 0,
      },
      {
        time: "2025-03-19 17:15",
        type: 0,
      },
      {
        time: "2025-04-02 17:15",
        type: 0,
      },
      {
        time: "2025-04-16 17:15",
        type: 0,
      },
      {
        time: "2025-04-30 17:15",
        type: 0,
      },
      {
        time: "2025-05-14 17:15",
        type: 0,
      },
      {
        time: "2025-05-28 17:15",
        type: 0,
      },
    ],
    scheduleOfEnd: [
      "2025-03-05 13:45",
      "2025-03-20 13:45",
      "2025-04-03 13:45",
      "2025-04-17 13:45",
      "2025-05-01 13:45",
      "2025-05-15 13:45",
      "2025-05-29 13:45",
    ],
  },
  {
    name: "MPPiU",
    title: "МППиУ",
    emoji: "🛍",
    labsCount: 8,
    isPriority: true,
    isBrigadeType: true,
    brigadeData: MPPiU_brigades,
    canSplit: false,
    hasSubgroupType: false,
    workType: "pz",
    scheduleOfLessons: [
      {
        time: "2025-03-03 01:04",
        type: 0,
      },
      {
        time: "2025-03-11 17:15",
        type: 0,
      },
      {
        time: "2025-03-25 17:15",
        type: 0,
      },
      {
        time: "2025-04-08 17:15",
        type: 0,
      },
      {
        time: "2025-04-22 17:15",
        type: 0,
      },
      {
        time: "2025-05-06 17:15",
        type: 0,
      },
      {
        time: "2025-05-20 17:15",
        type: 0,
      },
      {
        time: "2025-06-03 17:15",
        type: 0,
      },
    ],
    scheduleOfEnd: [
      "2025-03-12 15:20",
      "2025-03-26 15:20",
      "2025-04-09 15:20",
      "2025-04-23 15:20",
      "2025-05-07 15:20",
      "2025-05-21 15:20",
      "2025-06-04 15:20",
    ],
  },
  {
    name: "MSiSvIT",
    title: "МСиСвИТ",
    emoji: "📝",
    labsCount: 4,
    isPriority: true,
    isBrigadeType: true,
    brigadeData: MSiSvIT_brigades,
    canSplit: false,
    hasSubgroupType: false,
    workType: "pz",
    scheduleOfLessons: [
      {
        time: "2025-03-17 17:15",
        type: 0,
      },
      {
        time: "2025-03-26 17:15",
        type: 0,
      },
      {
        time: "2025-04-14 17:15",
        type: 0,
      },
      {
        time: "2025-04-23 17:15",
        type: 0,
      },
      {
        time: "2025-05-12 17:15",
        type: 0,
      },
      {
        time: "2025-05-21 17:15",
        type: 0,
      },
    ],
    scheduleOfEnd: [
      "2025-03-18 15:20",
      "2025-03-27 15:20",
      "2025-04-15 15:20",
      "2025-04-24 15:20",
      "2025-05-13 15:20",
      "2025-05-22 15:20",
    ],
  },
];

module.exports = { lessons };
