const { getBrigades } = require("../database/database");

async function getBrigadeNum(subject, userId) {
  const brigades = await getBrigades(subject);
  return brigades.find((line) => line.tg_id == userId).brigade_num;
}

module.exports = { getBrigadeNum };
