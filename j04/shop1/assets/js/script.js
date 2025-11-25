// Add your JavaScript code here
const express = require("express");
const mysql = require("mysql");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "shop1",
});

db.connect(function (err) {
  if (err) console.error(err);
  console.log("Connected!");
  db.query(
    "CREATE TABLE customers (name VARCHAR(255), address VARCHAR(255))",
    function (err, result) {
      if (err) console.error(err);
      console.log("table created");
    }
  );
});
