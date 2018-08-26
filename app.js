// Loading modules
const express = require("express");
const mongoose = require("mongoose");

// Setting up the app
const app = express();
app.use("/assets", express.static("assets"));
module.exports.app = app;

// Loading the controller
const Controller = require("./controllers/Articles");
const controller = new Controller();
controller.setApp();
controller.setApi();
controller.setRoutes();

//starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Started the server at " + 3000));
