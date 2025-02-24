const { createCanvas } = require("canvas");
const fs = require("fs");

const { readConfig, writeConfig } = require("../utils/config");
const { brigades } = require("../students/brigades");
const { lessons } = require("../../data/lessons");

function getPriorityColor(priority) {
  switch (priority) {
    case "Красный":
      return "#FF6347"; // Красный
    case "Жёлтый":
      return "#FFD700"; // Жёлтый
    case "Зелёный":
      return "#32CD32"; // Зелёный
    case "Санкции":
      return "#8A2BE2"; // Фиолетовый
    default:
      return "#FFFFFF"; // Белый по умолчанию
  }
}

// TODO: сделать корректное отображение приоритетов

async function generateQueueTable(data, lesson, splitNum, isPriority) {
  let isBrigadeType = lesson.isBrigadeType;
  let subjectName = lesson.title;
  let tableText = isPriority
    ? `Таблица приоритетов на ${subjectName}`
    : `Очередь ${subjectName}`;
  let secondColumn;
  if (isPriority) {
    secondColumn = "Приоритет";
  } else {
    secondColumn = lesson.workType === "pz" ? "ПЗ" : "Лаба";
  }
  const options = {
    tableName: subjectName,
    tableText: tableText,
    width: isBrigadeType ? 620 : 420,
    surnameWidth: isBrigadeType ? 400 : 200,
    firstColumn: isBrigadeType ? "Члены Бригады" : "Фамилия",
    secondColumn: secondColumn,
  };
  await createTableImage(data, options, isPriority, lesson, splitNum);
}
async function createTableImage(data, options, isPriority, lesson, splitNum) {
  const width = options.width;
  const height = 50 + (data.length + 1) * 40 + 20;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#000000";
  ctx.font = "20px Arial";
  ctx.fillText(options.tableText, 10, 30);

  const colWidthSurname = options.surnameWidth;
  const colWidthLabs = 150;
  const rowHeight = 40;

  let startX = 30;
  let startY = 50;

  ctx.font = "16px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText(
    options.firstColumn,
    startX + colWidthSurname / 2 - 30,
    startY + 25
  );
  ctx.fillText(
    options.secondColumn,
    startX + colWidthSurname + colWidthLabs / 2 - 40,
    startY + 25
  );
  config = await readConfig();

  data.forEach((item, i) => {
    startY += rowHeight;

    // if (isPriority) {
    //   const priorityColor = getPriorityColor(item.priority);
    //   ctx.fillStyle = priorityColor;
    //   ctx.fillRect(startX, startY, colWidthSurname + colWidthLabs, rowHeight);
    // }

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(startX, startY, colWidthSurname, rowHeight);
    ctx.strokeRect(startX + colWidthSurname, startY, colWidthLabs, rowHeight);

    ctx.fillStyle = "#000000";
    ctx.font = "14px Arial";
    let name;
    if (lesson.isBrigadeType) {
      const brigade = lesson.brigadeData.find(
        (br) => br.brigadeNum === item.brigade_num
      );
      name = brigade.members.join(", ");
    } else {
      name = item.surname;
    }
    ctx.fillText(name, startX + 10, startY + 25);

    let secondColumnItem;
    if (isPriority) {
      secondColumnItem = item.priority;
    } else {
      secondColumnItem = item.labs;
    }
    ctx.fillText(secondColumnItem, startX + colWidthSurname + 10, startY + 25);
  });

  const buffer = canvas.toBuffer("image/png");
  let tableType;
  if (isPriority) {
    tableType = "PriorityTable";
  } else if (splitNum) {
    tableType = "Table" + splitNum;
  } else {
    tableType = "Table";
  }
  fs.writeFileSync(`./src/tables/${lesson.name}${tableType}.png`, buffer);

  return `./src/tables/${lesson.name}${tableType}.png`;
}

module.exports = { generateQueueTable };
