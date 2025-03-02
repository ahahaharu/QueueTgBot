const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../queues.json");

function loadQueues() {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Ошибка при чтении или парсинге файла:", err);
    return {};
  }
}

function saveQueues(queues) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(queues, null, 2), "utf8");
    console.log("Файл с очередями успешно сохранён!");
  } catch (err) {
    console.error("Ошибка при записи файла:", err);
  }
}

function updateQueue(queueId, queueData) {
  const queues = loadQueues();

  queues[queueId] = queueData;

  saveQueues(queues);
}

module.exports = { loadQueues, updateQueue };
