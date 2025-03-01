const pool = require("./dbConnect"); // Подключение пула соединений
const { students } = require("../../data/students");
const { readConfig, writeConfig } = require("../utils/config");
const { lessons } = require("../../data/lessons");

async function createUsersTable() {
  try {
    await pool.promise().query(`
        CREATE TABLE IF NOT EXISTS Users (
          tg_id VARCHAR(20),
          name VARCHAR(255),
          surname VARCHAR(255),
          subgroup INT
        );
      `);
    console.log("Таблица Users успешно создана или уже существует.");
  } catch (err) {
    console.error("Ошибка при создании таблицы Users:", err);
  }
}

async function createQueueTable(lesson) {
  try {
    let qr;
    if (lesson.isBrigadeType) {
      qr = `
        CREATE TABLE IF NOT EXISTS ${lesson.name} (
          brigade_num INT,
          labs VARCHAR(20),
          
      `;
      if (lesson.isPriority) {
        qr += `isPriorityGiven BOOLEAN
        );`;
      }
    } else {
      qr = `
        CREATE TABLE IF NOT EXISTS ${lesson.name} (
          tg_id VARCHAR(20),
          surname VARCHAR(255),
          labs VARCHAR(20),
          subgroup INT
        );
      `;
    }
    await pool.promise().query(qr);
    console.log(`Таблица ${lesson.name} успешно создана или уже существует.`);
  } catch (err) {
    console.error(`Ошибка при создании таблицы ${lesson.name}:`, err);
  }
}

async function createPriorityForBrigades(lesson) {
  let qr = `CREATE TABLE IF NOT EXISTS ${lesson.name}_priorities (
    brigade_num INT,
    members VARCHAR(255),
    priority VARCHAR(20));
  `;
  try {
    await pool.promise().query(qr);
    console.log(
      `Таблица ${lesson.name}_priorities успешно создана или уже существует.`
    );
  } catch (err) {
    console.error(`Ошибка при создании таблицы priorities:`, err);
  }
}

async function createPrioritiesTable() {
  let qr = `CREATE TABLE IF NOT EXISTS priorities (
    tg_id VARCHAR(20),
    surname VARCHAR(255)
  `;
  for (let lesson of lessons) {
    if (lesson.isPriority) {
      if (lesson.isBrigadeType) {
        await createPriorityForBrigades(lesson);
        continue;
      }
      qr += `,\n ${lesson.name}_priority VARCHAR(20)`;
    }
  }

  qr += ");";
  try {
    await pool.promise().query(qr);
    console.log(`Таблица priorities успешно создана или уже существует.`);
  } catch (err) {
    console.error(`Ошибка при создании таблицы priorities:`, err);
  }
}

async function getBrigades(subject) {
  const query = `SELECT * FROM ${subject}_brigades`;
  try {
    const [result] = await pool.promise().query(query);
    return result.length > 0 ? result : null;
  } catch (err) {
    console.error("Ошибка при получении списка пользователей:", err);
    throw err;
  }
}

async function createBrigadeTables(lesson) {
  let qr = `CREATE TABLE IF NOT EXISTS ${lesson.name}_brigades (
    tg_id VARCHAR(20),
    brigade_num INT
  );
        `;
  try {
    await pool.promise().query(qr);
    console.log(
      `Таблица ${lesson.name}_brigades успешно создана или уже существует.`
    );
  } catch (err) {
    console.error(`Ошибка при создании таблицы ${lesson.name}_brigades:`, err);
  }
}

async function insertIntoBrigadePriority(tg_id, lesson) {
  const brigades = await getBrigades(lesson.name);
  const brigade_num = brigades.find((line) => line.tg_id == tg_id).brigade_num;
  const brigadeTable = await getQueue(lesson.name + "_priorities");
  let index;
  if (brigadeTable) {
    index = brigadeTable.findIndex((br) => br.brigade_num === brigade_num);
  } else {
    index = -1;
  }

  if (index != -1) {
    console.log(`Бригада c brigade_num = ${brigade_num} уже существует`);
    return;
  } else {
    const brigade = lesson.brigadeData;
    console.log(brigade.find((br) => br.brigadeNum === brigade_num));

    const data = [
      brigade_num,
      brigade.find((br) => br.brigadeNum === brigade_num).members.join(", "),
      "Зелёный",
    ];
    const qry = `INSERT INTO ${lesson.name}_priorities (brigade_num, members, priority) VALUES (?, ?, ?)`;
    try {
      const [result] = await pool.promise().query(qry, data);
      console.log(
        "Пользователь добавлен в таблицу приоритетов для бригады:",
        result
      );
    } catch (err) {
      console.error("Ошибка при вставке в базу данных:", err);
    }
  }
}

async function insertIntoPriority(tg_id, surname) {
  const data = [tg_id, surname];
  const qry = `INSERT INTO priorities (tg_id, surname) VALUES (?, ?)`;

  try {
    const [result] = await pool.promise().query(qry, data);
    console.log("Пользователь добавлен в таблицу приоритетов:", result);
  } catch (err) {
    console.error("Ошибка при вставке в базу данных:", err);
  }

  for (const ls of lessons) {
    try {
      if (ls.isPriority) {
        if (ls.isBrigadeType) {
          await insertIntoBrigadePriority(tg_id, ls);
        } else {
          const prQry = `UPDATE priorities SET ${ls.name}_priority = ? WHERE tg_id = ?`;
          const [result] = await pool
            .promise()
            .query(prQry, ["Зелёный", tg_id]);
          console.log("Приоритеты поставлены:", result);
        }
      }
    } catch (err) {
      console.error("Ошибка при обновлении приоритета:", err);
    }
  }
}

//  Вставка нового пользователя в базу данных
async function insertIntoDatabase(name, surname, username, tg_id) {
  const subgroup =
    students.get(username)?.subgroup || students.get(tg_id)?.subgroup || null;
  const data = [tg_id, name, surname, subgroup];
  const qry = `INSERT INTO Users (tg_id, name, surname, subgroup) VALUES (?, ?, ?, ?)`;

  try {
    const [result] = await pool.promise().query(qry, data);
    console.log("Пользователь добавлен:", result);
  } catch (err) {
    console.error("Ошибка при вставке в базу данных:", err);
  }
}

async function insertIntoBrigade(subjectName, tg_id, brigade_num) {
  const data = [tg_id, brigade_num];
  const qry = `INSERT INTO ${subjectName}_brigades (tg_id, brigade_num) VALUES (?, ?)`;

  try {
    const [result] = await pool.promise().query(qry, data);
    console.log("Пользователь добавлен в таблицу бригад:", result);
  } catch (err) {
    console.error("Ошибка при вставке в базу данных:", err);
  }
}

// Проверка регистрации пользователя по tg_id
async function isRegistered(id) {
  const query = `SELECT tg_id FROM Users`;
  try {
    const [result] = await pool.promise().query(query);
    const tgIds = result.map((row) => row.tg_id);
    return tgIds.includes(id.toString());
  } catch (err) {
    console.error("Ошибка при проверке регистрации:", err);
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
    console.error("Ошибка при получении информации о пользователе:", err);
    throw err;
  }
}

// async function getBZCHStatus(id) {
//   const query = `SELECT * FROM BZCH WHERE brigade_id = ?`;
//   try {
//     const [result] = await pool.promise().query(query, [id]);
//     return result.length > 0 ? result[0].isPriorityGiven : null;
//   } catch (err) {
//     console.error("Ошибка при получении информации о пользователе:", err);
//     throw err;
//   }
// }

// Получение информации обо всех пользователях
async function getAllUsers() {
  const query = `SELECT * FROM Users`;
  try {
    const [result] = await pool.promise().query(query);
    return result.length > 0 ? result : null;
  } catch (err) {
    console.error("Ошибка при получении списка пользователей:", err);
    throw err;
  }
}

async function deleteUserFromTable(lesson, tg_id) {
  const query = `DELETE FROM ${lesson.name} WHERE tg_id = ?`;
  try {
    const [result] = await pool.promise().query(query, [tg_id]);
    console.log(`Пользователь с id ${tg_id} удалён из таблицы ${lesson.name}`);
  } catch (error) {
    console.error("Ошибка при удалении пользователя", error);
    throw error;
  }
}

async function deleteBrigadeFromTable(lesson, brigade_num) {
  const query = `DELETE FROM ${lesson.name} WHERE brigade_num = ?`;
  try {
    const [result] = await pool.promise().query(query, [brigade_num]);
    console.log(
      `Бригада с brigade_num ${brigade_num} удалена из таблицы ${lesson.name}`
    );
  } catch (error) {
    console.error("Ошибка при удалении пользователя", error);
    throw error;
  }
}

async function getPriorities() {
  const query = "SELECT * FROM priorities";
  try {
    const [result] = await pool.promise().query(query);
    return result.length > 0 ? result : null;
  } catch (err) {
    console.error("Ошибка при получении списка приоритетов:", err);
    throw err;
  }
}

async function getPriorityForLessonByID(id, lesson) {
  let query;
  if (lesson.isBrigadeType) {
    const brigades = await getBrigades(lesson.name);
    query = `SELECT priority FROM ${lesson.name}_priorities WHERE brigade_num = ?`;
    try {
      const [rows] = await pool.promise().query(query, [id]);
      return rows.length > 0 ? rows[0]["priority"] : null;
    } catch (err) {
      console.error(`Ошибка при получении приоритета для ${lesson.name}:`, err);
      throw err;
    }
  } else {
    const columnName = lesson.name + "_priority";
    query = `SELECT ${columnName} FROM priorities WHERE tg_id = ?`;
    try {
      const [rows] = await pool.promise().query(query, [id]);
      return rows.length > 0 ? rows[0][columnName] : null;
    } catch (err) {
      console.error(`Ошибка при получении приоритета для ${lesson.name}:`, err);
      throw err;
    }
  }
}

// async function getBZCHPriorityTable() {
//   const query = `SELECT * FROM BZCH_Priority`;
//   try {
//     const [result] = await pool.promise().query(query);
//     return result.length > 0 ? result : null;
//   } catch (err) {
//     console.error("Ошибка при получении списка пользователей:", err);
//     throw err;
//   }
// }

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
    const surnames = result.map((row) => row.surname);
    return surnames.includes(surname);
  } catch (err) {
    console.error("Ошибка при проверке фамилии в таблице пользователей:", err);
    throw err;
  }
}

async function isInQueue(tg_id, subject) {
  const query = `SELECT tg_id FROM ${subject}`;
  try {
    const [result] = await pool.promise().query(query);
    const surnames = result.map((row) => row.tg_id);
    return surnames.includes(tg_id);
  } catch (err) {
    console.error(`Ошибка при проверке айди в таблице ${subject}:`, err);
    throw err;
  }
}

// async function isInBZCH(id) {
//   const query = `SELECT brigade_id FROM BZCH`;
//   try {
//     const [result] = await pool.promise().query(query);
//     const ids = result.map((row) => row.brigade_id);
//     return ids.includes(id);
//   } catch (err) {
//     console.error("Ошибка при проверке бригады в таблице БЖЧ:", err);
//     throw err;
//   }
// }

// Вставка очереди пользователей в таблицу предмета
async function insertIntoQueue(options, lesson) {
  let data;
  let qry;
  if (lesson.isBrigadeType) {
    data = [options.brigade_num, options.labs, true];
    qry = `INSERT INTO ${lesson.name} (brigade_num, labs, isPriorityGiven) VALUES (?, ?, ?)`;
  } else {
    data = [options.tg_id, options.surname, options.labs, options.subgroup];
    qry = `INSERT INTO ${lesson.name} (tg_id, surname, labs, subgroup) VALUES (?, ?, ?, ?)`;
  }

  try {
    const [result] = await pool.promise().query(qry, data);
    console.log(
      `Пользователь ${options.surname} добавлен в таблицу ${lesson.name}.`
    );
  } catch (err) {
    console.error("Ошибка при вставке в базу данных:", err);
  }
  // if ("priority" in options) {
  //   try {
  //     if ("priority" in options) {
  //       const prQry = `UPDATE priorities SET ${lesson}_priority = ? WHERE tg_id = ?`;
  //       await pool.promise().query(prQry, [options.priority, options.tg_id]);
  //       const [result] = await pool.promise().query(qry, data);
  //     }
  //   } catch {
  //     console.error("Ошибка при обновлении приоритета:", err);
  //   }
  // }
}

async function addPriorityColumn(lesson) {
  try {
    await pool
      .promise()
      .query(
        `ALTER TABLE priorities ADD COLUMN IF NOT EXISTS ${lesson}_priority VARCHAR(255) DEFAULT 'Зелёный'`
      );
    console.log(`Колонка ${lesson}_priorities добавлена в таблицу priorities`);
  } catch (err) {
    console.error(
      `Ошибка при добавлении колокни ${lesson}_priorities в таблицу priorities:`,
      err
    );
  }
}

// // Установка приоритета пользователя по tg_id
// async function setPriority(id, priority) {
//   try {
//     const updateQuery = "UPDATE Users SET priority = ? WHERE tg_id = ?";
//     await pool.promise().query(updateQuery, [priority, id]);
//     config = await readConfig();
//     const updateKProgQuery = "UPDATE KProg SET priority = ? WHERE tg_id = ?";
//     await pool.promise().query(updateKProgQuery, [priority, id]);
//     console.log(`Priority для пользователя с id ${id} обновлён на ${priority}`);
//   } catch (err) {
//     console.error("Ошибка при обновлении приоритета:", err);
//   }
// }

// async function setBZCHPriority(id, priority) {
//   try {
//     const updateQuery =
//       "UPDATE BZCH_Priority SET priority = ? WHERE brigade_id = ?";
//     await pool.promise().query(updateQuery, [priority, id]);
//     config = await readConfig();

//     if (config.isBZCHEnd) {
//       const updateBZCHQuery =
//         "UPDATE BZCH SET priority = ? WHERE brigade_id = ?";
//       await pool.promise().query(updateBZCHQuery, [priority, id]);
//     }
//     console.log(`Priority для бригады с id ${id} обновлён на ${priority}`);
//   } catch (err) {
//     console.error("Ошибка при обновлении приоритета:", err);
//   }
// }

// async function setPriorityStatus(id, status) {
//   try {
//     const updateQuery =
//       "UPDATE BZCH SET isPriorityGiven = ? WHERE brigade_id = ?";
//     await pool.promise().query(updateQuery, [status, id]);
//     config = await readConfig();

//     console.log(
//       `Статус приоритета для бригады с id ${id} обновлён на ${status}`
//     );
//   } catch (err) {
//     console.error("Ошибка при обновлении приоритета:", err);
//   }
// }

async function setPriorityBySurname(surname, priority, lessonName) {
  try {
    const updateQuery = `UPDATE priorities SET ${lessonName}_priority = ? WHERE surname = ?`;
    await pool.promise().query(updateQuery, [priority, surname]);
    config = await readConfig();

    console.log(
      `Priority для пользователя с фамилией ${surname} обновлён на ${priority}`
    );
  } catch (err) {
    console.error("Ошибка при обновлении приоритета по фамилии:", err);
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
  createUsersTable,
  createPrioritiesTable,
  createQueueTable,
  createBrigadeTables,
  insertIntoDatabase,
  insertIntoPriority,
  isRegistered,
  getInfoById,
  getAllUsers,
  insertIntoQueue,
  getQueue,
  //   setPriority,
  isInUsers,
  getBrigades,
  setPriorityBySurname,
  clearTable,
  //   isInBZCH,
  //   getBZCHPriorityTable,
  //   setBZCHPriority,
  //   setPriorityStatus,
  //   getBZCHStatus,
  isInQueue,
  insertIntoBrigade,
  getPriorities,
  getPriorityForLessonByID,
  deleteUserFromTable,
  deleteBrigadeFromTable,
};
