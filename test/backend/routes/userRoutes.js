const express = require('express');
usersRoutes = express.Router();
usersRoutes.post('/', (req, res) => {
  regDB.connect((err) => {
    if (err) console.error(err);
    else {
      console.log("connected to db");
      let insertNewUser =
        "INSERT INTO `users` VALUES (NULL, 'ali rezaee', 'ali123', '123456', '1404/09/24')";
      regDB.query(insertNewUser, (err, res) => {
        if (err) console.error(err);
        else {
          console.log("1 user inserted");
        }
      });
    }
  });
})