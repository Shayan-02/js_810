const http = require("http");

const database = {
    users: [
        {user1: "ali rezaee", age: 20, id: 1 },
        {user2: "reza akbari", age: 22, id: 2 },
        {user3 : "sara rezaee", age : 21, id : 3}
    ],
    classes: [
        {class1: "python", time: 50, id: 123},
        {class1: "js", time: 30, id: 456},
        {class1: "lpic", time: 40, id: 789}
    ]
}


const server = http.createServer((req, res) => {
    console.log(req.url);
    if (req.url == '/api/users/') {
        let users = database.users;
        res.write(JSON.stringify(users));
        console.log("user show");
        res.end();
    }
    else if (req.url == '/api/courses/') {
        let courses = database.classes;
        res.write(JSON.stringify(courses));
        console.log("courses showed");
        res.end();
        
    }
    else if (req.url == '/') {
        res.write("Hello world")
        res.end()
    }
    else {
        res.write("404 not found")
        res.end()
    }
})

server.listen(1234)
