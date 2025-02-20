const fs = require("fs");
const path = require("path");

const { lessons } = require("../../data/lessons");

const configPath = path.join(__dirname, "../../config.json");

const getCurrentDate = () => {
  const now = new Date();
  return `${now.getDate()}\\.${now.getMonth() + 1}`;
};

function createConfig() {
  let config = {};

  if (fs.existsSync(configPath)) {
    const rawData = fs.readFileSync(configPath, "utf-8");
    config = JSON.parse(rawData);
  }

  lessons.forEach((lesson) => {
    const name = lesson.name;

    if (!config.hasOwnProperty(`${name}LessonType`)) {
      config[`${name}LessonType`] = 0;
    }

    if (!config.hasOwnProperty(`${name}Date`)) {
      config[`${name}Date`] = getCurrentDate();
    }

    if (lesson.isPriority && !config.hasOwnProperty(`is${name}End`)) {
      config[`is${name}End`] = false;
    }
  });

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}

module.exports = {
  createConfig,
};
