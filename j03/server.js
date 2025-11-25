const express = require("express");
// const http = require("http")
// const server = http.createServer((req, res) => {})

app = express(); //  server

app.get("/", (req, res) => {
  res.send('<h1 style="color : red">Hello World!</h1>');
});

app.listen(4000);
