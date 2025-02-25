const fs = require("fs");
const path = require("path");
const { lessons } = require("../../data/lessons");
const configPath = path.join(__dirname, "../../config.json");

const readConfig = async () => {
  const configData = await fs.promises.readFile(configPath, "utf-8");
  return JSON.parse(configData);
};

const writeConfig = async (config) => {
  await fs.promises.writeFile(configPath, JSON.stringify(config, null, 4));
};

async function returnConfigs() {
  const config = await readConfig();
  const configs = new Map();

  lessons.forEach((lesson) => {
    configs.set(lesson.name, {
      lessonType: config[`${lesson.name}LessonType`],
      date: config[`${lesson.name}Date`],
      canSplit: lesson.canSplit ? config[`is${lesson.name}CanSplit`] : null,
      isEnd: lesson.isPriority ? config[`is${lesson.name}End`] : null,
    });
  });
  return configs;
}
module.exports = { readConfig, writeConfig, returnConfigs };
