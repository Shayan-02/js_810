const path = require("path");
const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static frontend
app.use(express.static(path.join(__dirname, "..", "..", "frontend")));

// api
app.use("/api", apiRoutes);

// root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "..", "frontend", "index.html"));
});

// errors
app.use(errorHandler);

module.exports = app;
