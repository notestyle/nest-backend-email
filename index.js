const httpLib = require("http");
const express = require("express");
require("dotenv").config();

// postgresql сонгосон бол энэ доорх мөрийн uncomment
// const { createConnection } = require("./src/common/pg");

// mongodb сонгосон бол энэ доорх мөрийн uncomment
// const { createConnection } = require("./src/common/mongo");

var bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// Body Json
app.use(bodyParser.json());

app.use(cors());
app.options("*", cors());

async function createEndpoints() {
  const connection = await createConnection();
  fs.readdirSync(path.join(__dirname, "/src/services")).forEach((file) => {
    require(path.join(__dirname, "/src/services", file))(app, connection);
  });
}

createEndpoints();

const http = httpLib.createServer(app);
http.listen(process.env.PORT, () =>
  console.log("HTTP API listening on port ", process.env.PORT, "!")
);
