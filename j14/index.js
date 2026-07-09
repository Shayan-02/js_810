const bcrypt = require("bcrypt");




// async bcrypt.genSalt(10, function (err, salt) {
//     const a = await bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
//         if (err) {
//             console.error(err);
//         }
//         else{
//             console.log(hash);
            
//         }
//     });
// });

//
// const y = bcrypt.hashSync(password, 10)

// console.log(x);
// console.log(y);

function checkUser(password) {
    const user = { username: "ali"};
    // post
    const passwordHashed = bcrypt.hashSync(password, 10);
    user["passwordHash"] = passwordHashed;
    console.log(user);
    // const match = bcrypt.compareSync("ali123", user.passwordHash);
    // get
    const match = bcrypt.compareSync(password, user.passwordHash);

    if (match) {console.log("login shod");}
    else{console.log("login nashod");}
}

checkUser("ali1234")
