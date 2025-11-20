const express = require("express");

const app = express();

const courses = [

    {id: 1, title: "JS", time: 60},
    {id: 2, title: "python", time: 50},
    {id: 3, title: "web design", time: 30},
    {id: 4, title: "SQL", time: 20}
];

// app.get("/courses/", (req, res) => {
//     const courses = courses.courses_list;
//     res.send(courses)
// })

app.get("/courses/:time", (req, res) => {
    const course = courses.find((course) => course.time === +(req.params.time));

    if (course) {
        res.send(course);
    } else {
        res.send("Course Not Found :((");
    }
});

app.post("/courses", (req, res) => {
    res.status(201).send(`New Course Created Successfully`);

    res.statusCode = 202;
    res.send(`New Course Created Successfully`);
});

app.delete("/courses/:id", (req, res) => {
    res.status(200).send(`Main Course Removed Successfully`);
});

app.put("/courses/:id", (req, res) => {
    res.status(401).send(`Main Course Updated Successfully`);
});

app.listen(4000, () => {
    console.log(`Server Running On Port 3000`);
});
