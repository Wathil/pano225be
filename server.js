const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
//   origin: "http://localhost:8081",
  origin: "http://localhost:3002",
};

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to pano225 application." });
});

const db = require("./app/models");
db.mongoose
.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Connected to the database!");
})
.catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
});

require("./app/routes/article.routes")(app); // ROUTES

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => { // EN DERNIER
  console.log(`Server is running on port ${PORT}.`);
});