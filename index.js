const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const route = require("./src/routes");

const app = express();

app.use(express.static("public"));

app.use(express.json({ limit: "10000mb" }));
app.use(cors());

const URL = process.env.DB_URL;
const connection = mongoose
  .connect(URL)
  .then(() => console.log("MongoDb is connected."))
  .catch((err) => console.log("Error connecting to mongodb.", err));

app.use("/", route);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Express is running on port ${PORT}`);
});
