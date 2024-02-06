const express = require("express");
const route = express.Router();

const coodsModel = require("./coodsModel");

route.post("/api/postDummyData", async (req, res) => {
  // console.log("Received data from background task:",);
  // Handle the data as needed
  const data = await coodsModel.create(req.body[0].coords);
  console.log(req.body[0].coords);
  res.status(200).send({ data: data, msg: "Data received successfully" });
});

route.get("/api/getDummyData", async (req, res) => {
  let { code } = req.query;
  console.log(code);
  const data = await coodsModel.find({ code: code });
  return res.status(200).send({ data: data });
});

module.exports = route;
