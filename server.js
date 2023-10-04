require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5300;
const authController = require("./controllers/authController");
const serviceController = require("./controllers/serviceController");
const session = require("express-session");



const cors = require("cors");
const morgan = require("morgan");

//middlewares
app.use(session({ secret: "randomkey", cookie: { maxAge: 1800000 } }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

app.use("/user", authController);
app.use("/service", serviceController);


app.get("/", (req, res) => {
  res.send("login signup app");
});

app.listen(PORT, () => console.log("Server running on port " + PORT));