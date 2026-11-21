// app.js

var dotenv = require("dotenv");
dotenv.config();

const express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");

var user = require("./routes/user"); // Imports routes for the user

var app = express();

app.use(cors());
app.use(express.json({ extended: true, limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

// Set up mongoose connection
var mongoDBURI = process.env.MONGO_DEV_URI;
mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("MongoDB connected"));

app.use("/user", user);

app.get("/health", (req, res) => res.json({ ok: true }));

// Nothing below this line matched a route.
app.use((req, res) => res.status(404).json({ message: "Not found" }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

module.exports = app;
