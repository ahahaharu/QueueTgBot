const mysql = require("mysql2");

const connection = mysql.createConnection({
    port: "3306",
    user: "gen_user",
    host: "194.87.56.214",
    database: "students",
    password: "827530Ab\."
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the database!");
});

module.exports = connection;
