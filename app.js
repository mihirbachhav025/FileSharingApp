const express = require("express");
const logger = require("morgan");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const router = require("./routes/files");
require("dotenv").config();
const app = express();

app.use(logger("dev"));
app.use(bodyparser.json());

//routes
app.get("/", (req, res) => {
  res.render("File Sharing app");
});
app.use("/api/v1", router);

//server
app.use((req, res, next) => {
  const err = new Error("Not found ");
  err.status = 404;
  next(err);
});
//Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;
  //Respond to client
  res.status(status).json({
    error: {
      message: error.message,
    },
  });
  //Respond to ourselves
  console.log(err);
});

//server
const port = process.env.port || 5000;
mongoose.connect(String(process.env.Mongo_Uri)).then(() => {
  app.listen(port, () => {
    console.log("Server is listening on port", port);
  });
});
