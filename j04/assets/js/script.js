// Add your JavaScript code here
const express = require("express");
const app = express();

const courses = [
  { id: 1, title: "js", time: 50 },
  { id: 2, title: "phyton", time: 30 },
  { id: 3, title: "icdl", time: 20 },
];

app.get("/courses/:id", (req, res) => {
    const course = courses.find(
      (course) => course.id === Number(req.params.id)
    );

    if (course) {
      res.send(course);
    } else {
      res.send("course not found");
    }
  });

app.listen(1234, () => {
  console.log("listenin on port 1234");
});