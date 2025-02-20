const { lessons } = require("../../data/lessons");
const {
  createUsersTable,
  createPrioritiesTable,
  createQueueTable,
  createBrigadeTables,
} = require("./database");

async function createDBTables() {
  await createUsersTable();
  lessons.forEach((ls) => {
    createQueueTable(ls);
    if (ls.isBrigadeType) {
      createBrigadeTables(ls);
    }
  });
  await createPrioritiesTable();
}

module.exports = { createDBTables };
