const { createCanvas } = require('canvas');
const fs = require('fs');

const {readConfig, writeConfig} = require ('../utils/config');
const { brigades } = require('../students/brigades');
const { lessons } = require('../lessons/lessons');


function getPriorityColor(priority) {
    switch (priority) {
        case 'Красный':
            return '#FF6347'; // Красный
        case 'Жёлтый':
            return '#FFD700'; // Жёлтый
        case 'Зелёный':
            return '#32CD32'; // Зелёный
        case 'Санкции':
            return '#8A2BE2'; // Фиолетовый
        default:
            return '#FFFFFF'; // Белый по умолчанию
    }
}

async function generateQueueTable(data, subject, isPriority = false) {
    let isBZCH = subject === 'BZCH';
    let subjectName = lessons.get(subject);
    let tableText = isPriority ? `Таблица приоритетов на ${subjectName}` : `Очередь ${subjectName}`;
    let secondColumn;
    if (isPriority) {
        secondColumn = "Приоритет";
    } else {
        secondColumn = isBZCH ? 'ПЗ' : 'Лаба';
    }
    const options = {
        tableName: subject,
        tableText: tableText,
        width: isBZCH ? 620 : 420,
        surnameWidth: isBZCH ? 400 : 200,
        firstColumn: isBZCH ? 'Члены Бригады' : 'Фамилия',
        secondColumn: secondColumn
    }
    await createTableImage(data, options, isPriority);
}
async function createTableImage(data, options, isPriority) {
    const width = options.width;  
    const height = 50 + (data.length + 1) * 40 + 20; 
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText(options.tableText, 10, 30);

    const colWidthSurname = options.surnameWidth;
    const colWidthLabs = 150;
    const rowHeight = 40;

    let startX = 30;
    let startY = 50;

    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText(options.firstColumn, startX + colWidthSurname / 2 - 30, startY + 25);
    ctx.fillText(options.secondColumn, startX + colWidthSurname + colWidthLabs / 2 - 40, startY + 25);
    config = await readConfig();

    data.forEach((item, i) => {
        startY += rowHeight;

        if ((options.tableName == "KProg" && config.isKProgEnd) || (options.tableName == "BZCH" && config.isBZCHEnd) || isPriority) {
            const priorityColor = getPriorityColor(item.priority);
            ctx.fillStyle = priorityColor;
            ctx.fillRect(startX, startY, colWidthSurname + colWidthLabs, rowHeight);
        }

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(startX, startY, colWidthSurname, rowHeight);
        ctx.strokeRect(startX + colWidthSurname, startY, colWidthLabs, rowHeight); 

        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        let name;
        if (options.tableName == 'BZCH') {
            name = brigades[item.brigade_id-1]
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

    const buffer = canvas.toBuffer('image/png');
    let tableType;
    if (isPriority) {
        tableType = 'PriorityTable';
    } else {
        tableType = 'Table';
    }
    fs.writeFileSync(`./src/tables/${options.tableName}${tableType}.png`, buffer);

    return `./src/tables/${options.tableName}${tableType}.png`;
}

module.exports = { generateQueueTable  };
