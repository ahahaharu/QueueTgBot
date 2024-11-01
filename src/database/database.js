const con = require('./dbConnect');
const { students } = require('../students/students');
const config = require('../../config.json');

async function insertIntoDatabase(name, surname, username, tg_id) {
    let subgroup;
    if (students.has(username)) {
        subgroup = students.get(username).subgroup;
    } else {
        subgroup = students.get(tg_id).subgroup;
    }

    let data = [name, surname, tg_id, subgroup, "Зелёный"];
    let qry = `INSERT INTO Users (name, surname, tg_id, subgroup, priority) VALUES (?,?,?,?,?);`;

    try {
        const [result] = await con.promise().query(qry, data);
        console.log(result);
    } catch (err) {
        console.error('Ошибка при вставке в базу данных:', err);
    }
}

async function isRegistered(id) {
    let query = `SELECT tg_id FROM Users`;

    try {
        const [result] = await con.promise().query(query);
        let tgIds = result.map(row => row.tg_id);
        return tgIds.includes(id.toString());
    } catch (err) {
        throw err;
    }
}

async function getInfoById(id) {
    let query = `SELECT * FROM Users WHERE tg_id = ?`;

    try {
        const [result] = await con.promise().query(query, [id]);
        return result.length > 0 ? result[0] : null;
    } catch (err) {
        throw err;
    }
}

async function getAllUsers() {
    let query = `SELECT * FROM Users`;

    try {
        const [result] = await con.promise().query(query);
        return result.length > 0 ? result : null;
    } catch (err) {
        throw err;
    }
}

async function getQueue(lesson) {
    let query = `SELECT * FROM ${lesson}`;

    try {
        const [result] = await con.promise().query(query);
        return result.length > 0 ? result : null;
    } catch (err) {
        throw err;
    }
}

async function isInUsers(surname) {
    let query = `SELECT surname FROM Users`;

    try {
        const [result] = await con.promise().query(query);
        let surnames = result.map(row => row.surname);
        return surnames.includes(surname);
    } catch (err) {
        throw err;
    }
}

async function insertIntoQueue(queue, lesson) {
    try {
        await con.promise().query(`TRUNCATE TABLE ${lesson}`);

        let insertQuery;
        let values;

        if (lesson === 'KProg') {
            insertQuery = 'INSERT INTO KProg (tg_id, surname, labs, priority, subgroup) VALUES ?';
            values = queue.map(item => [item.tg_id, item.surname, item.labs, item.priority, item.subgroup]);
        } else {
            insertQuery = `INSERT INTO ${lesson} (tg_id, surname, labs, subgroup) VALUES ?`;
            values = queue.map(item => [item.tg_id, item.surname, item.labs, item.subgroup]);
        }

        await con.promise().query(insertQuery, [values]);
        console.log(`Таблица ${lesson} была успешно перезаписана.`);
    } catch (err) {
        console.error(`Ошибка при перезаписи таблицы ${lesson}:`, err);
    }
}

async function setPriority(id, priority) {
    try {
        const updateQuery = 'UPDATE Users SET priority = ? WHERE tg_id = ?';
        await con.promise().query(updateQuery, [priority, id]);

        if (config.isKProgEnd) {
            const updateKProgQuery = 'UPDATE KProg SET priority = ? WHERE tg_id = ?';
            await con.promise().query(updateKProgQuery, [priority, id]);
        }
        console.log(`Priority для пользователя с id ${id} обновлён на ${priority}`);
    } catch (err) {
        console.error('Ошибка при обновлении priority:', err);
    }
}

async function setPriorityBySurname(surname, priority) {
    try {
        const updateQuery = 'UPDATE Users SET priority = ? WHERE surname = ?';
        await con.promise().query(updateQuery, [priority, surname]);

        if (config.isKProgEnd) {
            const updateKProgQuery = 'UPDATE KProg SET priority = ? WHERE surname = ?';
            await con.promise().query(updateKProgQuery, [priority, surname]);
        }

        console.log(`Priority для пользователя с фамилией ${surname} обновлён на ${priority}`);
    } catch (err) {
        console.error('Ошибка при обновлении priority:', err);
    }
}

async function clearTable(lesson) {
    try {
        await con.promise().query(`TRUNCATE TABLE ${lesson}`);
        console.log(`Таблица ${lesson} очищена`);
    } catch (err) {
        console.error(`Ошибка при очистке ${lesson}:`, err);
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
