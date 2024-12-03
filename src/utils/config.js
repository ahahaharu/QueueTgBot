const fs = require('fs');
const path = require('path');
const configPath = path.join(__dirname, '../../config.json');


const readConfig = async () => {
    const configData = await fs.promises.readFile(configPath, 'utf-8');
    return JSON.parse(configData);
};

// Функция для записи конфигурации
const writeConfig = async (config) => {
    await fs.promises.writeFile(configPath, JSON.stringify(config, null, 4));
};

async function returnConfigs() {
    const config = await readConfig();
    const configs = new Map();
    configs.set("KProg", {
        lessonType: config.KProgLessonType,
        date: config.KProgDate
    });
    configs.set("ISP", {
        lessonType: config.ISPLessonType,
        date: config.ISPDate
    });
    configs.set("PZMA", {
        lessonType: config.PZMALessonType,
        date: config.PZMADate
    });
    configs.set("MCHA", {
        lessonType: config.MCHALessonType,
        date: config.MCHADate
    });
    configs.set("BZCH", {
        lessonType: "",
        date: config.BZCHDate
    });
    return configs;
}
module.exports = { readConfig, writeConfig, returnConfigs }