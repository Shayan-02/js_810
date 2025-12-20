const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3500;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/todos", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM todos ORDER BY id");
  res.json(rows);
});

app.post("/api/todos", async (req, res) => {
  const title = (req.body.title || "").trim();
  if (!title) return res.status(400).json({ message: "title required" });

  const [result] = await pool.execute(
    "INSERT INTO todos (title, done) VALUES (?, 0)",
    [title]
  );
  const [rows] = await pool.query("SELECT * FROM todos WHERE id=?", 
    [result.insertId]);
  res.status(201).json(rows[0]);
});

app.patch("/api/todos/:id/toggle", async (req, res) => {
  const id = req.params.id;
  await pool.execute("UPDATE todos SET done = 1 - done WHERE id=?", [id]);
  const [rows] = await pool.query("SELECT * FROM todos WHERE id=?", [id]);
  res.json(rows[0]);
});

app.delete("/api/todos/:id", async (req, res) => {
  await pool.execute("DELETE FROM todos WHERE id=?", [req.params.id]);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});