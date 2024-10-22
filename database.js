const con = require('./dbConnect');
const { students } = require('./students');

function insertIntoDatabase(name, tg_id) {
    let data = [name, students.get(name).name, tg_id, students.get(name).subgroup, "none"];
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

module.exports = { insertIntoDatabase, isRegistered }