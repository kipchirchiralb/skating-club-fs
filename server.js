const express = require("express");
const mysql = require("mysql");

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "albert",
  password: "password",
  database: "eldoret_skating_club",
  port: 3307,
});
// test db connection
dbConnection.connect((error) => {
  if (!error) {
    console.log("DB connected");
  } else {
    console.log(error);
  }
});

const app = express();


app.get("/", (req, res) => {
  res.send("Home/Dashboard page - Default/Root/Home route");
});

app.get("/members", (req, res) => {
  dbConnection.query("select * from members", (error, results) => {
    res.render("index.ejs", { members: results });
  });
});

// create a route for resources just like the above for members
// then create a view(ejs file in views folder) to display the data in a table


app.get("/activemembers", (req, res) => {
  dbConnection.query(
    "select * from members where membership_status = 'active'",
    (error, results) => {
      res.json(results);
    }
  );
});

app.get("/members/:id", (req, res) => {
  dbConnection.query(
    "select * from members where member_id = ?",
    [req.params.id],
    (error, results) => {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ message: "Member not found" });
      }
    }
  );
});

app.post("/payments", (req, res) => {
  // insert logi - sql to insert new record to db
  res.send("Payment record saved");
});

// at the end of the routes -- we  start the app using listen method - telling node to run and wait incoming requests
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
