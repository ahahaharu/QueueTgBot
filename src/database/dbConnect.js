const mysql = require("mysql2");

// Создаём пул соединений
const pool = mysql.createPool({
    port: "3306",
    user: "gen_user",
    host: "194.87.56.214",
    database: "students",
    password: "827530Ab.",
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0
});

// Проверка подключения к базе данных
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Ошибка подключения к базе данных:", err);
        return;
    }
    console.log("Подключено к базе данных через пул соединений!");
    connection.release(); // Возвращаем соединение обратно в пул
});

// Экспортируем пул для использования в других модулях
module.exports = pool;
