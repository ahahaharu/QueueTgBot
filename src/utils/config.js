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

module.exports = { readConfig, writeConfig }