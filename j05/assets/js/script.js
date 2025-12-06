// Add your JavaScript code here
const express = require('express');
const mysql = require('mysql');

const app = express()

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "node_shop",
});

db.connect(function (err) {
  if (err) console.error(err);
  console.log("Connected!");
  db.query(
    "CREATE TABLE users (name VARCHAR(255), address VARCHAR(255))",
    function (err, result) {
      if (err) console.error(err);
      console.log("table created");
    }
  );
});

app.listen(3000, (err) =>{
  if (err) console.error(err);
  console.log("port 3000 connected!");
})