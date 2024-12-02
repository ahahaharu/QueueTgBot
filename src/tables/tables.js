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

async function generatePriorityTable(data) {
    const width = 420;  
    const height = 50 + (data.length + 1) * 40 + 20; 
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Фон холста
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Заголовок таблицы
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText('Таблица приоритетов', 10, 30);

    // Настройки таблицы
    const colWidthSurname = 200;
    const colWidthLabs = 150;
    const rowHeight = 40;

    let startX = 30;
    let startY = 50;

    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('Фамилия', startX + colWidthSurname / 2 - 30, startY + 25);
    ctx.fillText('Приоритет', startX + colWidthSurname + colWidthLabs / 2 - 40, startY + 25);

    data.forEach((item, i) => {
        startY += rowHeight;

        // Получаем цвет приоритета
        const priorityColor = getPriorityColor(item.priority);

        // Цвет фона строки
        ctx.fillStyle = priorityColor;
        ctx.fillRect(startX, startY, colWidthSurname + colWidthLabs, rowHeight);

        // Рисуем границы ячеек
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(startX, startY, colWidthSurname, rowHeight);
        ctx.strokeRect(startX + colWidthSurname, startY, colWidthLabs, rowHeight);

        // Вписываем текст в ячейки
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.fillText(item.surname, startX + 10, startY + 25);
        ctx.fillText(item.priority, startX + colWidthSurname + 10, startY + 25);
    });

    // Сохранение изображения с динамическим путём
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./src/tables/priorityTable.png`, buffer);

    return `./src/tables/priorityTable.png`;
}

async function generateBZCHPriorityTable(data) {
    const width = 620;  
    const height = 50 + (data.length + 1) * 40 + 20; 
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Фон холста
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Заголовок таблицы
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText('Таблица приоритетов', 10, 30);

    // Настройки таблицы
    const colWidthSurname = 400;
    const colWidthLabs = 150;
    const rowHeight = 40;

    let startX = 30;
    let startY = 50;

    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('Члены бригады', startX + colWidthSurname / 2 - 30, startY + 25);
    ctx.fillText('Приоритет', startX + colWidthSurname + colWidthLabs / 2 - 40, startY + 25);

    data.forEach((item, i) => {
        startY += rowHeight;

        const priorityColor = getPriorityColor(item.priority);

        ctx.fillStyle = priorityColor;
        ctx.fillRect(startX, startY, colWidthSurname + colWidthLabs, rowHeight);

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(startX, startY, colWidthSurname, rowHeight);
        ctx.strokeRect(startX + colWidthSurname, startY, colWidthLabs, rowHeight);

        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.fillText(item.surnames, startX + 10, startY + 25);
        ctx.fillText(item.priority, startX + colWidthSurname + 10, startY + 25);
    });

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./src/tables/BZCHpriorityTable.png`, buffer);

    return `./src/tables/BZCHpriorityTable.png`;
}

async function generateQueueTable(data, tableName) {
    const width = 420;  
    const height = 50 + (data.length + 1) * 40 + 20; 
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText(`Очередь ${lessons.get(tableName)}`, 10, 30);

    const colWidthSurname = 200;
    const colWidthLabs = 150;
    const rowHeight = 40;

    let startX = 30;
    let startY = 50;

    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('Фамилия', startX + colWidthSurname / 2 - 30, startY + 25);
    ctx.fillText('Лаба', startX + colWidthSurname + colWidthLabs / 2 - 40, startY + 25);
    config = await readConfig();

    data.forEach((item, i) => {
        startY += rowHeight;

        if (tableName == "KProg" && config.isKProgEnd) {
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
        ctx.fillText(item.surname, startX + 10, startY + 25);
        ctx.fillText(item.labs, startX + colWidthSurname + 10, startY + 25);
    });

    // Сохранение изображения с динамическим путём
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./src/tables/${tableName}Table.png`, buffer);

    return `./src/tables/${tableName}Table.png`;
}

async function generateBZCHTable(data) {
    const width = 620;  
    const height = 50 + (data.length + 1) * 40 + 20; 
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText(`Очередь БЖЧ`, 10, 30);

    const colWidthSurname = 400;
    const colWidthLabs = 150;
    const rowHeight = 40;

    let startX = 30;
    let startY = 50;

    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('Члены Бригады', startX + colWidthSurname / 2 - 30, startY + 25);
    ctx.fillText('ПЗ', startX + colWidthSurname + colWidthLabs / 2 - 40, startY + 25);
    config = await readConfig();

    data.forEach((item, i) => {
        startY += rowHeight;

        if (config.isBZCHEnd) {
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
        
        ctx.fillText(brigades[item.brigade_id-1], startX + 10, startY + 25);
        ctx.fillText(item.labs, startX + colWidthSurname + 10, startY + 25);
    });

    // Сохранение изображения с динамическим путём
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./src/tables/BZCHTable.png`, buffer);

    return `./src/tables/BZCHTable.png`;
}

module.exports = { generatePriorityTable, generateQueueTable, generateBZCHTable, generateBZCHPriorityTable };
