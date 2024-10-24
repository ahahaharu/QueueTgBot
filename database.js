const con = require('./dbConnect');
const { students } = require('./students');

function insertIntoDatabase(name, tg_id) {
    let data = [students.get(name).name, name, tg_id, students.get(name).subgroup, "Зелёный"];
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

module.exports = { insertIntoDatabase, isRegistered, getInfoById, getAllUsers }