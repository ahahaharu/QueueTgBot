const { createCanvas } = require('canvas');
const fs = require('fs');

async function generatePriorityTable(data) {
    const width = 420;  // Ширина холста
    const height = 50 + (data.length+1) * 40 + 20; // Высота холста зависит от количества строк
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
    const colWidthPriority = 150;
    const rowHeight = 40;

    // Начальные координаты для рисования таблицы
    let startX = 30;
    let startY = 50;

    // Рисуем заголовки колонок
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000000';
    ctx.fillText('Фамилия', startX + colWidthSurname / 2 - 30, startY + 25);
    ctx.fillText('Приоритет', startX + colWidthSurname + colWidthPriority / 2 - 40, startY + 25);

    // Рисуем данные
    data.forEach((item, i) => {
        startY += rowHeight;

        // Задаем цвет строки в зависимости от приоритета
        let priorityColor;
        switch (item.priority) {
            case 'Красный':
                priorityColor = '#FF6347'; // Красный
                break;
            case 'Жёлтый':
                priorityColor = '#FFD700'; // Жёлтый
                break;
            case 'Зелёный':
                priorityColor = '#32CD32'; // Зелёный
                break;
            case 'Санкции':
                priorityColor = '#8A2BE2'; // Фиолетовый
                break;
            default:
                priorityColor = '#FFFFFF'; // Белый по умолчанию
        }

        // Цвет фона строки
        ctx.fillStyle = priorityColor;
        ctx.fillRect(startX, startY, colWidthSurname + colWidthPriority, rowHeight);

        // Рисуем границы ячеек
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(startX, startY, colWidthSurname, rowHeight); // Граница для фамилии
        ctx.strokeRect(startX + colWidthSurname, startY, colWidthPriority, rowHeight); // Граница для приоритета

        // Вписываем текст в ячейки
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.fillText(item.surname, startX + 10, startY + 25);
        ctx.fillText(item.priority, startX + colWidthSurname + 10, startY + 25);
    });

    // Сохранение изображения
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync('./priorityTable.png', buffer);

    return './priorityTable.png'; // Путь к файлу
}

module.exports = { generatePriorityTable };
