const express = require("express");
const route = express.Router();

const coodsModel = require("./coodsModel");

route.post("/coords/postData", async (req, res) => {
  let { email, date } = req.query;

  const updatedDocument = await coodsModel.findOneAndUpdate(
    { email: email },
    {
      $push: {
        [`Location.${date}`]: req.body[0].coords,
      },
    },
    { new: true }
  );
  if (updatedDocument) {
    console.log("data added successfully", date);
  }
  res.status(200).send({ msg: "Data received successfullyy" });
});

route.get("/coords/getData", async (req, res) => {
  let { email } = req.query;
  const data = await coodsModel.findOne({ email: email });
  console.log("coords data send successfully");
  return res.status(200).send({ data: data });
});

route.post("/signup", async (req, res) => {
  let { email } = req.query;
  const existingUser = await coodsModel.findOne({ email: email });
  if (existingUser) {
    return res
      .status(200)
      .send({ status: "OK", message: "Email already exists" });
  } else {
    const body = { email: email, Location: {} };
    const data = await coodsModel.create(body);
    console.log("signup successfully");
    res.status(200).send({ status: "OK", data: data });
  }
});

route.get("/getAllData", async (req, res) => {
  const data = await coodsModel.find();
  console.log("All data send successfully");
  return res.status(200).send({ data: data });
});

module.exports = route;
