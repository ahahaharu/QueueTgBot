var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "students",
    password: "827530"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the database!");
});

module.exports = con;
