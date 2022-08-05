const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");

const feedRoutes = require("./routes/feed");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

app.use("/images", express.static(path.join(__dirname, "./images")));

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((error, req, res, next) => {
  console.log(error, "this is running");
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({
    messgae: message,
  });
});

mongoose
  .connect("mongodb+srv://arslan:arslan@cluster0.05v1x.mongodb.net/post")
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err, "app is not started"));
