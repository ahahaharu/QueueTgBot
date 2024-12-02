const mysql = require("mysql2");

const pool = mysql.createPool({
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Ошибка подключения к базе данных:", err);
        return;
    }
    console.log("Подключено к базе данных через пул соединений!");
    connection.release(); 
});

module.exports = pool;
