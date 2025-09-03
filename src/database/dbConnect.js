const mysql = require('mysql2');
const fs = require('fs');

const pool = mysql.createPool({
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  ssl: {
    ca: fs.readFileSync(__dirname + '/ca.crt'),
  },
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    return;
  }
  console.log('Подключено к базе данных через пул соединений!');
  connection.release();
});

module.exports = pool;
