const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();
const setupRoutes = require("./Routes/index");
const socketService = require("./Config/Sockets/sockets");
const port = process.env.PORT || 8080;

let app = express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
const server = require("http").Server(app);
socketService(server);
setupRoutes(app);

mongoose
  .connect('mongodb+srv://betainformally:betaversion@beta.wbpvhl2.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((res) => {
    console.log("Database connected successfully!");
  })
  .catch((error) => {
    console.log("Error occured while connecting", error);
  });

server.listen(port, () => {
  console.log("Server running on port no :- ", port);
});
