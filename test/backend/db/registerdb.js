const mysql = require("mysql");
const regDB = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "reg",
});

module.exports = regDB;