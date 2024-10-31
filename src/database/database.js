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

    con.query(qry, data, function (err, result) {
        if (err) throw err;
        console.log(result);
    });
}

function isRegistered(id) {
  return new Promise((resolve, reject) => {
      let query = `SELECT tg_id FROM Users`;

      con.query(query, function (err, result) {
          if (err) return reject(err);

          let tgIds = result.map(row => row.tg_id);
          resolve(tgIds.includes(id.toString()));
      });
  });
}

function getInfoById(id) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM Users WHERE tg_id = ?`;

        con.query(query, [id], function (err, result) {
            if (err) return reject(err); // Если произошла ошибка, возвращаем её через reject

            if (result.length > 0) {
                resolve(result[0]);
            } else {
                resolve(null); 
            }
        });
    });
}

function getAllUsers() {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM Users`;

        con.query(query, function (err, result) {
            if (err) return reject(err);

            if (result.length > 0) {
                resolve(result);
            } else {
                resolve(null); 
            }
        })
    })
}

function getQueue(lesson) {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM ${lesson}`;

        con.query(query, function (err, result) {
            if (err) return reject(err);

            if (result.length > 0) {
                resolve(result);
            } else {
                resolve(null); 
            }
        })
    })
}



async function isInUsers(surname) {
    return new Promise((resolve, reject) => {
        let query = `SELECT surname FROM Users`;

        con.query(query, function(err, result) {
            if (err) return reject(err);
  
            let surnames = result.map(row => row.surname);
            resolve(surnames.includes(surname));
        })
    });
}

async function insertIntoQueue(queue, lesson) {
    try {
        await con.query(`TRUNCATE TABLE ${lesson}`);

        let insertQuery;
        let values;

        if (lesson === 'KProg') {
            insertQuery = 'INSERT INTO KProg (tg_id, surname, labs, priority, subgroup) VALUES ?';
            values = queue.map(item => [item.tg_id, item.surname, item.labs, item.priority, item.subgroup]);
        } else {
            insertQuery = `INSERT INTO ${lesson} (tg_id, surname, labs, subgroup) VALUES ?`;
            values = queue.map(item => [item.tg_id, item.surname, item.labs, item.subgroup]);
        } 

        await con.query(insertQuery, [values]);
        console.log(`Таблица ${lesson} была успешно перезаписана.`);
    } catch (err) {
        console.error(`Ошибка при перезаписи таблицы ${lesson}:`, err);
    }
}



async function setPriority(id, priority) {
    try {
        const updateQuery = 'UPDATE Users SET priority = ? WHERE tg_id = ?';
        await con.query(updateQuery, [priority, id]);
        
        if (config.isKProgEnd) {
            const updateKProgQuery = 'UPDATE KProg SET priority = ? WHERE tg_id = ?';
            await con.query(updateKProgQuery, [priority, id]);
        }
        console.log(`Priority для пользователя с id ${id} обновлён на ${priority}`);
    } catch (err) {
        console.error('Ошибка при обновлении priority:', err);
    }
}

async function setPriorityBySurname(surname, priority) {
    try {
        // Запрос на обновление значения priority для записи с указанным tg_id
        const updateQuery = 'UPDATE Users SET priority = ? WHERE surname = ?';
        await con.query(updateQuery, [priority, surname]);
        
        if (config.isKProgEnd) {
            const updateKProgQuery = 'UPDATE KProg SET priority = ? WHERE surname = ?';
            await con.query(updateKProgQuery, [priority, surname]);
        }

        console.log(`Priority для пользователя с id ${surname} обновлён на ${priority}`);
    } catch (err) {
        console.error('Ошибка при обновлении priority:', err);
    }
}

async function clearTable(lesson) {
    try {
        await con.query(`TRUNCATE TABLE ${lesson}`);
        console.log(`Таблица ${lesson} очищена`);
    } catch (err) {
        console.error(`Ошибка при очистке ${lesson}:`, err);
    }
}


module.exports = { insertIntoDatabase, isRegistered, getInfoById, getAllUsers, insertIntoQueue, getQueue, setPriority, isInUsers, setPriorityBySurname, clearTable }