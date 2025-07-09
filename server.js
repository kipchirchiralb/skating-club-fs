const express = require("express");
const mysql = require("mysql");
const session = require("express-session");

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

// middleware to parse the body of the request
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "uglify",
    resave: false,
  })
);
app.use((req, res, next) => {
  console.log(req.session.user);
  next();
});

app.get("/", (req, res) => {
  res.send("Home/Dashboard page - Default/Root/Home route");
});

app.get("/members", (req, res) => {
  if (req.session.user) {
    console.log("User is logged in:", req.session.user.username);
  } else {
    return res.redirect("/login");
  }
  dbConnection.query("select * from members", (error, results) => {
    res.render("index.ejs", { members: results });
  });
});

// Auth routes
app.get("/login", (req, res) => {
  // console.log(req);
  res.render("login.ejs");
});

app.post("/login", (req, res) => {
  console.log(req.body.username, req.body.password);
  dbConnection.query(
    "SELECT * FROM admins WHERE username = ? AND password = ?",
    [req.body.username, req.body.password],
    (error, results) => {
      console.log(results);
      if (results.length === 0) {
        return res.status(401).send("Invalid username or password");
      } else {
        // Store user info in session
        req.session.user = results[0];
        res.send("Login successful");
      }
    }
  );
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
