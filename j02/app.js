let f = require("fs")
console.log(f);
f.writeFile("1.txt", "Hello world", (err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log("File created");
    }
});

f.appendFile("1.txt", "\nBye world", (err) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log("File updated");
    }
});

f.readFile("1.txt", "utf-8", (err, data) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(data);
    }
});
