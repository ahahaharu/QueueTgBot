const pool = require('./dbConnect'); // Подключение пула соединений
const { students } = require('../students/students');
const {readConfig, writeConfig} = require ('../utils/config')

// Вставка нового пользователя в базу данных
async function insertIntoDatabase(name, surname, username, tg_id) {
    const subgroup = students.get(username)?.subgroup || students.get(tg_id)?.subgroup || null;
    const data = [name, surname, tg_id, subgroup, "Зелёный"];
    const qry = `INSERT INTO Users (name, surname, tg_id, subgroup, priority) VALUES (?, ?, ?, ?, ?)`;

    try {
        const [result] = await pool.promise().query(qry, data);
        console.log('Пользователь добавлен:', result);
    } catch (err) {
        console.error('Ошибка при вставке в базу данных:', err);
    }
}

// Проверка регистрации пользователя по tg_id
async function isRegistered(id) {
    const query = `SELECT tg_id FROM Users`;
    try {
        const [result] = await pool.promise().query(query);
        const tgIds = result.map(row => row.tg_id);
        return tgIds.includes(id.toString());
    } catch (err) {
        console.error('Ошибка при проверке регистрации:', err);
        throw err;
    }
}

// Получение информации о пользователе по tg_id
async function getInfoById(id) {
    const query = `SELECT * FROM Users WHERE tg_id = ?`;
    try {
        const [result] = await pool.promise().query(query, [id]);
        return result.length > 0 ? result[0] : null;
    } catch (err) {
        console.error('Ошибка при получении информации о пользователе:', err);
        throw err;
    }
}

// Получение информации обо всех пользователях
async function getAllUsers() {
    const query = `SELECT * FROM Users`;
    try {
        const [result] = await pool.promise().query(query);
        return result.length > 0 ? result : null;
    } catch (err) {
        console.error('Ошибка при получении списка пользователей:', err);
        throw err;
    }
}

// Получение очереди для определённого предмета
async function getQueue(lesson) {
    const query = `SELECT * FROM ${lesson}`;
    try {
        const [result] = await pool.promise().query(query);
        return result.length > 0 ? result : null;
    } catch (err) {
        console.error(`Ошибка при получении очереди для ${lesson}:`, err);
        throw err;
    }
}

// Проверка наличия фамилии в таблице пользователей
async function isInUsers(surname) {
    const query = `SELECT surname FROM Users`;
    try {
        const [result] = await pool.promise().query(query);
        const surnames = result.map(row => row.surname);
        return surnames.includes(surname);
    } catch (err) {
        console.error('Ошибка при проверке фамилии в таблице пользователей:', err);
        throw err;
    }
}

// Вставка очереди пользователей в таблицу предмета
async function insertIntoQueue(queue, lesson) {
    try {
        await pool.promise().query(`TRUNCATE TABLE ${lesson}`);
        let insertQuery;
        let values;

        if (lesson === 'KProg') {
            insertQuery = 'INSERT INTO KProg (tg_id, surname, labs, priority, subgroup) VALUES ?';
            values = queue.map(item => [item.tg_id, item.surname, item.labs, item.priority, item.subgroup]);
        } else {
            insertQuery = `INSERT INTO ${lesson} (tg_id, surname, labs, subgroup) VALUES ?`;
            values = queue.map(item => [item.tg_id, item.surname, item.labs, item.subgroup]);
        }

        await pool.promise().query(insertQuery, [values]);
        console.log(`Таблица ${lesson} успешно перезаписана.`);
    } catch (err) {
        console.error(`Ошибка при перезаписи таблицы ${lesson}:`, err);
    }
}

// Установка приоритета пользователя по tg_id
async function setPriority(id, priority) {
    try {
        const updateQuery = 'UPDATE Users SET priority = ? WHERE tg_id = ?';
        await pool.promise().query(updateQuery, [priority, id]);
        config = await readConfig();

        if (config.isKProgEnd) {
            const updateKProgQuery = 'UPDATE KProg SET priority = ? WHERE tg_id = ?';
            await pool.promise().query(updateKProgQuery, [priority, id]);
        }
        console.log(`Priority для пользователя с id ${id} обновлён на ${priority}`);
    } catch (err) {
        console.error('Ошибка при обновлении приоритета:', err);
    }
}

// Установка приоритета пользователя по фамилии
async function setPriorityBySurname(surname, priority) {
    try {
        const updateQuery = 'UPDATE Users SET priority = ? WHERE surname = ?';
        await pool.promise().query(updateQuery, [priority, surname]);
        config = await readConfig();

        if (config.isKProgEnd) {
            const updateKProgQuery = 'UPDATE KProg SET priority = ? WHERE surname = ?';
            await pool.promise().query(updateKProgQuery, [priority, surname]);
        }

        console.log(`Priority для пользователя с фамилией ${surname} обновлён на ${priority}`);
    } catch (err) {
        console.error('Ошибка при обновлении приоритета по фамилии:', err);
    }
}

// Очистка таблицы
async function clearTable(lesson) {
    try {
        await pool.promise().query(`TRUNCATE TABLE ${lesson}`);
        console.log(`Таблица ${lesson} очищена`);
    } catch (err) {
        console.error(`Ошибка при очистке таблицы ${lesson}:`, err);
    }
}

module.exports = { 
    insertIntoDatabase, 
    isRegistered, 
    getInfoById, 
    getAllUsers, 
    insertIntoQueue, 
    getQueue, 
    setPriority, 
    isInUsers, 
    setPriorityBySurname, 
    clearTable 
};
